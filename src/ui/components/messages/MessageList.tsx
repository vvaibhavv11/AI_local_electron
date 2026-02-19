import { useRef, useEffect } from 'react';
import { Message, MessageType } from '../../types/index';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import { ThinkingBlock } from './ThinkingBlock';
import { ThoughtFold } from './ThoughtFold';

type MessageListProps = {
    messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto px-6 py-8 dot-grid flex flex-col items-center">
            <div className="max-w-3xl w-full flex flex-col">
                {messages.map((message) => {
                    if (message.type === MessageType.AI && message.isLoading) {
                        return <ThinkingBlock key={message.id} />;
                    }
                    if (message.type === MessageType.AI) {
                        if (message.segmentType === "thought") {
                            return <ThoughtFold key={message.id} content={message.content} />;
                        }
                        return (
                            <AIMessage key={message.id} content={message.content}
                                isLoading={message.isLoading} segmentType={message.segmentType} />
                        );
                    }
                    return <UserMessage key={message.id} content={message.content} />;
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
