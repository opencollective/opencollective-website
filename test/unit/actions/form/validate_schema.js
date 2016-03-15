import expect from 'expect';
import Joi from 'joi';

import mockStore from '../../helpers/mockStore';
import validate from '../../../../frontend/src/actions/form/validate_schema';
import * as constants from '../../../../frontend/src/constants/form';

describe('form/validate_schema', () => {
  const schema = Joi.object().keys({
    name: Joi.string().allow('')
  });

  it('validates a schema and return VALIDATE_SCHEMA_SUCCESS', (done) => {
    const obj = { name: 'lucy' };
    const store = mockStore({});

    store.dispatch(validate(obj, schema))
      .then(() => {
        const [request, success] = store.getActions();

        expect(request).toEqual({ type: constants.VALIDATE_SCHEMA_REQUEST, obj, schema});
        expect(success).toEqual({ type: constants.VALIDATE_SCHEMA_SUCCESS, obj, schema, value: obj});
        done();
      })
      .catch(done);
  });

  it('fails if the obj is wrong and reject VALIDATE_SCHEMA_FAILURE', (done) => {
    const obj = { name: 12 };
    const store = mockStore({});

    store.dispatch(validate(obj, schema))
      .catch(() => {
        const [request, failure] = store.getActions();

        expect(request).toEqual({ type: constants.VALIDATE_SCHEMA_REQUEST, obj, schema});
        expect(failure.type).toEqual(constants.VALIDATE_SCHEMA_FAILURE);
        expect(failure.error).toExist();
        done();
      })
      .catch(done);
  });
});
