"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = "https://images.unsplash.com/photo-1627398242450-274d0c71ba44?w=800&auto=format&fit=crop&q=60",
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    src && src !== "" ? (src as string) : fallbackSrc
  );

  useEffect(() => {
    setImgSrc(src && src !== "" ? (src as string) : fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt || "image"}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
