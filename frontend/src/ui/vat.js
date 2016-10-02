/**
 * Static data the for the transaction form
 */
export default function(slug) {
  let vat = false;
  switch (slug) {
    case 'laprimaire':
    case 'nuitbout':
    case 'lesbarbares':
      vat = true;
      break;

    default: 
      vat = false;
  }
  return vat;
}
