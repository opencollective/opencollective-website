import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import spies from 'chai-spies';

import noop from '../helpers/noop';

import {
  GroupSettings,
} from '../../../containers/GroupSettings';

const { expect } = chai;
const {
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} = TestUtils;

const createElement = (props, className = 'GroupSettings') => {
  const rendered = renderIntoDocument(<GroupSettings {...props} />);
  return findRenderedDOMComponentWithClass(rendered, className);
};

chai.use(spies);

describe('GroupSettings container', () => {

  it('fetches group', () => {
    const fetchGroup = chai.spy(noop);
    const form = {
      attributes: {
        logo: ''
      }
    }

    createElement({
      form,
      groupid: 1,
      group: {},
      fetchGroup,
      resetNotifications: noop,
      notification: {}
    });

    expect(fetchGroup).to.have.been.called();
  });

  it('updates the Input field', () => {
    const form = {
      attributes: {
        name: 'Almonds anonymous'
      }
    }

    const DOM = createElement({
      form,
      groupid: 1,
      group: {},
      fetchGroup: noop,
      resetNotifications: noop,
      notification: {}
    }, 'Input');

    expect(DOM.children[0].value).to.be.equal('Almonds anonymous');
  });

  it('updates the textarea field', () => {
    const text = 'No such thing as too many almonds';
    const form = {
      attributes: {
        description: text
      }
    }

    const DOM = createElement({
      form,
      groupid: 1,
      group: {},
      fetchGroup: noop,
      resetNotifications: noop,
      notification: {}
    }, 'test1');

    expect(DOM.children[0].value).to.be.equal(text);
  });




});
