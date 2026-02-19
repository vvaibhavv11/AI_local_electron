import { Cpu, Terminal, ShieldAlert, CodeSquare } from 'lucide-react';

type WelcomeScreenProps = {
    onSuggestionClick: (prompt: string) => void;
    modelLoaded: boolean;
};

const suggestions = [
    {
        icon: <Terminal size={16} strokeWidth={1.5} />,
        label: 'PROCESS',
        prompt: 'Explain the architecture of a neural network layer by layer.',
    },
    {
        icon: <CodeSquare size={16} strokeWidth={1.5} />,
        label: 'EXECUTE',
        prompt: 'Write a Rust function to securely hash a password.',
    },
    {
        icon: <ShieldAlert size={16} strokeWidth={1.5} />,
        label: 'ANALYZE',
        prompt: 'Identify the top 3 vulnerabilities in modern web applications.',
    },
    {
        icon: <Cpu size={16} strokeWidth={1.5} />,
        label: 'SYNTHESIZE',
        prompt: 'Design a high availability database cluster topology.',
    },
];

export const WelcomeScreen = ({ onSuggestionClick, modelLoaded }: WelcomeScreenProps) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-8 select-none w-full overflow-hidden relative z-10">

            {/* Background huge logo watermark */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <Cpu size={400} />
            </div>

            {/* Title Block */}
            <div className="cyber-panel p-8 mb-8 flex flex-col items-center anim-enter z-10 w-full max-w-2xl bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 border border-cyan-500 flex items-center justify-center" style={{ borderColor: 'var(--c-cyan)', background: 'var(--c-cyan-dim)', boxShadow: '0 0 20px var(--c-cyan-dim)' }}>
                        <Terminal size={24} color="var(--c-cyan)" />
                    </div>
                    <h1 className="text-5xl font-display cyber-glow tracking-widest" style={{ color: 'var(--c-text-main)' }}>
                        SYS.<span style={{ color: 'var(--c-cyan)' }}>INIT</span>
                    </h1>
                </div>

                <div className="font-mono text-sm tracking-[0.3em] uppercase text-center border-t border-b py-2 w-full" style={{ borderColor: 'var(--c-surface-3)', color: 'var(--c-text-muted)' }}>
                    Direct Neural Interface // <span style={{ color: 'var(--c-amber)' }}>Classified</span>
                </div>
            </div>

            {!modelLoaded && (
                <div
                    className="flex items-center gap-3 px-6 py-2 mb-8 font-display text-[12px] uppercase tracking-[0.2em] anim-enter anim-enter-delay-1 border"
                    style={{
                        color: 'var(--c-magenta)',
                        background: 'var(--c-magenta-dim)',
                        borderColor: 'var(--c-magenta)',
                        boxShadow: '0 0 15px var(--c-magenta-dim)'
                    }}
                >
                    <div className="w-2 h-2" style={{ background: 'var(--c-magenta)', animation: 'pulse-warm 1s ease infinite' }} />
                    WARNING: MAIN_CORE_OFFLINE
                </div>
            )}
            {modelLoaded && <div className="mb-8 font-mono text-xs tracking-widest uppercase anim-enter anim-enter-delay-1" style={{ color: 'var(--c-cyan)' }}>
                [ SYSTEM UPLINK SECURED ]
            </div>}

            {/* Suggestion Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-2xl w-full anim-enter anim-enter-delay-2 z-10">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onSuggestionClick(s.prompt)}
                        disabled={!modelLoaded}
                        className="group flex flex-col items-start gap-3 p-4 transition-all duration-150 hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border cyber-panel"
                        style={{
                            background: 'var(--c-black)',
                            borderColor: 'var(--border)',
                            color: 'var(--c-text-muted)',
                        }}
                        onMouseEnter={e => {
                            if (modelLoaded) {
                                e.currentTarget.style.borderColor = 'var(--c-cyan)';
                                e.currentTarget.style.color = 'var(--c-cyan)';
                                e.currentTarget.style.background = 'var(--c-cyan-dim)';
                            }
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--c-text-muted)';
                            e.currentTarget.style.background = 'var(--c-black)';
                        }}
                    >
                        <div className="flex items-center gap-2 font-display text-xs tracking-widest transition-colors duration-150" style={{ color: 'inherit' }}>
                            {s.icon}
                            <span>{s.label}</span>
                        </div>
                        <span className="font-mono text-xs text-left leading-relaxed truncate w-full opacity-80" style={{ color: 'var(--c-text-main)' }}>{s.prompt}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
