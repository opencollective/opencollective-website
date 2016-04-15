import React from 'react';
import formatCurrency from '../../lib/format_currency';
import Media from '../../components/Media';
import Metric from '../../components/Metric';

export default class PublicGroupWhyJoin extends React.Component {
  render() {
    const {
      group,
      i18n,
      expenses
    } = this.props;

    const hasMedia = (group.video || group.image);
    const summaryNoMediaClassNames = !hasMedia ? ' mx-auto' : '';

    return (
      <section id='why-join' className='bg-black white'>
        <div className='PublicGroupWhyJoin container clearfix md-flex'>
          {hasMedia && (
            <div className='col md-col-6 col-12 relative'>
              <div className='PublicGroup-Media-container'>
                <Media group={group} />
              </div>
            </div>
          )}

          <div className={`PublicGroup-summary col md-col-6 col-12 px4 flex flex-column justify-between ${summaryNoMediaClassNames}`}>
            <div>
              <h2 className='PublicGroup-title white mt3 -ff-sec -fw-bold'>{i18n.getString('becomeMemberTitle')}</h2>
              <p className='PublicGroup-font-15'>{i18n.getString('becomeMemberText')}</p>
            </div>
            <div className='PublicGroup-metricContainer flex py3'>
              <Metric label={i18n.getString('fundsAvailable')}
                value={ formatCurrency(group.balance, group.currency, { precision: 0 }) }
                className='flex-auto pr2' />

              {(expenses.length > 0) && (
                <div className='pt1 pl1'>
                  <a href='#expenses-and-activity' className='-btn -btn-outline -border-green -btn-small -ff-sec -fw-bold -ttu -wsnw'>{i18n.getString('howWeSpend')}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
