/* eslint-disable */
/**
 * @copyright https://github.com/sonnym/inflect-js/
 */
var uncountable_words = [ 'equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'moose', 'deer', 'news' ]

  // These rules translate from the singular form of a noun to its plural form.
  , plural_rules = [
      [new RegExp('(m)an$', 'gi'),                 '$1en'],
      [new RegExp('(pe)rson$', 'gi'),              '$1ople'],
      [new RegExp('(child)$', 'gi'),               '$1ren'],
      [new RegExp('^(ox)$', 'gi'),                 '$1en'],
      [new RegExp('(ax|test)is$', 'gi'),           '$1es'],
      [new RegExp('(octop|vir)us$', 'gi'),         '$1i'],
      [new RegExp('(alias|status)$', 'gi'),        '$1es'],
      [new RegExp('(bu)s$', 'gi'),                 '$1ses'],
      [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
      [new RegExp('([ti])um$', 'gi'),              '$1a'],
      [new RegExp('sis$', 'gi'),                   'ses'],
      [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),  '$1$2ves'],
      [new RegExp('(hive)$', 'gi'),                '$1s'],
      [new RegExp('([^aeiouy]|qu)y$', 'gi'),       '$1ies'],
      [new RegExp('(x|ch|ss|sh)$', 'gi'),          '$1es'],
      [new RegExp('(matr|vert|ind)ix|ex$', 'gi'),  '$1ices'],
      [new RegExp('([m|l])ouse$', 'gi'),           '$1ice'],
      [new RegExp('(quiz)$', 'gi'),                '$1zes'],
      [new RegExp('s$', 'gi'),                     's'],
      [new RegExp('$', 'gi'),                      's']
  ]

  // These rules translate from the plural form of a noun to its singular form.
  , singular_rules = [
      [new RegExp('(m)en$', 'gi'),                                                       '$1an'],
      [new RegExp('(pe)ople$', 'gi'),                                                    '$1rson'],
      [new RegExp('(child)ren$', 'gi'),                                                  '$1'],
      [new RegExp('([ti])a$', 'gi'),                                                     '$1um'],
      [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi'), '$1$2sis'],
      [new RegExp('(hive)s$', 'gi'),                                                     '$1'],
      [new RegExp('(tive)s$', 'gi'),                                                     '$1'],
      [new RegExp('(curve)s$', 'gi'),                                                    '$1'],
      [new RegExp('([lr])ves$', 'gi'),                                                   '$1f'],
      [new RegExp('([^fo])ves$', 'gi'),                                                  '$1fe'],
      [new RegExp('([^aeiouy]|qu)ies$', 'gi'),                                           '$1y'],
      [new RegExp('(s)eries$', 'gi'),                                                    '$1eries'],
      [new RegExp('(m)ovies$', 'gi'),                                                    '$1ovie'],
      [new RegExp('(x|ch|ss|sh)es$', 'gi'),                                              '$1'],
      [new RegExp('([m|l])ice$', 'gi'),                                                  '$1ouse'],
      [new RegExp('(bus)es$', 'gi'),                                                     '$1'],
      [new RegExp('(o)es$', 'gi'),                                                       '$1'],
      [new RegExp('(shoe)s$', 'gi'),                                                     '$1'],
      [new RegExp('(cris|ax|test)es$', 'gi'),                                            '$1is'],
      [new RegExp('(octop|vir)i$', 'gi'),                                                '$1us'],
      [new RegExp('(alias|status)es$', 'gi'),                                            '$1'],
      [new RegExp('^(ox)en', 'gi'),                                                      '$1'],
      [new RegExp('(vert|ind)ices$', 'gi'),                                              '$1ex'],
      [new RegExp('(matr)ices$', 'gi'),                                                  '$1ix'],
      [new RegExp('(quiz)zes$', 'gi'),                                                   '$1'],
      [new RegExp('s$', 'gi'),                                                           '']
  ]

  // This is a list of words that should not be capitalized for title case
  , non_titlecased_words = [
      'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
      'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
      'with', 'for'
  ]

  // These are regular expressions used for converting between String formats
  , id_suffix = new RegExp('(_ids|_id)$', 'g')
  , underbar = new RegExp('_', 'g')
  , space_or_underbar = new RegExp('[\ _]', 'g')
  , uppercase = new RegExp('([A-Z])', 'g')
  , underbar_prefix = new RegExp('^_');

/*
This is a helper method that applies rules based replacement to a String
  Signature:
    apply_rules(str, rules, skip, override) == String
  Arguments:
    str - String - String to modify and return based on the passed rules
    rules - Array: [RegExp, String] - Regexp to match paired with String to use for replacement
    skip - Array: [String] - Strings to skip if they match
    override - String (optional) - String to return as though this method succeeded (used to conform to APIs)
  Returns:
    String - passed String modified by passed rules
  Examples:
    apply_rules("cows", InflectionJs.singular_rules) === 'cow'
*/
function apply_rules(str, rules, skip, override) {
  if (override) {
    str = override;
  } else {
    var ignore = (skip.indexOf(str.toLowerCase()) > -1);
    if (!ignore) {
      for (var x = 0; x < rules.length; x++) {
        if (str.match(rules[x][0])) {
          str = str.replace(rules[x][0], rules[x][1]);
          break;
        }
      }
    }
  }
  return str;
}

module.exports.pluralize = function(string, plural) {
  return apply_rules(string, plural_rules, uncountable_words);
};

module.exports.singularize = function(string, singular) {
  return apply_rules(string, singular_rules, uncountable_words, singular);
};

module.exports.camelize = function(string, lowFirstLetter) {
  var str = string.toLowerCase();
  var str_path = str.split('/');

  for (var i = 0; i < str_path.length; i++) {
    var str_arr = str_path[i].split('_');
    var initX = ((lowFirstLetter && i + 1 === str_path.length) ? (1) : (0));

    for (var x = initX; x < str_arr.length; x++) {
      str_arr[x] = str_arr[x].charAt(0).toUpperCase() + str_arr[x].substring(1);
    }

    str_path[i] = str_arr.join('');
  }
  str = str_path.join('');
  return str;
};

module.exports.underscore = function(str) {
  var str_path = str.split('::');
  for (var i = 0; i < str_path.length; i++) {
    str_path[i] = str_path[i].replace(uppercase, '_$1');
    str_path[i] = str_path[i].replace(underbar_prefix, '');
  }
  str = str_path.join('/').toLowerCase();
  return str;
};

module.exports.humanize = function(string, lowFirstLetter) {
  var str = string.toLowerCase();
  str = str.replace(id_suffix, '');
  str = str.replace(underbar, ' ');
  if (!lowFirstLetter) {
    str = this.capitalize(str);
  }
  return str;
};

module.exports.capitalize = function(string) {
  var str = string.toLowerCase();
  str = str.substring(0, 1).toUpperCase() + str.substring(1);
  return str;
};

module.exports.dasherize = function(str) {
  str = str.replace(space_or_underbar, '-');
  return str;
};

module.exports.titleize = function(string) {
  var str = string.toLowerCase();
  str = str.replace(underbar, ' ');
  var str_arr = str.split(' ');
  for (var x = 0; x < str_arr.length; x++) {
    var d = str_arr[x].split('-');
    for (var i = 0; i < d.length; i++) {
      if (non_titlecased_words.indexOf(d[i].toLowerCase()) < 0) {
        d[i] = this.capitalize(d[i]);
      }
    }
    str_arr[x] = d.join('-');
  }
  str = str_arr.join(' ');
  str = str.substring(0, 1).toUpperCase() + str.substring(1);
  return str;
};

module.exports.demodulize = function(str) {
  var str_arr = str.split('::');
  str = str_arr[str_arr.length - 1];
  return str;
};

module.exports.tableize = function(str) {
  return this.pluralize(this.underscore(str));
};

module.exports.classify = function(str) {
  return this.singularize(this.camelize(str));
};

module.exports.foreign_key = function(str, dropIdUbar) {
  str = this.underscore(this.demodulize(str)) + ((dropIdUbar) ? ('') : ('_')) + 'id';
  return str;
};

module.exports.ordinalize = function(str) {
  var str_arr = str.split(' ');
  for (var x = 0; x < str_arr.length; x++) {
    var i = parseInt(str_arr[x]);
    if (i !== NaN) {
      var ltd = str_arr[x].substring(str_arr[x].length - 2);
      var ld = str_arr[x].substring(str_arr[x].length - 1);
      var suf = "th";
      if (ltd != "11" && ltd != "12" && ltd != "13") {
        if (ld === "1") { suf = "st"; }
        else if (ld === "2") { suf = "nd"; }
        else if (ld === "3") { suf = "rd"; }
      }
      str_arr[x] += suf;
    }
  }
  str = str_arr.join(' ');
  return str;
};
