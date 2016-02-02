import any from 'lodash/collection/any';
import roles from '../constants/roles.js';

export default (groups) => any(groups, 'role', roles.HOST);
