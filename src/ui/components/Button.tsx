type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    className?: string;
}

const variantStyles = {
    primary: {
        background: 'var(--accent-gradient)',
        color: 'white',
        border: 'none',
    },
    secondary: {
        background: 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)',
    },
    danger: {
        background: 'rgba(231, 76, 60, 0.15)',
        color: 'var(--error)',
        border: '1px solid rgba(231, 76, 60, 0.3)',
    },
};

export const Button = ({ children, onClick, variant = 'secondary', disabled, className = '' }: ButtonProps) => {
    const styles = variantStyles[variant];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed hover:cursor-pointer ${className}`}
            style={styles}
        >
            {children}
        </button>
    );
};
