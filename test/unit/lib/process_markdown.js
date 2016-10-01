import {expect} from 'chai';
import processMarkdown from '../../../frontend/src/lib/process_markdown';

import mdfile from '../../data/brusselstogether.md.json';

describe('processMarkdown', () => {

  it('should return the initial text if no title', () => {
    const text = "Hello world";
    expect(processMarkdown(text)).to.deep.equal({intro: text});
  });

  it('should return the list of titles', () => {
    const processed = processMarkdown(mdfile.markdown);
    expect(Object.keys(processed)).to.deep.equal([ 'intro', 'Our Values', 'About', 'FAQ' ]);
    expect(processed.FAQ.length).to.equal(1135);
  })

});