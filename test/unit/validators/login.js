import expect from 'expect';
import validate from '../../../validators/login';

describe('validator login', () => {
  it('should reject the promise when the data is not valid', (done) => {
    validate({
      email: 'ben'
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });

  it('should resolve the promise when the data is valid', (done) => {
    const transaction = {
      email: 'test@gmail.com',
      password: 'abc123'
    };

    validate(transaction)
    .then(value => {
      expect(value).toEqual(transaction);
      done();
    });
  });

  it('password should be not be valid if less than 6 characters', (done) => {
    validate({
      email: 'test@gmail.com',
      password: 'abc'
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });

  it('should throw an error if the email format is not valid', (done) => {
    validate({
      email: 'testgmail.com',
      password: 'abc123'
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });
});
