import merge from 'lodash/merge';

const DEFAULT_GROUP_STYLES = { 
  hero: { 
    cover: { 
      filter: "blur(4px)",
      transform: "scale(1.06)",
      backgroundImage: "url('/static/images/collectives/default-header-bg.jpg')"
    }, 
    a: {}
  }
};

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

export function getGroupCustomStyles(group) {
  const styles = DEFAULT_GROUP_STYLES;
  if (group.backgroundImage) {
    styles.hero.cover.backgroundImage = `url(${resizeImage(group.backgroundImage, { width: 1024 })})`;
  }
  return merge({}, styles, group.settings.style);
}