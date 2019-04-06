import CodeMirror from 'codemirror'
import FileSaver from 'file-saver'

import itemConfigParser from './parsing/itemconfig'
import generalConfigParser from './parsing/generalconfig'

CodeMirror.commands.save = (editor) => {
  var blob = new Blob([editor.getValue()], {type: 'text/plain;charset=utf-8'});
  FileSaver.saveAs(blob, 'bh_config.cfg')
};

CodeMirror.defineMode('bhconfig', function() {

  const START = 0;

  var stream;
  var state;

  const handleComment = () => {
    if (stream.match(/\s*\/\//)) {
      stream.skipToEnd();
      state.pos = START;
      return 'unique';
    }
  }

  const handleWilderness = () => {
    stream.next();
  }

  return {
    startState: function() {
      return {
        pos: START
      }
    },
    token: function(_stream, _state) {
      stream = _stream
      state = _state
      return handleComment()
        || itemConfigParser(stream, state)
        || generalConfigParser(stream, state)
        || handleWilderness()
    },
    lineComment: '//'
  };
});
