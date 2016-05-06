import React, { Component, PropTypes } from 'react';
import formatCurrency from '../../lib/format_currency';
import Slider from '../Slider';

export default class DonationDistributorItem extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    amount: PropTypes.number,
    currency: PropTypes.string,
    editableAmount: PropTypes.bool
  }

  static defaultProps = {
    amount: 0,
    value: 100,
    currency: 'USD',
    editableAmount: false
  }

  constructor(props) {
    super(props);
    this.state = {
      editingAmount: false
    };
  }

  render() {
    const {value, amount, currency, icon, label, onChange, editable, className, editableAmount} = this.props;
    const {editingAmount} = this.state;
    const itemAmount = (value/100) * amount;
    const formattedItemAmount = formatCurrency(itemAmount, currency, {compact: true});
    return (
      <div className={`DonationDistributorItem-container ${className} ${editable ? 'DonationDistributorItem--editable' : ''}`}>
        <div className='flex'>
          <div className='flex-auto'>
            <div className='flex flex-column'>
              <div className='flex -not-selectable'>
                <div>
                  <img ref='icon' src={icon} onError={() => this.refs.icon.style.display = 'none'} width='16px' height='16px' style={{display: icon ? 'inline-block' : 'none'}}/>
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
          <div className='DonationDistributorItem-amount -not-selectable'>
            {!editableAmount && (<span>{formattedItemAmount}</span>)}
            {editableAmount && !editingAmount &&  
              (<input
                value={formatCurrency(itemAmount, currency, {compact: true})}
                className='DonationDistributorItem--input'
                onFocus={() => {
                  this.setState({editingAmount: true}, () => {
                    const amountInput = this.refs.amountInput;
                    amountInput.value = itemAmount.toFixed(2);
                    amountInput.setSelectionRange(0, amountInput.value.length);
                    amountInput.focus();
                  });
                }}
              ></input>)
            }
            {editableAmount && editingAmount &&  
              (<input ref='amountInput'
                className='DonationDistributorItem--input'
                onFocus={() => {
                  this.setState({editingAmount: true});
                }}
                onBlur={() => {
                  if (isNaN(this.refs.amountInput.value)) return;
                  const newAmount = parseFloat(this.refs.amountInput.value);
                  let newPercentage = newAmount / amount;
                  if (newPercentage > 1) newPercentage = 1;
                  if (newPercentage < 0) newPercentage = 0;
                  this.props.onChange(newPercentage * 100);
                  this.setState({editingAmount: false});
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) this.refs.amountInput.blur();
                }}
              ></input>)
            }
          </div>
        </div>
      </div>
    );
  }
}
