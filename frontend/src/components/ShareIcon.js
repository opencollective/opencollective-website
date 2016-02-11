import React from 'react';

import Icon from './Icon';

export default ({type, url, name, description}) => {

  const tweet = encodeURIComponent(`I just backed the ${name} collective.\nJoin me in supporting them! ${url}`);
  const subject = encodeURIComponent(`I just backed the ${name} collective. Join me in supporting them!`);
  const body = encodeURIComponent(`I just backed the ${name} collective:\n ${description}\n ${url}\n\nJoin me in supporting them!\n`);
  const url_encoded = encodeURIComponent(url);

  const link = {
    twitter: `https://twitter.com/intent/tweet?status=${tweet}`,
    facebook: `https://www.facebook.com/sharer.php?url=${url_encoded}`,
    mail: `mailto:?subject=${subject}&body=${body}`,
  };

  const w = 650;
  const h = 450;
  const top = 0;
  const left = 0;

  // const left = (screen.width / 2) - (w / 2);
  // const top = (screen.height / 2) - (h / 2);

  return (
    <span
      onClick={() => window.open(link[type], 'ShareWindow', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)}
      className='ShareIcon'>
      <Icon type={type} />
    </span>
  )
};
