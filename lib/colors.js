module.exports = {
  // aliases
  GREY: '30',
  RED: '31',
  GREEN: '32',
  YELLOW: '33',
  BLUE: '34',
  MAGENTA: '35',
  BOLD: '1',
  BOLDWHITE: '1;37',
  NIL: '0;0',

  keyword: 'BOLD',
  built_in: 'keyword',
  tag: 'keyword', /* css tag */
  class: 'keyword', /* css class */

  title: '4', /* tags, function names */

  comment: 'GREY',
  doctype: 'comment',
  pi: 'comment', /* xml declaration */
  preprocessor: 'comment', /* C/C++ preprocessor directives */
  horizontal_rule: 'comment',  /* markdown HR --- */
  javadoc: 'comment', /* javascript double-star comments */

  string: 'GREEN',
  value: 'string', /* html/json values */
  code: 'string', /* markdown code */
  link_reference: 'string', /* markdown link reference */

  number: 'YELLOW',
  symbol: 'number', /* ruby :symbols */
  hexcolor: 'number', /* css hex holor */
  link_url: 'number', /* markdown link url */

  'function': 'BOLD', /* css function, like rgba() */
  strong: 'function', /* markdown strong */
  link_label: 'strong', /* markdown links */

  header: 'BOLDWHITE', /* markdown header */

  attribute: 'BLUE', /* html/json attributes */
  literal: 'attribute', /* true, false, etc */
  variable: 'attribute', /* xml variable */

  pseudo: 'GREY', /* css pseudoclass :before */
  attr_selector: 'pseudo', /* css attr [type='number'] */
  blockquote: 'pseudo', /* markdown blockquote */

  params: 'NIL', /* function parameters () */
  regexp: 'MAGENTA',

  subst: 'NIL',

  addition: 'GREEN', /* diff + */
  deletion: 'RED',   /* diff - */
  chunk: 'BLUE',     /* diff @@ -1,119 +1,768 @@ */
};
