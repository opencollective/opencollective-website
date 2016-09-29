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
    case 259:
    case 260:
    case 261:
    case 262:
    case 263:
    case 262:
    case 262:
    case 266:
    case 267:
    case 268:
    case 269:
    case 270:
    case 271:
    case 272:
    case 273:
    case 274:
    case 275:
    case 276:
    case 277:
    case 278:
    case 279:
    case 280:
    case 281:
    case 282:
    case 283:
    case 284:
    case 285:
    case 286:
    case 287:
    case 288:
    case 289:
    case 290:
    case 290:
    case 292:
    case 293:
    case 294:
    case 295:
    case 297:
    case 298:
    case 299:
    case 300:
    case 301:
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
