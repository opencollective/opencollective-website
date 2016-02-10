import { expect } from 'chai';
import Markdown from '../../../frontend/src/components/Markdown';

describe('Markdown component', () => {
  it('should not break if empty', () => {
    const element = Markdown({value:''});
    expect(element.props.dangerouslySetInnerHTML.__html).to.be.equal('');
  });

  it('should be sanitized', () => {
    const markdown = 'Here is a nice script: <script src=""></script>, cool!';
    const element = Markdown({value:markdown});
    expect(element.props.dangerouslySetInnerHTML.__html).to.be.equal('<p>Here is a nice script: &lt;script src=&quot;&quot;&gt;&lt;/script&gt;, cool!</p>\n');
  });


  it('should render markdown', () => {
    const markdown = '*italic*';
    const element = Markdown({ value: markdown });
    expect(element.props.dangerouslySetInnerHTML.__html).to.be.equal('<p><em>italic</em></p>\n');
  });

});
