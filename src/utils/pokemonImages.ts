// @ts-nocheck
// Lazy image loading - only load images when needed
const imageCache = new Map();

// Function to dynamically import images only when needed
export const getImage = async (
  id: number,
  isShiny: boolean = false
): Promise<string> => {
  const cacheKey = `${id}-${isShiny ? "shiny" : "default"}`;

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    const folder = isShiny ? "shiny" : "default";
    // Try different file extensions
    const extensions = ["png", "jpg", "jpeg", "svg"];

    for (const ext of extensions) {
      try {
        const image = await import(`../assets/pokemons/${folder}/${id}.${ext}`);
        const imageUrl = image.default;
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      } catch (error) {
        // Continue to next extension
        continue;
      }
    }

    // Fallback to a default Pokemon image if specific image not found
    const fallbackImage = await import("../assets/pokeball-icon.png");
    const fallbackUrl = fallbackImage.default;
    imageCache.set(cacheKey, fallbackUrl);
    return fallbackUrl;
  } catch (error) {
    console.warn(`Failed to load image for Pokemon ${id}:`, error);
    // Return a fallback image
    const fallbackImage = await import("../assets/pokeball-icon.png");
    return fallbackImage.default;
  }
};

// For backward compatibility - these will be empty objects
// Components should use getImage() instead
export const images = {};
export const defaultImages = {};
