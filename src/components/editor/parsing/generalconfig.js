
const generalConfigParser = (_stream, _state) => {
  var stream = _stream
  var state = _state

  const START = 0;
  const OPEN_BRACKET = 201;
  const CONDITIONS = 202;
  const COLON = 203;
  const ACTIONS = 204;


  const at = (pos) => {
    return state.pos == pos
  }

  const handleStart = () => {
    if (at(START) && stream.sol()) {
      if (stream.match(/[\w ]+:/)) {
        stream.backUp(1);
        state.pos = COLON;
        return 'keyword';
      }
      else if (stream.match(/[\w ]+\[/)) {
        stream.backUp(1);
        state.pos = OPEN_BRACKET;
        return 'keyword';
      }
    }
  }

  const handleOpenBracket = () => {
    if (at(OPEN_BRACKET)) {
      if (stream.eat('[')) {
        state.pos = CONDITIONS;
        return 'white';
      }
    }
  }

  const handleConditions = () => {
    if (at(CONDITIONS)) {
      if (stream.match(/[^\]]/)) {
        return 'variable'
      }
      else if (stream.match(/]/)) {
        state.pos = COLON;
        return 'white';
      }
    }
  }

  const handleColon = () => {
    if (at(COLON)) {
      if (stream.eat(':')) {
        if (stream.eol()) {
          state.pos = START;
        } else {
          state.pos = ACTIONS;
        }
        return 'white';
      }
    }
  }

  const handleActions = () => {
    if (at(ACTIONS)) {
      stream.eatSpace()
      if (stream.eol()) {
        state.pos = START;
        return null;
      }
      else if (stream.match(/(True|False)/)) {
        return action('atom')
      }
      else if (stream.match(/,/)) {
        return action('white')
      }
      else if (stream.match(/None/)) {
        return action('tag')
      }
      else if (stream.match(/VK_\w+/)) {
        return action('string')
      }
      else if (stream.match(/\d+(?=\b)/) || stream.match(/(0x)?[0-9A-F]+/)) {
        return action('text')
      }
      else {
        stream.next()
        return action('text')
      }
    }
  }

  const action = (token) => {
    stream.eatSpace()
    if (stream.eol()) {
      state.pos = START;
    }
    return token
  }

  return handleStart() ||
    handleOpenBracket() ||
    handleConditions() ||
    handleColon() ||
    handleActions();
}

export default generalConfigParser