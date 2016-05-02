import React, { Component, PropTypes } from 'react';
import formatCurrency from '../../lib/format_currency';
import Slider from '../Slider';

export default class DonationDistributorItem extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    amount: PropTypes.number,
    currency: PropTypes.string
  }

  static defaultProps = {
    amount: 0,
    value: 0,
    currency: 'USD'
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {value, amount, currency, icon, label, onChange, editable} = this.props;
    const itemAmount = (value/100) * amount;
    const formattedItemAmount = formatCurrency(itemAmount, currency, {compact: true});
    return (
      <div className='DonationDistributorItem-container'>
        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex flex-column'>
              <div className='flex -not-selectable'>
                <div>
                  <img src={icon} width='16px' height='16px' style={{display: icon ? 'inline-block' : 'none'}}/>
                </div>
                <div className={`flex-auto left-align ${editable ? '' : '-dashed-bg'}`}>
                  <div className='DonationDistributorItem-label -not-selectable'>{label}</div>
                </div>
              </div>
              <div style={{paddingLeft: '2px', display: editable ? 'block' : 'none'}}>
                <Slider className='Slider--green' onChange={onChange} value={value}/>
              </div>  
            </div>
          </div>
          <div className="DonationDistributorItem-amount -not-selectable">
            <span>{formattedItemAmount}</span>
          </div>
        </div>
      </div>
    );
  }
}
