import { Schema, arrayOf } from 'normalizr';

/**
 * Schemas
 */
const GroupSchema = new Schema('groups', { idAttribute: 'slug' });
const UserSchema = new Schema('users');
const CardSchema = new Schema('cards');

/**
 * Export all the schemas to normalize them later
 */
export default {
  GROUP: GroupSchema,
  GROUP_ARRAY: arrayOf(GroupSchema),
  USER: UserSchema,
  USER_ARRAY: arrayOf(UserSchema),
  CARD: CardSchema,
  CARD_ARRAY: arrayOf(CardSchema)
};
