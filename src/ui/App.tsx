import { scan } from "react-scan"; // must be imported before React and React DOM
import { useState } from "react";
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { InputForm } from './components/InputForm';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { MessageList } from './components/messages/MessageList';
import { Message, MessageType, ModelResponseChunk, ModelSegmentType } from './types';
import { v4 as uuidv4 } from 'uuid';
// import { dialog } from "electron";
scan({
    enabled: false,
});

function App() {
    const [modelLoaded, setModelLoaded] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handleModelLoad = async () => {
        try {
            // @ts-ignore
            const done = await window.backend.loadModel();
            setModelLoaded(done);
            if (done) {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error loading model:", error);
        }
    };

    const handleEject = () => {
        setModelLoaded(false);
    };

    const formatMessagesForContext = (messages: Message[]): string => {
        return messages
            .filter(msg => !msg.segmentType) // Only include non-thought messages
            .map(msg => {
                const role = msg.type === MessageType.USER ? "user" : "assistant";
                return `<|im_start|>${role}\n${msg.content}<|im_end|>\n`;
            })
            .join("");
    };

    const handleSubmit = async (content: string) => {
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

        const conversationHistory = formatMessagesForContext(messages);
        const fullPrompt = `${conversationHistory}<|im_start|>user\n${content}<|im_end|>\n<|im_start|>assistant\n`;

        // @ts-ignore
        await window.backend.aiResponse(fullPrompt);

        let currentResponse = '';
        let currentThought = '';
        let lastMessageType: ModelSegmentType = undefined;

        // @ts-ignore
        await window.backend.aiResponseStream((res: ModelResponseChunk) => {
            if (res.segmentType === "thought" && lastMessageType === undefined) {
                currentThought += res.text 
                const newMessage: Message = {
                    id: uuidv4(),
                    content: currentThought,
                    type: "ai",
                    isLoading: false,
                    segmentType: "thought"
                }
                setMessages(pre => [...pre.slice(0, -1), newMessage])
            }
            if (res.segmentType == "thought" && lastMessageType === "thought"){
                currentThought += res.text 
                const newMessage: Message = {
                    id: uuidv4(),
                    content: currentThought,
                    type: "ai",
                    isLoading: false,
                    segmentType: "thought"
                }
                setMessages(pre => [...pre.slice(0, -1), newMessage])
            }
            if (res.segmentType === undefined && lastMessageType === undefined) {
                currentResponse += res.text 
                const newMessage: Message = {
                    id: uuidv4(),
                    content: currentResponse,
                    type: "ai",
                    isLoading: false,
                    segmentType: undefined
                }
                setMessages(pre => [...pre.slice(0, -1), newMessage])
            }
            if (res.segmentType === undefined && lastMessageType === "thought") {
                currentResponse += res.text 
                const newMessage: Message = {
                    id: uuidv4(),
                    content: currentResponse,
                    type: "ai",
                    isLoading: false,
                    segmentType: undefined
                }
                setMessages(pre => [...pre, newMessage])
            }
            lastMessageType = res.segmentType
        });
    };

    return (
        <Layout>
            <Toast show={showToast} message="Model loaded successfully" />
            <Header />

            <div className="flex-1 w-full max-w-4xl px-4">
                <MessageList messages={messages} />
                {/* Messages will appear here */}
            </div>

            <div className="w-full max-w-4xl flex justify-center items-center space-x-4 px-4 mb-8">
                <Button
                    modelLoaded={modelLoaded}
                    onClick={modelLoaded ? handleEject : handleModelLoad}
                />
                <InputForm onSubmit={handleSubmit} />
            </div>

            <Footer />
        </Layout>
    );
}

export default App;
