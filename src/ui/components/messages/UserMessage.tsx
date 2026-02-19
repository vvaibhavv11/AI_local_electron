import { User } from 'lucide-react';

type UserMessageProps = {
    content: string;
}

export const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className="flex gap-3 mb-6 justify-end anim-enter">
            <div className="max-w-[85%] relative">
                <div className="flex items-center gap-2 mb-1 justify-end">
                    <span className="font-display text-[10px] tracking-widest cyber-glow" style={{ color: 'var(--c-cyan)' }}>
                        OPERATOR
                    </span>
                    <User size={12} style={{ color: 'var(--c-cyan)' }} />
                </div>
                <div
                    className="cyber-panel px-5 py-4 border-r-4"
                    style={{
                        background: 'var(--c-surface-2)',
                        borderRightColor: 'var(--c-cyan)',
                        borderLeft: '1px solid var(--border)',
                        borderTop: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <p className="font-mono text-[16px] leading-[1.6] whitespace-pre-wrap" style={{ color: 'var(--c-text-main)' }}>
                        {'>'} {content}
                    </p>
                </div>
            </div>
        </div>
    );
};
