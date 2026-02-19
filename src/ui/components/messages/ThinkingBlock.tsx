import { Terminal } from 'lucide-react';

export const ThinkingBlock = () => {
    return (
        <div className="flex gap-4 mb-8 anim-enter max-w-[90%]">
            <div className="relative flex-shrink-0 flex flex-col items-center top-1">
                <div className="w-8 h-8 flex items-center justify-center border border-amber-500"
                    style={{ background: 'var(--c-black)', boxShadow: '0 0 10px var(--c-amber-dim)' }}>
                    <Terminal size={14} color="var(--c-amber)" />
                </div>
                <div className="w-[1px] h-full mt-2 opacity-50" style={{ background: 'linear-gradient(to bottom, var(--c-amber), transparent)' }} />
            </div>
            <div className="pt-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className="font-display text-[10px] tracking-[0.2em] cyber-glow-amber" style={{ color: 'var(--c-amber)' }}>
                        AI_CORE // PROCESSING
                    </span>
                </div>
                <div className="flex items-center gap-3 cyber-panel py-2 px-4 w-fit border" style={{ borderColor: 'var(--border)', background: 'var(--c-black)' }}>
                    <div className="flex gap-1.5">
                        {[0, 0.2, 0.4].map((delay, i) => (
                            <div key={i} className="w-1.5 h-3"
                                style={{ background: 'var(--c-amber)', animation: `pulse-warm 1s ease-in-out ${delay}s infinite` }}
                            />
                        ))}
                    </div>
                    <span className="font-mono text-[12px] tracking-widest uppercase" style={{ color: 'var(--c-text-muted)' }}>
                        COMPILING_RESPONSE...
                    </span>
                </div>
            </div>
        </div>
    );
};
