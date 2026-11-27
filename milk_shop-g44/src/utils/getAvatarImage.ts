const avatarImages = import.meta.glob("../images/avatars/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const getAvatarImage = (imagePath?: string): string => {
  if (!imagePath) return "";
  const fileName = imagePath.split("/").pop()?.split("?")[0];
  if (!fileName) return "";
  const matched = Object.entries(avatarImages).find(([path]) => path.endsWith("/" + fileName));
  return matched ? matched[1] : imagePath;
};
