
const itemConfigParser = (_stream, _state) => {
  var stream = _stream
  var state = _state

  const START = 0;
  const OPEN_BRACKET = 101;
  const CONDITIONS = 102;
  const COLON = 103;
  const ACTIONS = 104;

  const at = (pos) => {
    return state.pos == pos
  }

  const handleStart = () => {
    if (at(START)) {
      if (stream.sol() && stream.match(/ItemDisplay/)) {
        state.pos = OPEN_BRACKET;
        return 'keyword';
      }
    }
  }

  const handleOpenBracket = () => {
    if (at(OPEN_BRACKET)) {
      if (stream.eat('[')) {
        state.pos = CONDITIONS;
        return 'bracket';
      } else {
        stream.skipToEnd();
        return 'error';
      }
    }
  }

  const handleConditions = () => {
    if (at(CONDITIONS)) {
      stream.eatSpace();
      if (stream.eat(']')) {
        state.pos = COLON;
        return 'bracket';
      }
      else if (stream.match(/(AND|OR)/)) {
        return 'operator';
      }
      else if (stream.match(/!/)) {
        return 'exc'
      }
      else if (stream.match(/(RUNE|RW|FOOLS|GOLD)/)) {
        return 'crafted';
      }
      else if (stream.match(/SOCK/)
        || stream.match(/ETH/)) {
        return 'gray';
      }
      else if (stream.match(/GEM(TYPE)?/)) {
        return 'gem';
      }
      else if (stream.match(/NMAG/)) {
        return 'white';
      }
      else if (stream.match(/MAG/)) {
        return 'magic'
      }
      else if (stream.match(/RARE/)) {
        return 'rare'
      }
      else if (stream.match(/SET/)) {
        return 'set'
      }
      else if (stream.match(/UNI/)) {
        return 'unique'
      }
      else if (stream.match(/NORM/)) {
        return 'norm'
      }
      else if (stream.match(/EXC/)) {
        return 'exc'
      }
      else if (stream.match(/ELT/)) {
        return 'elt'
      }
      else if (stream.match(/(ID|ILVL|LREQ|CLVL)/)) {
        return 'text'
      }
      else if (stream.match(/(CLSK[0-6]|ALLSK|TABSK\d{1,2}|SK\d{1,3}|GOODTBSK|GOODCLSK)/)) {
        return 'skill'
      }
      else if (stream.match(/[FCLP]?RES/)) {
        return 'string'
      }
      else if (stream.match(/(FCR|FRW|DEF|LIFE|MANA|IAS|FHR|ED|MFIND|GFIND|STR|DEX|VIT|ENG|AR)/)) {
        return 'string'
      }
      else if (stream.match(/(?=.{1,2}[a-z])[a-z0-9]{3}(?=\b)/)) {
        return 'variable';
      }
      else if (stream.match(/EQ[1-7](?=\b)/) ||
        stream.match(/WP(1[0-3]?|[2-9])(?=\b)/) ||
        stream.match(/(WEAPON|ARMOR)/) ||
        stream.match(/CL[1-7]/)) {
        return 'variable-2'
      }
      else if (stream.match(/\d+(?=\b)/)) {
        return 'text';
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
        return "white";
      }
    }
  }

  const handleActions = () => {
    if (at(ACTIONS)) {
      if (stream.eol()) {
        state.pos = START;
        return null;
      }
      stream.next()
      if (stream.eol()) {
        state.pos = START;
      }
      return 'string';
    }
  }

  return handleStart()
    || handleOpenBracket()
    || handleConditions()
    || handleColon()
    || handleActions();
}

export default itemConfigParser