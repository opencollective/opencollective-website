import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import OnBoardingStepCreate from '../../../frontend/src/components/on_boarding/OnBoardingStepCreate';

const i18n = require('../../../frontend/src/lib/i18n')('en');

describe('OnBoardingStepCreate component', () => {
  it('Create button should disable for 5 seconds after being clicked', function(done) {
    this.timeout(6000)
    var callCount = 0
    const element = TestUtils.renderIntoDocument(
      <OnBoardingStepCreate onCreate={() => callCount++} githubForm={{attributes: {}}} uploadImage={Function.prototype} i18n={i18n} />
    );
    expect(element.state.disableCreateButton).to.be.false;
    element.onCreate();
    expect(element.state.disableCreateButton).to.be.true;
    for (var i = Math.floor(2 + Math.random() * 10); i >= 0; i--) element.onCreate();
    expect(element.state.disableCreateButton).to.be.true;
    setTimeout(() => {
        for (var i = Math.floor(2 + Math.random() * 2); i >= 0; i--) element.onCreate();
        expect(element.state.disableCreateButton).to.be.true;
        setTimeout(() => {
            expect(element.state.disableCreateButton).to.be.false;
            expect(callCount).to.be.equal(1);
            for (var i = Math.floor(2 + Math.random() * 3); i >= 0; i--) element.onCreate();
            expect(callCount).to.be.equal(2);
            expect(element.state.disableCreateButton).to.be.true;
            done()
        }, 4020)
    }, 1000)
  });
});
