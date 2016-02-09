/**
 * Dependencies
 */

import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';

import Widget from '../../components/Widget';
import renderClient from '../utils/render_client';

/**
 * Show the collective page
 */
const show = (req, res, next) => {
  const group = req.group;

  // Meta data for facebook and twitter links (opengraph)
  const meta = {
    url: group.publicUrl,
    title: `Join ${group.name}'s open collective`,
    description: `${group.name} is collecting funds to continue their activities. Chip in!`,
    image: group.image || group.logo,
    twitter: `@${group.twitterHandle}`,
  };

  // The initial state will contain the group
  const initialState = {
    groups: {
      [group.id]: group
    }
  };

  // Server side rendering of the client application
  const html = renderClient(initialState);

  res.render('pages/collective', {
    meta,
    html,
    initialState,
    options: {
      showGA: config.showGA
    }
  });
};

/**
 * Show the widget of a collective
 */
const widget = (req, res, next) => {
  const group = req.group;
  const html = renderToString(<Widget group={group} />);

  res.send(html);
};

export default { show, widget };