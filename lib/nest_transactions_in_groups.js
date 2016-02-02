import filter from 'lodash/collection/filter';
import extend from 'lodash/object/extend';
import values from 'lodash/object/values';

import sortByDate from './sort_by_date';

/**
 * Builds the following structure from a group collection and a transaction
 * collection. This is used in the UI to display the data
 *
 * @example
 *
 * => [{
 *      id: 1,
 *      name: 'Group1',
 *      transactions: [{ id: 1, GroupId: 1 }]
 *    }]
 */

export default (groups, transactions) => {
  const transactionsArray = values(transactions);
  const groupsArray = values(groups);

  return groupsArray.map((group) => {
    return extend(group, {
      transactions: filter(transactionsArray, { GroupId: group.id, approved: false }).sort(sortByDate)
    });
  });
};
