import React, { useState, useEffect, memo } from "react";
import { getImage } from "../utils/pokemonImages";

interface LazyImageProps {
  pokemonId: number;
  isShiny?: boolean;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  onClick?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = memo(
  ({
    pokemonId,
    isShiny = false,
    alt,
    className,
    style,
    loading = "lazy",
    onClick,
  }) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      let isMounted = true;

      const loadImage = async () => {
        try {
          setIsLoading(true);
          setHasError(false);
          const imageUrl = await getImage(pokemonId, isShiny);

          if (isMounted) {
            setImageSrc(imageUrl);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(
            `Failed to load image for Pokemon ${pokemonId}:`,
            error
          );
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        }
      };

      loadImage();

      return () => {
        isMounted = false;
      };
    }, [pokemonId, isShiny]);

    if (isLoading) {
      return (
        <div
          className={`lazy-image-placeholder ${className || ""}`}
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            minHeight: "100px",
          }}
        >
          <div className="loading-spinner">Loading...</div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div
          className={`lazy-image-error ${className || ""}`}
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f8f8",
            color: "#666",
            minHeight: "100px",
          }}
        >
          Image not available
        </div>
      );
    }

    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        onClick={onClick}
        onError={() => setHasError(true)}
      />
    );
  }
);

LazyImage.displayName = "LazyImage";

export default LazyImage;
