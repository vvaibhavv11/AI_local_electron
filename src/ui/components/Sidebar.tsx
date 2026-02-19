import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Trash2, Cpu, Power } from 'lucide-react';
import { Conversation } from '../types';

type SidebarProps = {
    conversations: Conversation[];
    activeConversationId: string | null;
    modelLoaded: boolean;
    onNewChat: () => void;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onLoadModel: () => void;
    onEjectModel: () => void;
};

export const Sidebar = ({
    conversations,
    activeConversationId,
    modelLoaded,
    onNewChat,
    onSelectConversation,
    onDeleteConversation,
    onLoadModel,
    onEjectModel,
}: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={`flex flex-col h-full transition-all duration-300 ease-in-out flex-shrink-0 ${collapsed ? 'w-[64px]' : 'w-[280px]'
                }`}
            style={{ background: 'var(--c-surface-1)', borderRight: '1px solid var(--border-strong)' }}
        >
            {/* Branding */}
            <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
                {!collapsed && (
                    <div className="flex items-center gap-3 anim-enter">
                        <div className="w-10 h-10 flex items-center justify-center border border-amber-500 font-display text-amber-500"
                            style={{ background: 'var(--c-black)', boxShadow: '0 0 10px var(--c-amber-dim)' }}>
                            <Cpu size={20} color="var(--c-amber)" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[14px] font-display cyber-glow" style={{ color: 'var(--c-cyan)' }}>
                                NEURO_LINK
                            </h1>
                            <p className="font-mono text-[9px] tracking-[0.2em] mt-1" style={{ color: 'var(--c-text-muted)' }}>
                                OFFLINE // v1.0
                            </p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-10 h-10 flex items-center justify-center border border-amber-500 mx-auto"
                        style={{ background: 'var(--c-black)', boxShadow: '0 0 10px var(--c-amber-dim)' }}>
                        <Cpu size={20} color="var(--c-amber)" strokeWidth={1.5} />
                    </div>
                )}
                {!collapsed && (
                    <button onClick={() => setCollapsed(true)}
                        className="p-1 border transition-all hover:cursor-pointer"
                        style={{ color: 'var(--c-cyan)', borderColor: 'var(--border)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-cyan-dim)'; e.currentTarget.style.borderColor = 'var(--c-cyan)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}
            </div>

            {collapsed && (
                <div className="flex justify-center py-4 border-b border-gray-800" style={{ borderColor: 'var(--border)' }}>
                    <button onClick={() => setCollapsed(false)}
                        className="p-1 border transition-all hover:cursor-pointer"
                        style={{ color: 'var(--c-cyan)', borderColor: 'var(--border)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-cyan-dim)'; e.currentTarget.style.borderColor = 'var(--c-cyan)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* New Chat */}
            <div className="px-4 py-4">
                <button onClick={onNewChat}
                    className={`cyber-button w-full flex items-center gap-2 ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}`}
                >
                    <Plus size={16} strokeWidth={2} />
                    {!collapsed && <span className="text-[11px] font-bold tracking-widest">INITIALIZE_LINK</span>}
                </button>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {!collapsed && conversations.length === 0 && (
                    <div className="py-12 px-2 text-center border border-gray-800 border-dashed" style={{ borderColor: 'var(--c-surface-3)' }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>
                            NO_LINKS_DETECTED
                        </p>
                    </div>
                )}
                {conversations.map((conv, i) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                        <div key={conv.id}
                            className={`group relative flex items-center gap-2 transition-all duration-150 hover:cursor-pointer ${collapsed ? 'justify-center p-2' : 'px-3 py-3'
                                }`}
                            style={{
                                background: isActive ? 'var(--c-cyan-dim)' : 'var(--c-surface-2)',
                                color: isActive ? 'var(--c-cyan)' : 'var(--c-text-muted)',
                                border: `1px solid ${isActive ? 'var(--c-cyan)' : 'var(--border)'}`,
                                animationDelay: `${i * 30}ms`,
                            }}
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.borderColor = 'var(--c-text-muted)';
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                            onClick={() => onSelectConversation(conv.id)}
                        >
                            {isActive && <div className="absolute top-0 left-0 w-[4px] h-full" style={{ background: 'var(--c-cyan)' }}></div>}
                            {!collapsed ? (
                                <>
                                    <span className="flex-1 text-[12px] font-mono truncate tracking-tight">{conv.title}</span>
                                    <button
                                        onClick={e => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 border transition-all hover:cursor-pointer"
                                        style={{ color: 'var(--c-text-muted)', borderColor: 'transparent' }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.color = 'var(--c-magenta)';
                                            e.currentTarget.style.borderColor = 'var(--c-magenta)';
                                            e.currentTarget.style.background = 'var(--c-magenta-dim)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.color = 'var(--c-text-muted)';
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </>
                            ) : (
                                <div className="w-2 h-2"
                                    style={{
                                        background: isActive ? 'var(--c-cyan)' : 'var(--c-surface-3)',
                                    }}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Model Control */}
            <div className="px-4 py-5" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`status-dot ${modelLoaded ? 'active' : ''}`} />
                        {!collapsed && (
                            <span className="font-mono text-[10px] uppercase tracking-widest"
                                style={{ color: modelLoaded ? 'var(--c-cyan)' : 'var(--c-text-muted)' }}>
                                {modelLoaded ? 'CORE.ONLINE' : 'CORE.OFFLINE'}
                            </span>
                        )}
                    </div>
                </div>

                <button onClick={modelLoaded ? onEjectModel : onLoadModel}
                    className={`w-full flex items-center justify-center gap-2 transition-all duration-200 hover:cursor-pointer font-display text-[11px] tracking-widest uppercase border ${collapsed ? 'px-0 py-3' : 'px-3 py-3'
                        }`}
                    style={{
                        background: modelLoaded ? 'var(--c-magenta-dim)' : 'var(--c-bg)',
                        color: modelLoaded ? 'var(--c-magenta)' : 'var(--c-amber)',
                        borderColor: modelLoaded ? 'var(--c-magenta)' : 'var(--c-amber)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = modelLoaded ? 'var(--c-magenta)' : 'var(--c-amber)';
                        e.currentTarget.style.color = 'var(--c-black)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = modelLoaded ? 'var(--c-magenta-dim)' : 'var(--c-bg)';
                        e.currentTarget.style.color = modelLoaded ? 'var(--c-magenta)' : 'var(--c-amber)';
                    }}
                >
                    <Power size={14} />
                    {!collapsed && <span>{modelLoaded ? 'HALT_CORE' : 'BOOT_CORE'}</span>}
                </button>
            </div>
        </div>
    );
};
