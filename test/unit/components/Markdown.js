import React from 'react';
import {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} from 'react-addons-test-utils';
import { expect } from 'chai';

import Markdown from '../../../frontend/src/components/Markdown';

const createElement = (props) => {
  const rendered = renderIntoDocument(<Markdown {...props} className='markdown' />);
  return findRenderedDOMComponentWithClass(rendered, 'markdown');
}

describe('Markdown component', () => {

  it('should not break if empty', () => {
    const element = createElement({value: ''});

    expect(element.innerHTML).to.be.equal('');
  });

  it('should be sanitized', () => {
    const element = createElement(({value: 'Here is a nice script: <script src=""></script>, cool!'}))
    expect(element.innerHTML).to.be.equal('<p>Here is a nice script: &lt;script src=""&gt;&lt;/script&gt;, cool!</p>\n');
  });


  it('should render markdown', () => {
    const element = createElement({value: '*italic*'});
    expect(element.innerHTML).to.be.equal('<p><em>italic</em></p>\n');
  });

});
