interface GameLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function GameLayout({ children, header, footer }: GameLayoutProps) {
  return (
    // Изменено: h-screen (или h-[100dvh]) и добавлена общая структура экрана
    <div className="flex h-screen w-full max-w-md flex-col shadow-2xl overflow-hidden scrollbar-hide ">
      {header && (
        <header className="z-50  border-b px-4 py-3 backdrop-blur ">
          {header}
        </header>
      )}

      {/* Изменено: добавлен min-h-0 для корректной работы скролла внутри flex-бокса */}
      <main className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-hide">
        <div className="space-y-4">{children}</div>
      </main>

      {footer && (
        <footer className="z-50  border-t px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur ">
          {footer}
        </footer>
      )}
    </div>
  );
}
