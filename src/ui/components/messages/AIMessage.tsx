/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModelSegmentType } from "../../types/index";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

type AIMessageProps = {
    content: string;
    isLoading: boolean;
    segmentType: ModelSegmentType;
}

const CopyButton = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

    return (
        <button onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 font-mono text-[10px] transition-all hover:cursor-pointer cyber-button"
            style={{
                background: copied ? 'var(--c-cyan)' : 'var(--c-black)',
                color: copied ? 'var(--c-black)' : 'var(--c-cyan)',
            }}
        >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'COPIED' : 'COPY'}
        </button>
    );
};

export const AIMessage = ({ content }: AIMessageProps) => {
    const components: any = {
        code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');

            if (match) {
                return (
                    <div className="my-5 cyber-panel overflow-hidden" style={{ border: '1px solid var(--border-strong)' }}>
                        <div className="flex items-center justify-between px-4 py-2 bg-black border-b"
                            style={{ borderColor: 'var(--border-strong)' }}>
                            <span className="font-display text-[10px] tracking-widest" style={{ color: 'var(--c-magenta)' }}>
                                {match[1]} // EXEC
                            </span>
                            <CopyButton code={code} />
                        </div>
                        <SyntaxHighlighter
                            style={synthwave84}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                                margin: 0,
                                padding: '1.25rem',
                                background: 'var(--c-surface-1)',
                                fontSize: '15px',
                                fontFamily: "'Space Mono', monospace",
                                lineHeight: '1.6',
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                );
            }
            return (
                <code className="font-mono text-[14px] px-1.5 py-0.5 mx-0.5"
                    style={{ background: 'var(--c-surface-3)', color: 'var(--c-cyan)', border: '1px solid var(--border-strong)' }}
                    {...props}>{children}</code>
            );
        },
        p({ children }: any) { return <p className="mb-4 last:mb-0 leading-[1.7] font-mono text-[16px]">{children}</p>; },
        ul({ children }: any) { return <ul className="list-square ml-6 mb-4 space-y-2 font-mono text-[16px] marker:text-cyan-500">{children}</ul>; },
        ol({ children }: any) { return <ol className="list-decimal ml-6 mb-4 space-y-2 font-mono text-[16px] marker:text-cyan-500">{children}</ol>; },
        li({ children }: any) { return <li className="pl-1 leading-[1.7]">{children}</li>; },
        h1({ children }: any) { return <h1 className="text-xl font-display tracking-widest mb-4 mt-6 first:mt-0 cyber-glow-amber" style={{ color: 'var(--c-amber)' }}>{children}</h1>; },
        h2({ children }: any) { return <h2 className="text-lg font-display tracking-wider mb-3 mt-5 first:mt-0" style={{ color: 'var(--c-text-main)' }}>{children}</h2>; },
        h3({ children }: any) { return <h3 className="text-base font-display tracking-wide mb-2 mt-4 first:mt-0" style={{ color: 'var(--c-cyan)' }}>{children}</h3>; },
        blockquote({ children }: any) {
            return (
                <blockquote className="pl-4 py-2 mb-4 font-mono text-[16px] border-l-4"
                    style={{ borderColor: 'var(--c-magenta)', color: 'var(--c-text-muted)', background: 'var(--c-surface-2)' }}>
                    {children}
                </blockquote>
            );
        },
        hr() { return <hr className="my-6 border-0 h-[1px]" style={{ background: 'var(--border-strong)' }} />; },
        a({ children, href }: any) {
            return <a href={href} target="_blank" rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-1 font-bold transition-all hover:bg-cyan-900/30"
                style={{ color: 'var(--c-cyan)' }}>{children}</a>;
        },
        strong({ children }: any) { return <strong className="font-bold" style={{ color: 'var(--c-amber)' }}>{children}</strong>; },
    };

    return (
        <div className="flex gap-4 mb-8 anim-enter max-w-[85%]">
            {/* AI Node Connector line */}
            <div className="relative flex-shrink-0 flex flex-col items-center top-1">
                <div className="w-8 h-8 flex items-center justify-center border border-amber-500"
                    style={{ background: 'var(--c-black)', boxShadow: '0 0 10px var(--c-amber-dim)' }}>
                    <Terminal size={14} color="var(--c-amber)" />
                </div>
                <div className="w-[1px] h-full mt-2 opacity-50" style={{ background: 'linear-gradient(to bottom, var(--c-amber), transparent)' }} />
            </div>

            <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className="font-display text-[10px] tracking-[0.2em] cyber-glow-amber" style={{ color: 'var(--c-amber)' }}>
                        AI_CORE // SYNTHESIS
                    </span>
                </div>
                <div style={{ color: 'var(--c-text-main)' }}>
                    <ReactMarkdown components={components}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};