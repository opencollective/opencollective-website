export function resizeImage(imageUrl, width) {
        if (!imageUrl) return null;
        return `http://res.cloudinary.com/opencollective/image/fetch/w_${width},c_fill,f_jpg/${encodeURIComponent(imageUrl)}`;
}