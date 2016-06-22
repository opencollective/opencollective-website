import React from 'react';
import formatCurrency from '../../lib/format_currency';
import Media from '../../components/Media';
import Metric from '../../components/Metric';
import Markdown from '../../components/Markdown';

export default class PublicGroupWhyJoin extends React.Component {
  render() {
    const {
      group,
      i18n,
      expenses
    } = this.props;

    const whyJoinText = group.whyJoin || i18n.getString('becomeMemberText');

    return (
      <section id='why-join' className='bg-black white'>
        <div className='PublicGroupWhyJoin container clearfix md-flex'>
          <div className='col md-col-6 col-12 relative'>
            <div className='PublicGroup-Media-container'>
              <Media group={group} />
            </div>
          </div>

          <div className='PublicGroup-summary col md-col-6 col-12 flex flex-column justify-between mx-auto'>
            <div>
              <span className='PublicGroup-title white -ff-sec -fw-bold'>{i18n.getString('becomeMemberTitle')}</span>
              <Markdown className='PublicGroup-font-17 mt3' value={whyJoinText} />
            </div>
            <div className='PublicGroup-metricContainer flex pt4'>
              <Metric label={i18n.getString('fundsAvailable')}
                value={ formatCurrency(group.balance/100, group.currency, { precision: 0 }) }
                className='flex-auto pr2' />

              {(expenses.length > 0) && (
                <div className='pt1 mt3 mb2'>
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
