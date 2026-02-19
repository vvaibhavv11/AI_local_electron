import { useEffect, useState } from 'react';
import { Check, AlertTriangle, Info, X } from 'lucide-react';
import { ToastType } from '../types';

type ToastProps = {
    show: boolean;
    message: string;
    type?: ToastType;
    onClose?: () => void;
}

const config: Record<ToastType, { icon: React.ReactNode; accent: string; bg: string }> = {
    success: { icon: <Check size={14} strokeWidth={2.5} />, accent: 'var(--success)', bg: 'rgba(74, 222, 128, 0.06)' },
    error: { icon: <AlertTriangle size={14} strokeWidth={2} />, accent: 'var(--error)', bg: 'rgba(251, 113, 133, 0.06)' },
    info: { icon: <Info size={14} strokeWidth={2} />, accent: 'var(--amber)', bg: 'var(--amber-glow)' },
};

export const Toast = ({ show, message, type = 'success', onClose }: ToastProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) setVisible(true);
        else { const t = setTimeout(() => setVisible(false), 300); return () => clearTimeout(t); }
    }, [show]);

    if (!visible) return null;

    const c = config[type];

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-300 ${show ? 'anim-slide-down' : 'opacity-0 -translate-y-full'
                }`}
            style={{
                background: c.bg,
                border: `1px solid ${c.accent}20`,
                backdropFilter: 'blur(12px)',
            }}
        >
            <span style={{ color: c.accent }}>{c.icon}</span>
            <span className="text-[12px] font-medium" style={{ color: 'var(--cream)' }}>{message}</span>
            {onClose && (
                <button onClick={onClose} className="ml-1 p-0.5 rounded hover:cursor-pointer"
                    style={{ color: 'var(--stone-500)' }}>
                    <X size={12} />
                </button>
            )}
        </div>
    );
};
