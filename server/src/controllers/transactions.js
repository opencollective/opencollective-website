import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';
import Invoice from '../../../frontend/src/components/Invoice';
import i18nlib from '../../../frontend/src/lib/i18n';
import pdf from 'html-pdf';
import moment from 'moment';

export function invoice(req, res) {

  const { username, format } = req.params;

  const transaction = req.transaction;

  const props = {
    i18n: i18nlib('en'),
    transaction,
    paperSize: (transaction.collective.currency === 'EUR') ? 'A4' : 'Letter',
    user: { id: transaction.createdByUser.id, username }
  };

  const invoiceDate = moment(transaction.createdAt);
  const filename = `${invoiceDate.format('YYYYMMDD')}-${transaction.collective.slug}.pdf`;
  const html = renderToString(<Invoice {...props} />);

  req.app.render('pages/invoice', {
    layout: false,
    config,
    html
  }, (err, html) => {
    const options = {
      format: props.paperSize
    }
    if (format === 'pdf') {
      res.setHeader('content-type','application/pdf');
      res.setHeader('content-disposition', `inline; filename="${filename}"`); // or attachment?
      pdf.create(html, options).toStream((err, stream) => {
        stream.pipe(res);
      });
    } else {
      res.send(html);
    }
  });
}

export default {
  invoice
};
