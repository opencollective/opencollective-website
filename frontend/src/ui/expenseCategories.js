/**
 * Static data the for the expense form
 */

export default function(groupid) {
  if (typeof groupid == "string")
    groupid = parseInt(groupid, 10);

  let categories = [];
  switch (groupid) {
    // Women Who Code
    case 2:
    case 3:
    case 4:
    case 10:
    case 12:
    case 13:
    case 14:
    case 15:
    case 47:
    case 48:
    case 51:
    case 59:
    case 195:
    case 241:
      categories = [
        'Conference',
        'Donation',
        'Fees',
        'Fireside Chat',
        'Global Development',
        'Hack Night', 
        'Hackathon',
        'Leadership Development',
        'Leadership Supplies',
        'Lightning Talks',
        'Scholarship',
        'Speaker Series', 
        'Sponsorship',
        'Tech Panel',
        'Transaction Fees',
        'Study Group',
        'Workshop',
        'Other WWCode Event',
        'Other'
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
    case 114: // partidodigital
      categories = [
        'Comunicación',
        'Diseño',
        'Aporte',
        'Sistemas',
        'Fondos',
        'Alimentos y Bebidas',
        'Marketing',
        'Legales',
        'Suministros & materiales',
        'Viajes',
        'Equipo',
        'Oficina',
        'Otros',
        'Servicios Digitales'
      ];
      break;
    case 245: // analizebasilicata
      categories = [
        'Comunicazioni',
        'Disign',
        'Donazione',
        'Sviluppo software',
        'Accantonamento',
        'Cibo & bevande',
        'Marketing',
        'Legale',
        'Forniture & materiali',
        'Viaggio',
        'Squadra',
        'Ufficio',
        'Altro',
        'Servizi web'
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
