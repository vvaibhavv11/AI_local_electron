import React, { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

type InputFormProps = {
    onSubmit: (content: string) => void;
    modelLoaded: boolean;
    disabled?: boolean;
}

export const InputForm = ({ onSubmit, modelLoaded, disabled }: InputFormProps) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
        }
    }, [inputValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !modelLoaded || disabled) return;
        onSubmit(inputValue.trim());
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const canSend = inputValue.trim().length > 0 && modelLoaded && !disabled;

    return (
        <div className="flex-shrink-0 w-full flex justify-center px-6 pb-8 pt-4">
            <form onSubmit={handleSubmit} className="relative w-full max-w-3xl">
                <div
                    className={`cyber-panel transition-all duration-200 ${focused ? 'shadow-[0_0_15px_var(--c-cyan-dim)]' : ''}`}
                    style={{
                        background: 'var(--c-surface-1)',
                        borderColor: focused ? 'var(--c-cyan)' : 'var(--border)',
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={modelLoaded ? "AWAITING_INPUT..." : "CORE.OFFLINE"}
                        disabled={!modelLoaded || disabled}
                        rows={1}
                        className="w-full bg-transparent resize-none py-3.5 pl-4 pr-14 text-[13px] leading-relaxed focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed font-mono"
                        style={{ color: 'var(--c-text-main)', minHeight: '48px', maxHeight: '180px' }}
                    />
                    <button
                        type="submit"
                        disabled={!canSend}
                        className="absolute right-2.5 bottom-2.5 p-2 transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed hover:cursor-pointer border"
                        style={{
                            background: canSend ? 'var(--c-cyan-dim)' : 'transparent',
                            color: canSend ? 'var(--c-cyan)' : 'var(--c-surface-3)',
                            borderColor: canSend ? 'var(--c-cyan)' : 'transparent',
                            boxShadow: canSend ? '0 0 10px var(--c-cyan-dim)' : 'none',
                        }}
                        onMouseEnter={e => { if (canSend) { e.currentTarget.style.background = 'var(--c-cyan)'; e.currentTarget.style.color = 'var(--c-black)'; } }}
                        onMouseLeave={e => { if (canSend) { e.currentTarget.style.background = 'var(--c-cyan-dim)'; e.currentTarget.style.color = 'var(--c-cyan)'; } }}
                    >
                        <ArrowUp size={16} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="flex justify-between mt-2 px-1">
                    <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--c-text-muted)' }}>
                        SECURE_CHANNEL // LOCAL_ENCLAVE
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--c-cyan-dim)' }}>
                        NO_DATA_EXFILTRATION
                    </p>
                </div>
            </form>
        </div>
    );
};
