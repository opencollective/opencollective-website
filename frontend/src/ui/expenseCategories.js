/**
 * Static data the for the expense form
 */

export default function(groupid) {
  if(typeof groupid == "string")
    groupid = parseInt(groupid, 10);

  let categories = [];
  switch (groupid) {
    // Women Who Code
    case 2:
    case 3:
    case 4:
      categories = [
        'Donation',
        'Event Refreshments',
        'Event Travel',
        'Event Prizes',
        'Event Facilities',
        'Network supplies',
        'Other Program Expense'
      ];
      break;
    case 6: // laprimaire
    case 73: // nuitdebout
    case 24: // lesbarbares
      categories = [
        'Admin',
        'Autre',
        'Communication',
        'Déplacement',
        'Marketing',
        'NDD',
        'Outils',
        'PI',
        'Papeterie',
        'Représentation',
        'Serveur',
        'Transport'
      ];
      break;
    default:
      categories = [
        'Communications',
        'Design',
        'Donation',
        'Engineering',
        'Fund',
        'Food & Beverage',
        'Marketing',
        'Legal',
        'Supplies & materials',
        'Travel',
        'Team',
        'Office',
        'Other',
        'Web services'
      ];
  }
  return categories.sort();
}
