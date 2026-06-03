import { Card, CardContent, CardTitle } from "./ui/card";

interface PageDescriptionProps {
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
}: PageDescriptionProps) {
  if (!img) {
    return (
      <Card className="px-1 py-4 gap-2 bg-inherit rounded-md border-none shadow-2xl">
        <CardTitle className=" px-2 text-primary text-lg font-bold">
          {title}
        </CardTitle>
        <CardContent className="indent-6 space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
          {highlight && (
            <span className="text-primary text-base font-bold">
              {highlight}{" "}
            </span>
          )}
          {text && <span>{text}</span>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-0 gap-2 rounded-md relative overflow-hidden bg-inherit  border-none shadow-2xl">
      <div className="relative w-full h-40">
        <img
          src={img}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover rounded-md"
          loading="eager" // Альтернатива priority={true} для быстрой загрузки
        />
        <div className="absolute inset-0 img-top-gradient"></div>
      </div>

      <div className="absolute top-4 left-4 z-10 text-primary">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        {highlight && <div className="text-base font-bold">{highlight}</div>}
      </div>

      {text && (
        <CardContent className="indent-6 px-4 py-3 pt-1 text-sm leading-relaxed text-card-foreground text-justify">
          {text}
        </CardContent>
      )}
    </Card>
  );
}
