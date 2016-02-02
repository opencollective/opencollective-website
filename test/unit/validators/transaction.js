import expect from 'expect';
import validate from '../../../validators/transaction';

describe('validator transaction', () => {
  it('should reject the promise when the data is not valid', (done) => {
    validate({
      description: 1
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });

  it('should resolve the promise when the data is valid', (done) => {
    const transaction = {
      link: 'http://google.com/photo.jpg',
      description: 'Expense',
      amount: 10,
      vat: 10.13,
      createdAt: Date.now(),
      tags: ['Computer']
    };

    validate(transaction)
    .then(value => {
      expect(value).toEqual(transaction);
      done();
    })
    .catch(error => console.log('error', error));
  });

  it('should not validate a createdAt date in the future', (done) => {
    const transaction = {
      description: 'Expense',
      amount: 10,
      createdAt: '2120-10-10',
      tags: ['Computer']
    };

    validate(transaction)
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });

});
