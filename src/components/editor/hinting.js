
var hints = [];

const populateHints = (loadedHints) => {
  loadedHints.forEach(arr => {
    hints.push({ text: [arr[0]], displayText: arr[1] })
  });
}

populateHints(require('../../../resources/hints.json'));
populateHints(require('../../../resources/item-codes.json'));
populateHints(require('../../../resources/skills.json'));
populateHints(require('../../../resources/virtual-keys.json'));

const hinting = (editor, options) => {
  var word = /\w/
  var cur = editor.getCursor();
  var curLine = editor.getLine(cur.line);
  var start = cur.ch;
  var end = start;
  while (end < curLine.length && word.test(curLine.charAt(end))) end++;
  while (start && word.test(curLine.charAt(start - 1))) start--;
  var curWord = start != cur.ch && curLine.slice(start, cur.ch);
  var curWordFilter = new RegExp('^' + curWord);

  var from = { line: cur.line, ch: start };
  var to = { line: cur.line, ch: end }
  
  const list = hints.filter((hint) => {
      return curWordFilter.test(hint.text);
    });
  return {
    list: list,
    from: from,
    to: to
  }
}
// return a {list, from, to} object, where list is an array of strings
// or objects (the completions), and from and to give the start and end 
// of the token that is being completed as {line, ch} objects

export default hinting;