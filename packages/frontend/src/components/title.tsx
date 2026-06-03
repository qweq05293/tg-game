import { cn } from "@/lib/utils";
import React from "react";

type TitleSize = "sm" | "md" | "lg" | "xl";
type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: TitleSize;
  as?: TitleTag; // Позволяет вручную задать HTML-тег, если он должен отличаться от размера
  align?: "left" | "center" | "right";
  children: React.ReactNode; // Теперь можно передавать не только строку, но и иконки/теги
}

const tagBySize: Record<TitleSize, TitleTag> = {
  sm: "h4",
  md: "h3",
  lg: "h2",
  xl: "h1",
};

const sizeStyles: Record<TitleSize, string> = {
  sm: "text-sm xs1:text-sm",
  md: "text-lg xs1:text-xl",
  lg: "text-xl xs1:text-2xl",
  xl: "text-2xl xs1:text-3xl font-bold",
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Title = ({
  size = "lg",
  as,
  align = "left",
  className,
  children,
  ...props // Пропсы вроде id, onClick, aria-* теперь прокинутся автоматически
}: TitleProps) => {
  // Выбираем тег: либо переданный вручную через 'as', либо дефолтный для этого размера
  const Tag = as || tagBySize[size];

  return (
    <Tag
      className={cn(
        "font-semibold w-full tracking-tight text-foreground",
        sizeStyles[size],
        alignStyles[align],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
