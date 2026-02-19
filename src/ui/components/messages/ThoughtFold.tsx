import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronRight, Binary } from 'lucide-react';

type ThoughtFoldProps = {
    content: string;
}

export const ThoughtFold = ({ content }: ThoughtFoldProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4 ml-[40px] anim-enter max-w-[85%]">
            <button onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 font-display text-[10px] tracking-widest py-1.5 px-3 border transition-all hover:cursor-pointer"
                style={{
                    color: isOpen ? 'var(--c-magenta)' : 'var(--c-text-muted)',
                    background: isOpen ? 'var(--c-magenta-dim)' : 'var(--c-surface-1)',
                    borderColor: isOpen ? 'var(--c-magenta)' : 'var(--border)',
                }}
                onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.color = 'var(--c-magenta)'; e.currentTarget.style.borderColor = 'var(--c-magenta-dim)'; } }}
                onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.color = 'var(--c-text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
            >
                <Binary size={12} />
                <span>DEBUG_OUTPUT // REASONING_TRACE</span>
                {isOpen ? <ChevronDown size={14} className="ml-2" /> : <ChevronRight size={14} className="ml-2" />}
            </button>

            <div className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? '3000px' : '0', opacity: isOpen ? 1 : 0 }}>
                <div className="mt-2 p-4 font-mono text-[11px] leading-relaxed"
                    style={{
                        color: 'var(--c-magenta)',
                        background: 'var(--c-black)',
                        border: '1px dashed var(--c-magenta-dim)',
                    }}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
