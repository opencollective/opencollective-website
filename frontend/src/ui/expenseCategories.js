/**
 * Static data the for the expense form
 */
export default function(slug = '') {

  let categories = [];
  let base_slug = slug;
  if (slug.match(/^wwcode/))
    base_slug = 'wwcode';

  switch (base_slug) {
    // Women Who Code
    case 'wwcode':
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
    case 'laprimaire': // laprimaire
    case 'nuitdebout': // nuitdebout
    case 'lesbarbares': // lesbarbares
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
    case 'partidodigital':
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
    case 'analizebasilicata':
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
