import React, { Component } from 'react'
import 'codemirror/lib/codemirror.css'
import './bhconfig'
import './diablo.css'
import hintingFunction from './hinting'

import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/search/match-highlighter'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/matchesonscrollbar.css'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/selection/active-line'

import { Controlled as ReactCodeMirror } from 'react-codemirror2'

const configSamples = require('../../../resources/samples.json')

class Editor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      code: configSamples['planqi-full'],
      options: {
        mode: 'bhconfig',
        theme: 'diablo',
        lineNumbers: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        autofocus: true,
        hintOptions: {
          hint: hintingFunction,
          completeSingle: false
        },
        extraKeys: {"Ctrl-Space": "autocomplete"},
        search: true,
        searchCursor: true,
        highlightSelectionMatches: {annotateScrollbar: true},
        matchesOnScrollbar: true,
        
      }
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(editor, data, value) {
    this.setState({
      code: value
    })
  }

  render() {
    return (
      <ReactCodeMirror
        value={this.state.code}
        options={this.state.options}
        onBeforeChange={(editor, data, value) => {
          this.setState({code: value});
        }}
        onChange={this.onChange}

      >

      </ReactCodeMirror>
    )
  }

}

export default Editor