import merge from 'lodash/object/merge';
import {
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE
} from '../constants/images';

export default function images(state={}, action={}) {
  switch (action.type) {
    case UPLOAD_IMAGE_REQUEST:
      return merge({}, state, { isUploading: true });

    case UPLOAD_IMAGE_SUCCESS:
    case UPLOAD_IMAGE_FAILURE:
      return merge({}, state, { isUploading: false });

    default:
      return state;
  }
}