import React from 'react';
import Markdown from '../../components/Markdown';

export default class PublicGroupApplyToManageFunds extends React.Component {
  render() {
    const {
      group,
      i18n
    } = this.props;

    const mailToLink = `mailto:info@opencollective.com?subject=${group.name} wants to manage money on Open Collective!&body=Hi there!%0D%0A%0D%0AWe want to find out more about managing money for ${group.name}. Please let us know what we need to do to enable public donations and expenses.%0D%0A%0D%0AThanks!`.replace(/ /g, "%20");

    return (
      <section id='apply-for-funds' className='bg-black white'>
        <div className='PublicGroupWhyJoin container clearfix md-flex'>
          <div className='col md-col-6 col-12 relative' ref='PublicGroupWhyJoin-whyJoinMedia'>
            <div className='PublicGroup-Media-container'>
              <div className='PublicGroup-image absolute top-0 left-0 bg-contain bg-center bg-no-repeat height-100 width-100'
                  style={{backgroundImage: 'url(/static/images/whyjoin-placeholder.png)'}}>
              </div>
            </div>
          </div>

          <div className='PublicGroup-summary col md-col-6 col-12 flex flex-column justify-between mx-auto' ref='PublicGroupApplyToManageFunds-applyForFunds'>
            <div>
              <span className='PublicGroup-title white -ff-sec -fw-bold'>{i18n.getString('manageMoneyTitle')}</span>
              <div>
                <Markdown className='PublicGroup-font-17 mt3' value={i18n.getString('wantToRaiseMoneyText')} />
                <a href='/faq'>Learn more </a>
              </div>
            </div>
            <div className='PublicGroup-metricContainer flex pt4'>

                <div className='pt1 mt3 mb2'>
                  <a href={mailToLink} className='-btn -btn-outline -border-green -ff-sec -fw-bold -ttu -wsnw'>{i18n.getString('applyButtonText')}</a>
                </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
