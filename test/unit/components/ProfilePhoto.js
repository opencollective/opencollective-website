import { expect } from 'chai';

import ProfilePhoto from '../../../frontend/src/components/ProfilePhoto';

describe('ProfilePhoto component', () => {
  it('should have a default image', () => {
    const element = ProfilePhoto({});
    expect(element.props.style.backgroundImage).to.be.equal('url(/static/images/default_avatar.svg)');
  });

  it('should render an image if provided', () => {
    const url = 'image.jpg';
    const element = ProfilePhoto({ url });
    expect(element.props.style.backgroundImage).to.be.equal(`url(/proxy/images/?src=${url}&height=128)`);
  });

});