import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "./ui/card";

interface PageDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  text?: string;
  highlight?: string;
  img?: string;
}

export function PageDescription({
  title,
  text,
  highlight,
  img,
  className,
  ...props
}: PageDescriptionProps) {
  // Базовые стили для карточки, чтобы не дублировать код
  const cardStyles = cn(
    "gap-2 bg-inherit border-none shadow-2xl relative overflow-hidden",
    img ? "p-0 rounded-xl" : "px-1 py-4 rounded-md",
    className,
  );

  return (
    <Card className={cardStyles} {...props}>
      {img ? (
        <>
          {/* Контейнер для картинки (заменили Next.js Image на обычный тег img) */}
          <div className="relative w-full h-44">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover rounded-xl"
              loading="eager" // Имитируем priority={true} для быстрой загрузки баннера
            />
            {/* Градиентное затемнение, чтобы белый текст читался на любой картинке */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-black/60" />

            {/* Текст поверх картинки */}
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-0.5">
              <CardTitle className="text-xl font-bold text-white drop-shadow-sm">
                {title}
              </CardTitle>
              {highlight && (
                <div className="text-sm font-semibold text-primary-foreground/90 bg-primary/20 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mt-1">
                  {highlight}
                </div>
              )}
            </div>
          </div>

          {text && (
            <CardContent className="px-4 py-3 pt-2 text-sm leading-relaxed text-card-foreground text-justify">
              {text}
            </CardContent>
          )}
        </>
      ) : (
        // Вариант БЕЗ картинки
        <>
          <CardTitle className="px-2 text-primary text-lg font-bold">
            {title}
          </CardTitle>
          <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
            {highlight && (
              <span className="text-primary text-base font-bold block mb-1">
                {highlight}
              </span>
            )}
            {text && <span>{text}</span>}
          </CardContent>
        </>
      )}
    </Card>
  );
}
