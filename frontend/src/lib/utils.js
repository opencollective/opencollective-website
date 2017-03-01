import merge from 'lodash/merge';

const DEFAULT_GROUP_STYLES = { 
  hero: { 
    cover: { 
      transform: "scale(1.06)",
      backgroundImage: "url('/public/images/collectives/default-header-bg.jpg')"
    }, 
    a: {}
  }
};

export function resizeImage(imageUrl, { width, height, query }) {
  if (!imageUrl) return null;
  if (!query && imageUrl.match(/\.svg$/)) return imageUrl; // if we don't need to transform the image, no need to proxy it.
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

export function capitalize(str) {
  if (!str) return '';
  return str[0].toUpperCase() + str.substr(1);
}

export function formatTierToCamelCase(title) {
  return title.replace(/\s(.)/g, ($1) => $1.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, ($1) => $1.toLowerCase());
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
  if (!group) return Object.assign({}, DEFAULT_GROUP_STYLES);

  const styles = merge({}, DEFAULT_GROUP_STYLES, group.settings.style);
  if (group.backgroundImage) {
    styles.hero.cover.backgroundImage = `url(${resizeImage(group.backgroundImage, { width: 1024 })})`;
  }
  return styles;
}

// Hack because react-router doesn't scroll
export function scrollToExpense() {
  const hash = window.location.hash;
  if (window.location.hash) {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView();
    }
  } else {
   window.scrollTo(0, 0);
  }
}