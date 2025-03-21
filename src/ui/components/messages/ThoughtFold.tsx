import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronRight } from 'lucide-react';

type ThoughtFoldProps = {
    content: string;
}

export const ThoughtFold = ({ content }: ThoughtFoldProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-[#D4A6A6]/80 hover:text-[#D4A6A6] text-sm"
            >
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>View thinking process</span>
            </button>

            {isOpen && (
                <div className="mt-2 p-4 bg-[#3A2525] rounded-lg text-[#D4A6A6]/80 italic">
                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}; 
