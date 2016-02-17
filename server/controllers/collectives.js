/**
 * Dependencies
 */

import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';

import { get } from '../lib/api';
import Widget from '../../frontend/src/components/Widget';

/**
 * Show the widget of a collective
 */
const widget = (req, res, next) => {
  const group = req.group;

  Promise.all([
    get(`/groups/${group.slug}/transactions?per_page=3`),
    get(`/groups/${group.slug}/users`)
  ])
  .then(([transactions, users]) => {
    const props = {
      options: {
        header: (req.query.header !== 'false'),
        transactions: (req.query.transactions !== 'false'),
        donate: (req.query.donate !== 'false'),
        backers: (req.query.backers !== 'false')
      },
      group,
      transactions,
      users,
      href: `${config.host.app}/${group.slug}`
    };

    const html = renderToString(<Widget {...props} />);

    res.render('pages/widget', {
      layout: false,
      html
    });
  })
  .catch(next);

};

export default { widget };