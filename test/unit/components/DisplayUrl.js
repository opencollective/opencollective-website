import { expect } from 'chai';

import {displayUrl} from '../../../components/DisplayUrl';


describe('DisplayUrl component', () => {

  it('Removes the leading http://www.', () => {
    expect(displayUrl("http://www.meetup.com/Women-Who-Code-Mexico-City/")).to.equal('meetup.com/Women-Who-Code-Mexico-City');
  });

});
