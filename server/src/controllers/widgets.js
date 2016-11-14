import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';
import api from '../lib/api';
import Widget from '../../../frontend/src/components/Widget';
import ProfileWidget from '../../../frontend/src/components/ProfileWidget';
import i18n from '../../../frontend/src/lib/i18n';
import filterCollection from '../../../frontend/src/lib/filter_collection';

export function js(req, res) {
  res.render('pages/widgetjs', {
    layout: false,
    config,
    slug: req.params.slug
  })
}

/**
 * Show the widget of a user or of a collective
 */
export function profile(req, res, next) {

  if (req.group) {
    return collectiveWidget(req, res, next);
  }

  if (req.user) {
    return userWidget(req, res, next);
  }

}

/**
 * Show the widget of a user / organization
 */
export function userWidget(req, res) {

  const props = {
    options: {
      title: 'Our contributions',
      subtitle: 'Join us in contributing to those collectives'
    },
    profile: req.profile,
    i18n: i18n('en')
  };

  const html = renderToString(<ProfileWidget {...props} />);
  res.render('pages/ProfileWidget', {
    layout: false,
    html
  });
}

/**
 * Show the widget of a collective
 */
export function collectiveWidget(req, res, next) {
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

export default {
  profile
};