export function resizeImage(imageUrl, { width, height, query }) {
  if (!imageUrl) return null;
  let queryurl = '';
  if (query) {
    queryurl = encodeURIComponent(query);
  } else {
    if (width) queryurl += `&width=${width}`;
    if (height) queryurl += `&height=${height}`;
  }
  return `/proxy/images/?src=${encodeURIComponent(imageUrl)}${queryurl}`;
}

export function formatAnchor(title) {
  return title.toLowerCase().replace(' ','-').replace(/[^a-z0-9\-]/gi,'')
}