"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { imageFallbackSvg } from "@/lib/site-assets";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: string | null | undefined;
  fallbackSrc?: string;
  showFallbackOnLoadError?: boolean;
  skeletonClass?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = imageFallbackSvg,
  showFallbackOnLoadError = false,
  className = "",
  skeletonClass = "",
  ...props
}: SafeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(src || null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setImgSrc(src || null);
  }, [src]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${skeletonClass}`}>
      {/* Animated Skeleton Pulse Placeholder */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 bg-[#F2F4F7] animate-pulse z-10 rounded-xl flex items-center justify-center">
          {hasError && (
            <div className="w-8 h-8 rounded-full bg-gray-200/80 flex items-center justify-center text-gray-400 text-xs font-bold">
              Ford
            </div>
          )}
        </div>
      )}
      
      {imgSrc && !hasError && (
        <Image
          {...props}
          src={imgSrc}
          alt={alt || "Hình ảnh"}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => {
            setIsLoaded(true);
          }}
          onError={() => {
            if (showFallbackOnLoadError && fallbackSrc) {
              setImgSrc(fallbackSrc);
              setIsLoaded(true);
            } else {
              setHasError(true);
            }
          }}
        />
      )}
    </div>
  );
}
