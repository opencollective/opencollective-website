import expect from 'expect';
import validate from '../../../validators/profile';

describe('validator profile', () => {
  it('should resolve the promise when the data is valid', (done) => {
    const profile = {
      paypalEmail: 'test@gmail.com',
      link: 'http://opencollective.com/static/images/icon.svg',
    };

    validate(profile)
    .then(value => {
      expect(value).toEqual(profile);
      done();
    });
  });

  // Check for data validity

  it('should reject the promise when paypalEmail is not valid', (done) => {
    validate({
      paypalEmail: 'ben'
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });


  it('should throw an error if the paypalEmail format is not valid', (done) => {
    validate({
      paypalEmail: 'testgmail.com',
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });

  it('should throw an error if the url format is not valid', (done) => {
    validate({
      link: 'opencollective',
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });

  it('should throw an error if the passwords don\'t match', (done) => {
    validate({
      password: 'password',
      passwordConfirmation: 'password123'
    })
    .catch(error => {
      expect(error.name).toEqual('ValidationError');
      done();
    });
  });
});

