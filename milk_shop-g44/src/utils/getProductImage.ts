const productImages = import.meta.glob(
    "../images/products/*",
    {
        eager: true,
        query: "?url",
        import: "default",
    }
) as Record<string, string>;
export const getProductImage = (imagePath?: string): string => {
    if (!imagePath) return "";
    const fileName = imagePath.split("/").pop()?.split("?")[0];
    if (!fileName) return "";
    const matchedImage = Object.entries(productImages).find(([path]) =>
        path.endsWith(`/${fileName}`)
    );
    if (matchedImage) {
        return matchedImage[1];
    }
    return imagePath;
};