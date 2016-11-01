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

/**
* Currently, `Joi.string().uri()` Joi is used to validate the website uri.
* Unfortunately, a valid URI includes its schema/protocol, so the following urls
* will always be invalid: `facebook.com/xdamman` & `github.com/xdamman`.
*
* Its a shame, since it is what most internet users will want to type.
* This functions patches a `http://` protocol if it is missing.
*
* @ref https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
*/
export function fixURI(weburl) {
  weburl = weburl.trim();
  if (weburl && weburl.length > 4 && weburl.indexOf('.') !== -1) {
    if (weburl.indexOf('http') !== 0) {
      const matches = /(^(https?)?(:)?(\/*)?)(.*)$/i.exec(weburl);
      weburl = `http://${matches[matches.length - 1]}`; // get w.e is after schema and leading slashes.
    }
  }

  return weburl;
}

export function getGroupCustomStyles(group) {
  const styles = merge({}, DEFAULT_GROUP_STYLES);
  if (!group) return styles;
  if (group.backgroundImage) {
    styles.hero.cover.backgroundImage = `url(${resizeImage(group.backgroundImage, { width: 1024 })})`;
  }
  return merge({}, styles, group.settings.style);
}