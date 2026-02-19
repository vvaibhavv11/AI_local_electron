type LayoutProps = {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div
            className="h-screen w-screen flex overflow-hidden dot-grid"
            style={{
                background: 'var(--bg)',
            }}
        >
            <div className="scanline"></div>
            {children}
        </div>
    );
};
