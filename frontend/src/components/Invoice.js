import React, { Component, PropTypes } from 'react';
import Currency from './Currency';
import Table from 'rc-table';
import {getGroupCustomStyles} from '../lib/utils';
import config from 'config';

export default class Invoice extends Component {

  constructor(props) {
    super(props);
    this.styles = {
      footer: {
        paddingLeft: '480'
      }
    };
  }

  render() {
    const {
      transaction,
      i18n,
      paperSize
    } = this.props;

    const createdAt = new Date(transaction.createdAt);
    const amount = transaction.type === 'CREDIT'
    ? transaction.amount
    : -transaction.netAmountInCollectiveCurrency;
    const collective = transaction.type === 'CREDIT'
    ? transaction.collective
    : transaction.fromCollective;
    const fromCollective = transaction.type === 'CREDIT'
    ? transaction.fromCollective
    : transaction.collective;

    const localeDateFormat = (collective.currency === 'USD') ? 'en' : 'fr';
    i18n.moment.locale(localeDateFormat);
    const columns = [
      {title: 'date', dataIndex: 'date', className: 'date' },
      {title: 'description', dataIndex: 'description', key: 'description', width: 400, className: 'description'},
      {title: 'amount', dataIndex: 'amount', key: 'amount', className: 'amount'},
    ];

    const data = [{
      date: i18n.moment(createdAt).format('l'),
      description: transaction.description,
      amount: <Currency value={amount} currency={transaction.currency} />
    }];

    data.push({
      description: "Total",
      amount: <Currency value={amount} currency={transaction.currency} />
    });

    let hostAddress = '';
    if (transaction.host.locationName) {
      hostAddress = `${transaction.host.locationName}\n`;
    }
    const hostBillingAddress = { __html : `${hostAddress}${transaction.host.address || ''}`.replace(/\n/g,'<br />') };

    let userAddress = '';
    if (fromCollective.locationName) {
      userAddress = `${fromCollective.address}\n`;
    }
    const userBillingAddress = { __html : (transaction.createdByUser.billingAddress || userAddress || '').replace(/\n/g,'<br />') };
    const styles = getGroupCustomStyles(collective);

    // We need to load images in absolute path for PhantomJS
    if (styles.hero.cover.backgroundImage && styles.hero.cover.backgroundImage.match(/url\('?\//)) {
      styles.hero.cover.backgroundImage = styles.hero.cover.backgroundImage.replace(/url\(('?)\//, `url($1${config.host.website}/`);
    }

    const pageStyle = {
      'A4': {
        width: '210mm',
        height: '297mm'
      },
      'Letter': {
        width: '8.5in',
        height: '11in'
      }
    }

    return (
      <div className='Invoice' style={pageStyle[paperSize]}>
        <style>{`
        html {
          zoom: 0.75;
          width: ${pageStyle[paperSize].width};
          height: ${pageStyle[paperSize].height};
        }
        `}</style>
        <div className="header">
          <a href={`https://opencollective.com/${collective.slug}`}>
            <div className="hero">
              <div className="cover" style={styles.hero.cover} />
              <div className="logo" style={{backgroundImage:`url('${collective.image}')`}} />
            </div>
          </a>

          <div className="collectiveInfo">
            <h1>{collective.name}</h1>
            <a href={`https://opencollective.com/${collective.slug}`} className="website">https://opencollective.com/{collective.slug}</a>
          </div>
        </div>

        <div className="body">
          <div className="row">
            <div className="invoiceDetails">
              <h2>Donation Receipt</h2>
              <div className="detail"><label>Date:</label> {i18n.moment(createdAt).format('D MMMM YYYY')}</div>
              <div className="detail reference"><label>Reference:</label> {i18n.moment(createdAt).format('YYYYMM')}-{transaction.CollectiveId}-{transaction.id}</div>
            </div>
            <div className="userBillingAddress">
              <h2>{i18n.getString('billTo')}:</h2>
              {fromCollective.name}<br />
              <div dangerouslySetInnerHTML={userBillingAddress} />
            </div>
          </div>

          <Table columns={columns} data={data} rowClassName={(row, index) => (index === data.length - 1) ? `footer` : ''} />
        </div>

        <div className="footer">
          <a href={transaction.host.website}>
              <img src={transaction.host.avatar} />
          </a><br />
          <div className="hostBillingAddress">
            {transaction.host.name}<br />
            <div dangerouslySetInnerHTML={hostBillingAddress} />
          </div>
        </div>
      </div>
    );
  }
}

Invoice.PropTypes = {
  i18n: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired
};
