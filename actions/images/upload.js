import { post } from '../../lib/api';
import * as constants from '../../constants/images';

/**
 * Upload an image to S3
 */

export default (data) => {
  return dispatch => {
    dispatch(request(data));
    return post('images/', data)
      .then(json => dispatch(success(json)))
      .catch(error => dispatch(failure(error)));
  };
};

function request(data) {
  return {
    type: constants.UPLOAD_IMAGE_REQUEST,
    data
  };
}

function success(json) {
  return {
    type: constants.UPLOAD_IMAGE_SUCCESS,
    response: json
  };
}

function failure(error) {
  return {
    type: constants.UPLOAD_IMAGE_FAILURE,
    error: error
  };
}


