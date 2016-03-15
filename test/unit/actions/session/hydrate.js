import expect from 'expect';

import hydrate from '../../../../frontend/src/actions/session/hydrate';
import { HYDRATE } from '../../../../frontend/src/constants/session';

describe('session/hydrate', () => {

  it('returns HYDRATE', () => {
    const data = {
      groups: { 1: { id: 1 } }
    };

    expect(hydrate(data)).toEqual({ type: HYDRATE, data });
  });

});
