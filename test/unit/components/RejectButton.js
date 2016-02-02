import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';
import RejectButton from '../../../components/RejectButton';

const {expect} = chai;
const {
  findRenderedDOMComponentWithClass,
  Simulate,
  renderIntoDocument
} = TestUtils;

const createElement = (props) => {
  const rendered = renderIntoDocument(<RejectButton {...props} />);
  return findRenderedDOMComponentWithClass(rendered, 'Button');
};

chai.use(spies);

describe('RejectButton component', () => {
  it('should call the action when clicked', () => {
    const handler = chai.spy(() => {});
    const element = createElement({
      transactionid: '1',
      groupid: '1',
      rejectTransaction: handler,
      inProgress: false
    });

    Simulate.click(element);
    expect(element.className).not.to.contain('Button--inProgress');
    expect(handler).to.have.been.called();
  });

  it('should not do anything if the action is in progress', () => {
    const handler = chai.spy(() => {});
    const element = createElement({
      transactionid: '1',
      groupid: '1',
      rejectTransaction: handler,
      inProgress: true
    });

    Simulate.click(element);
    expect(handler).to.not.have.been.called();
    expect(element.className).to.contain('Button--inProgress');
  })
});
