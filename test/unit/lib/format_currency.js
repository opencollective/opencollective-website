import {expect} from 'chai';
import formatCurrency from '../../../frontend/src/lib/format_currency';

describe('formatCurrency', () => {

  it('should return $12.34', () => {
    expect(formatCurrency(1234)).to.equal('$12.34');
  });

  it('should return $12,345.67', () => {
    expect(formatCurrency(1234567)).to.equal('$12,345.67');
  });

  it('should return £12.34', () => {
    expect(formatCurrency(1234, 'GBP')).to.equal('£12.34');
  });

  it('should return 12.34', () => {
    expect(formatCurrency(1234, 'SEK')).to.equal('kr12,34');
  });

  it('should return €12.34', () => {
    expect(formatCurrency(1234,'EUR')).to.equal('€12,34');
  });

  it('should return €12 345.67', () => {
    expect(formatCurrency(1234567,'EUR')).to.equal('€12 345,67');
  });

  it('should return -€12.34', () => {
    expect(formatCurrency(-1234,'EUR')).to.equal('-€12,34');
  });

  it('should return MXN$10', () => {
    expect(formatCurrency(1000,'MXN',{precision: 0, compact: false})).to.equal('MXN $10');
  })

});
