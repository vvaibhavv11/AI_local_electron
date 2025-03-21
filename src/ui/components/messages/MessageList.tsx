import { Message, MessageType } from '../../types/index';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import { ThinkingBlock } from './ThinkingBlock';
import { ThoughtFold } from './ThoughtFold';

type MessageListProps = {
    messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div className="flex flex-col space-y-4 overflow-y-auto">
            {messages.map((message) => {
                if (message.type === MessageType.AI && message.isLoading) {
                    return <ThinkingBlock key={message.id} />;
                }

                if (message.type === MessageType.AI) {
                    if (message.segmentType === "thought") {
                        return <ThoughtFold key={message.id} content={message.content} />;
                    }
                    return (
                        <AIMessage 
                            key={message.id}
                            content={message.content} 
                            isLoading={message.isLoading} 
                            segmentType={message.segmentType}
                        />
                    );
                }

                return <UserMessage key={message.id} content={message.content} />;
            })}
        </div>
    );
};
