type HeaderProps = {
    modelLoaded: boolean;
}

export const Header = ({ modelLoaded }: HeaderProps) => {
    return (
        <div
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--c-surface-1)' }}
        >
            <h2 className="font-display text-[12px] tracking-widest cyber-glow-amber" style={{ color: 'var(--c-amber)' }}>
                LOCAL_NODE_INTERFACE
            </h2>
            <div className="flex items-center gap-2">
                <div className={`status-dot ${modelLoaded ? 'active' : ''}`} />
                <span className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: modelLoaded ? 'var(--c-cyan)' : 'var(--c-surface-3)' }}>
                    {modelLoaded ? 'SYS.READY' : 'SYS.OFFLINE'}
                </span>
            </div>
        </div>
    );
};
