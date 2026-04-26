const getImageUrl = (baseUrl, image) => {
  if (!image) return "";
  if (image.startsWith("data:") || image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${baseUrl}/images/${image}`;
};

export default getImageUrl;
