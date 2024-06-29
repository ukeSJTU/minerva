import React from "react";
import NextImage from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width = 600,
  height = 400,
}) => (
  <NextImage
    src={src}
    alt={alt}
    width={width}
    height={height}
    layout="responsive"
    loading="lazy"
  />
);

export default Image;
