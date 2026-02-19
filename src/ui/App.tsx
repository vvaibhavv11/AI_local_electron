import { useState, Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { Toast } from './components/Toast';
import { MessageList } from './components/messages/MessageList';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Message, MessageType, ModelResponseChunk, ModelSegmentType, Conversation, ToastType } from './types';
import { v4 as uuidv4 } from 'uuid';

// History array is maintained by node-llama-cpp's LlamaChatSession internally.
// We no longer manually concatenate context strings.

const handleSubmit = async (
    content: string,
    setMessages: Dispatch<SetStateAction<Message[]>>,
    setIsGenerating: Dispatch<SetStateAction<boolean>>
) => {
    // @ts-expect-error window.api
    window.backend.removeAIResponseStreamListeners();

    setIsGenerating(true);

    const userMessage: Message = {
        id: uuidv4(),
        content,
        type: MessageType.USER,
        isLoading: false,
        segmentType: undefined
    };

    setMessages(prev => [...prev, userMessage]);

    const aiMessageId = uuidv4();
    const aiMessage: Message = {
        id: aiMessageId,
        content: '',
        type: MessageType.AI,
        isLoading: true,
        segmentType: undefined
    };

    setMessages(prev => [...prev, aiMessage]);

    // @ts-expect-error window.api
    await window.backend.aiResponse(content);

    let currentResponse = '';
    let currentThought = '';
    let lastMessageType: ModelSegmentType = undefined;
    const thoughtUuid = uuidv4();

    // @ts-expect-error window.api
    await window.backend.aiResponseStream((res: ModelResponseChunk) => {
        if (res.segmentType === "thought") {
            currentThought += res.text;
            const newMessage: Message = {
                id: thoughtUuid,
                content: currentThought,
                type: "ai",
                isLoading: false,
                segmentType: "thought"
            };
            setMessages(pre => [...pre.slice(0, -1), newMessage]);
            lastMessageType = res.segmentType;
        }
        if (res.segmentType === undefined && lastMessageType === undefined) {
            currentResponse += res.text;
            const newMessage: Message = {
                id: aiMessageId,
                content: currentResponse,
                type: "ai",
                isLoading: false,
                segmentType: undefined
            };
            setMessages(pre => [...pre.slice(0, -1), newMessage]);
            lastMessageType = res.segmentType;
        }
        if (res.segmentType === undefined && lastMessageType === "thought") {
            currentResponse += res.text;
            const newMessage: Message = {
                id: uuidv4(),
                content: currentResponse,
                type: "ai",
                isLoading: false,
                segmentType: undefined
            };
            setMessages(pre => [...pre, newMessage]);
            lastMessageType = res.segmentType;
        }
    });

    // @ts-expect-error window.api
    await window.backend.aiResponseDone(() => {
        setIsGenerating(false);
    });

    // @ts-expect-error window.api
    await window.backend.aiResponseError((error: { message: string }) => {
        setIsGenerating(false);
        console.error('AI Response Error:', error.message);
    });
};

function App() {
    const [modelLoaded, setModelLoaded] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [conversations, setConversations] = useState<Conversation[]>([{
        id: 'mock-1',
        title: 'System Diagnostics',
        messages: [
            { id: 'm1', content: 'Initialize diagnostics sequence?', type: MessageType.USER, isLoading: false, segmentType: undefined },
            { id: 'm2', content: 'Scanning neural pathways...', type: MessageType.AI, segmentType: 'thought', isLoading: false },
            { id: 'm3', content: 'All systems are functioning within normal parameters.\n\n### System Status\n- **Core Engine**: Online\n- **Memory**: 32% Sub-allocated\n- **Neural Link**: Stable\n\n```rust\nfn check_status() -> bool {\n    true\n}\n```', type: MessageType.AI, isLoading: false, segmentType: undefined }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
    }]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>('mock-1');

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const messages = activeConversation?.messages ?? [];

    useEffect(() => {
        // Reset the backend model's session when a conversation changes
        // so context isn't leaked across chats.
        // @ts-expect-error window.api
        if (window.backend?.resetSession) {
            // @ts-expect-error Wait for next tick so electron api is injected
            window.backend.resetSession().catch(console.error);
        }
    }, [activeConversationId]);

    const showToastMessage = (message: string, type: ToastType = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const setMessages = useCallback((updater: SetStateAction<Message[]>) => {
        setConversations(prev => prev.map(c => {
            if (c.id !== activeConversationId) return c;
            const newMessages = typeof updater === 'function' ? updater(c.messages) : updater;
            // Auto-title from first user message
            let title = c.title;
            if (title === 'New Chat' && newMessages.length > 0) {
                const firstUserMsg = newMessages.find(m => m.type === MessageType.USER);
                if (firstUserMsg) {
                    title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '');
                }
            }
            return { ...c, messages: newMessages, title, updatedAt: Date.now() };
        }));
    }, [activeConversationId]);

    const handleNewChat = () => {
        const newConv: Conversation = {
            id: uuidv4(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
    };

    const handleDeleteConversation = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
            setActiveConversationId(conversations.length > 1 ? conversations.find(c => c.id !== id)?.id ?? null : null);
        }
    };

    const handleModelLoad = async () => {
        try {
            // @ts-expect-error window.api
            const done = await window.backend.loadModel();
            setModelLoaded(done ?? false);
            if (done) {
                showToastMessage('Model loaded successfully', 'success');
            }
        } catch (error) {
            console.error("Error loading model:", error);
            showToastMessage('Failed to load model', 'error');
        }
    };

    const handleEject = async () => {
        // @ts-expect-error window.api
        const done = await window.backend.ejectModel();
        if (done) {
            setModelLoaded(false);
            showToastMessage('Model ejected', 'info');
        }
    };

    const handleSendMessage = (content: string) => {
        // Auto-create a conversation if none is active
        if (!activeConversationId) {
            const newConv: Conversation = {
                id: uuidv4(),
                title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            setConversations(prev => [newConv, ...prev]);
            setActiveConversationId(newConv.id);

            // Need a slight delay so state picks up the new active conversation
            setTimeout(() => {
                handleSubmit(content, (updater: SetStateAction<Message[]>) => {
                    setConversations(prev => prev.map(c => {
                        if (c.id !== newConv.id) return c;
                        const newMessages = typeof updater === 'function' ? updater(c.messages) : updater;
                        return { ...c, messages: newMessages, updatedAt: Date.now() };
                    }));
                }, setIsGenerating);
            }, 50);
            return;
        }

        handleSubmit(content, setMessages, setIsGenerating);
    };

    return (
        <Layout>
            <Toast
                show={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />

            <Sidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                modelLoaded={modelLoaded}
                onNewChat={handleNewChat}
                onSelectConversation={setActiveConversationId}
                onDeleteConversation={handleDeleteConversation}
                onLoadModel={handleModelLoad}
                onEjectModel={handleEject}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header modelLoaded={modelLoaded} />

                {messages.length === 0 ? (
                    <WelcomeScreen
                        onSuggestionClick={handleSendMessage}
                        modelLoaded={modelLoaded}
                    />
                ) : (
                    <MessageList messages={messages} />
                )}

                <InputForm
                    onSubmit={handleSendMessage}
                    modelLoaded={modelLoaded}
                    disabled={isGenerating}
                />
            </div>
        </Layout>
    );
}

export default App;
