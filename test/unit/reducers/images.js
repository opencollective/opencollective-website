import expect from 'expect';
import reducer from '../../../reducers/images';
import * as constants from '../../../constants/images';

describe('images reducer', () => {

  it('should set isUploading when it starts uploading', () => {
    expect(reducer({}, {
      type: constants.UPLOAD_IMAGE_REQUEST
    }))
    .toEqual({ isUploading: true});
  });

  it('should reset isUploading when it fails uploading', () => {
    expect(reducer({}, {
      type: constants.UPLOAD_IMAGE_FAILURE
    }))
    .toEqual({ isUploading: false});
  });

  it('should reset isUploading when it succeeds uploading', () => {
    expect(reducer({}, {
      type: constants.UPLOAD_IMAGE_SUCCESS
    }))
    .toEqual({ isUploading: false});
  });
});
