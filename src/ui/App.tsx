import { scan } from "react-scan"; // must be imported before React and React DOM
import { useState } from "react";
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { InputForm } from './components/InputForm';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { MessageList } from './components/messages/MessageList';
import { Message, MessageType } from './types';
import { v4 as uuidv4 } from 'uuid';
// import { dialog } from "electron";
scan({
    enabled: false,
});

function App() {
    const [modelLoaded, setModelLoaded] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const openFileSelector = async () => {
        // @ts-ignore
        const isLoaded = await window.backend.loadModel();
        console.log(isLoaded);
        if (isLoaded) {
            setModelLoaded(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleEject = () => {
        setModelLoaded(false);
    };

    const formatMessagesForContext = (messages: Message[]): string => {
        return messages.map(msg =>
            `<|im_start|>${msg.type === 'user' ? 'user' : 'assistant'}\n${msg.content}<|im_end|>\n`
        ).join('');
    };

    const handleSubmit = async (content: string) => {
        const userMessage: Message = {
            id: uuidv4(),
            content,
            type: "user",
            isLoading: false,
        };

        setMessages(prev => [...prev, userMessage]);

        // Create initial AI message with loading state
        const aiMessageId = uuidv4();
        const aiMessage: Message = {
            id: aiMessageId,
            content: '▋', // Using a block character as typing indicator
            type: MessageType.AI,
            isLoading: true // Add this to Message type
        };

        setMessages(prev => [...prev, aiMessage]);

        // Format previous context with the new format
        const conversationHistory = formatMessagesForContext(messages);
        const fullPrompt = `${conversationHistory}<|im_start|>user\n${content}<|im_end|>\n<|im_start|>assistant\n`;

        // @ts-ignore
        await window.backend.aiResponse(fullPrompt);

        //     const onEvent = new Channel<aiResponse>();
        let fullResponse = '';
        //
        // @ts-ignore
        await window.backend.aiResponseStream((res: string) => {
            fullResponse += res;
            setMessages(prev => {
                // Create a copy of the array without the last message
                const newMessages = prev.slice(0, -1);

                // Add a new message with the updated content
                return [...newMessages, {
                    id: aiMessageId,
                    content: fullResponse,
                    type: MessageType.AI,
                    isLoading: false
                }];
            });
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
                    onClick={modelLoaded ? handleEject : openFileSelector}
                />
                <InputForm onSubmit={handleSubmit} />
            </div>

            <Footer />
        </Layout>
    );
}

export default App;
