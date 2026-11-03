import type { CSSProperties } from "react";

type ImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
  draggable?: boolean;
};

const fillStyle: CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  inset: 0,
};

export default function Image({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  style,
  draggable,
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      sizes={sizes}
      draggable={draggable}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      style={fill ? { ...fillStyle, ...style } : style}
    />
  );
}
