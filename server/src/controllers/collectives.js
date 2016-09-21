import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';
import api from '../lib/api';
import loadModule from '../lib/loadModule'
import { join } from 'path'

const {
  FRONTEND_DIST_PATH = join(process.cwd(), 'frontend', 'dist')
} = process.env

/**
 * Show the widget of a collective
 */
const widget = (req, res, next) => {
  const { group } = req;

  const Widget = loadModule(`${FRONTEND_DIST_PATH}/widget.js`)

  Promise.all([
    api.get(`/groups/${group.slug}/transactions?per_page=3`),
    api.get(`/groups/${group.slug}/users`)
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
      i18n: 'en',
      transactions,
      users,
      href: `${config.host.website}/${group.slug}`
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
