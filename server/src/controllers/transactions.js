import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';
import api from '../lib/api';
import Invoice from '../../../frontend/src/components/Invoice';
import i18nlib from '../../../frontend/src/lib/i18n';
import pdf from 'html-pdf';
import moment from 'moment';

export function invoice(req, res) {

  const { transactionid, username } = req.params;

  api
    .get(`/transactions/${transactionid}`)
    .then(transaction => {
      const props = {
        i18n: i18nlib('en'),
        transaction,
        user: { id: transaction.UserId, username }
      };

      const invoiceDate = moment(transaction.createdAt);
      const filename = `${invoiceDate.format('YYYYMMDD')}-${transaction.group.slug}.pdf`;
      const html = renderToString(<Invoice {...props} />);

      req.app.render('pages/invoice', {
        layout: false,
        config,
        html
      }, (err, html) => {
        const options = {
          format: (transaction.group.currency === 'EUR') ? 'A4' : 'Letter'
        }
        res.setHeader('content-type','application/pdf');
        res.setHeader('content-disposition', `inline; filename="${filename}"`); // or attachment?
        pdf.create(html, options).toStream((err, stream) => {
          stream.pipe(res);
        });
      });
    });
}

export default {
  invoice
};
