import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';
import api from '../lib/api';
import Widget from '../../../frontend/src/components/Widget';
import i18n from '../../../frontend/src/lib/i18n';
import filterCollection from '../../../frontend/src/lib/filter_collection';

/**
 * Show the widget of a collective
 */
const widget = (req, res, next) => {
  const { group } = req;

  Promise.all([
    api.get(`/groups/${group.slug}/transactions?per_page=3`),
    api.get(`/groups/${group.slug}/users`)
  ])
  .then(([transactions, users]) => {

    group.backers = filterCollection(users, { role: 'BACKER' });

    const props = {
      options: {
        header: (req.query.header !== 'false'),
        transactions: (req.query.transactions !== 'false'),
        donate: (req.query.donate !== 'false'),
        backers: (req.query.backers !== 'false')
      },
      group,
      i18n: i18n('en'),
      transactions,
      href: `${config.host.website}/${group.slug}#support`
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
