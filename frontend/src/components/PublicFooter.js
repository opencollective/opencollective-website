import React from 'react';

export default () => {
  return  (
    <div className='PublicFooter px2'>
      <div className='container clearfix'>
        <div className='left'>
          <svg width='14' height='14' className='inline-block align-middle mr1'>
            <use xlinkHref='#svg-isotype' fill='#7FADF2'/>
          </svg>
          <svg width='138' height='20' className='inline-block align-middle'>
            <use xlinkHref='#svg-logotype' fill='#919699'/>
          </svg>
        </div>
        <div className='PublicFooter-menu right'>
          <nav>
            <ul className='list-reset m0'>
              <li className='inline-block'>
                <a className='block h6 py3 px2 white muted -ff-sec -fw-bold' href='https://opencollective.com/#howitworks'>How It Works</a>
              </li>
              <li className='inline-block'>
                <a className='block h6 py3 px2 white muted -ff-sec -fw-bold' href='https://opencollective.com/#opensource'>Use Cases</a>
              </li>
              <li className='inline-block'>
                <a className='block h6 py3 px2 white muted -ff-sec -fw-bold' href='https://opencollective.com/faq'>FAQ</a>
              </li>
              <li className='inline-block'>
                <a className='block h6 py3 px2 white muted -ff-sec -fw-bold' href='https://opencollective.com/about'>About</a>
              </li>
              <li className='inline-block'>
                <a className='block h6 py3 px2 white muted -ff-sec -fw-bold' href='mailto:info@opencollective.com'>Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
