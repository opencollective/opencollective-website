import React from 'react';
import {
  findRenderedDOMComponentWithClass,
  Simulate,
  renderIntoDocument
} from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import ProfilePreapproved from '../../../components/ProfilePreapproved';

var Wrapper = React.createClass({
    render() {
      return (<div>{this.props.children}</div>);
    }
});

const createElement = (props, className='ProfilePreapproved') => {
  // For shallow components
  const rendered = renderIntoDocument(<Wrapper><ProfilePreapproved {...props} /></Wrapper>);
  return findRenderedDOMComponentWithClass(rendered, className);
};

chai.use(spies);

describe('ProfilePreapproved component', () => {
  it('should show the preapproved amount and the difference', () => {
    const element = createElement({
      userid: 1,
      preapprovalDetails: {
        maxTotalAmountOfAllPayments: '2000.00',
        curPaymentsAmount: '100.00',
      },
      getPreapprovalKey: () => {}
    }, 'ProfilePreapproved-balance');

    expect(element.innerHTML).to.contain('$1,900.00');
    expect(element.innerHTML).to.contain('$2,000.00');
  });

  it('should repreapproved the account', () => {
    const getPreapprovalKey = chai.spy(() => {});
    const userid = 1;

    const element = createElement({
      userid,
      preapprovalDetails: {
        maxTotalAmountOfAllPayments: '2000.00',
        curPaymentsAmount: '100.00',
      },
      getPreapprovalKey
    }, 'ProfilePreapproved-reapprove');

    Simulate.click(element);
    expect(getPreapprovalKey).to.have.been.called.with(userid);
  });
});
