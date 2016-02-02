/**
 * Static data the for the transaction form
 */

export default function(groupid) {
  if(typeof groupid == "string")
    groupid = parseInt(groupid, 10);

  let vat = false;
  switch (groupid) {
    case 6: // LaPrimaire.org
      vat = true;
      break;

    default: 
      vat = false;
  }
  return vat;
}
