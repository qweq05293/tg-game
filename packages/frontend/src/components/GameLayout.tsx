interface GameLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function GameLayout({ children, header, footer }: GameLayoutProps) {
  return (
    <div className="flex min-h-100dvh w-full items-center justify-center bg-zinc-900 text-foreground">
      <div className="flex h-100dvh w-full max-w-md flex-col bg-background shadow-2xl overflow-hidden">
        {header && (
          <header className="z-50 flex-none border-b bg-card/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-card/60">
            {header}
          </header>
        )}
        <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="space-y-4">{children}</div>
        </main>

        {footer && (
          <footer className="z-50 flex-none border-t bg-card pb-[env(safe-area-inset-bottom)]">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
