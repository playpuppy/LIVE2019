import React, { useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';
import './Editor.css';
import { Puppy } from '../../vm/vm';

import { Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faPlay } from '@fortawesome/free-solid-svg-icons';

import { CodeEditor } from '../../modules/editor';

monacoEditor.editor.defineTheme('error', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#ffEEEE',
  },
});

// monacoEditor.languages.registerCodeActionProvider('python', {
//   provideCodeActions: (
//     model: monacoEditor.editor.ITextModel,
//     range: monacoEditor.Range,
//     context: monacoEditor.languages.CodeActionContext,
//     token: monacoEditor.CancellationToken
//   ) => {
//     console.log(context);
//     const workSpaceEdit: monacoEditor.languages.WorkspaceEdit = {
//       edits: [
//         {
//           edits: [
//             {
//               range,
//               text: 'test',
//             },
//           ],
//           resource: model.uri,
//         },
//       ],
//     };
//     const codeActions: monacoEditor.languages.CodeAction[] = [
//       {
//         title: 'Test',
//         edit: workSpaceEdit,
//         command: { id: '001', title: 'test' },
//         diagnostics: [],
//         kind: 'quickfix',
//         isPreferred: true,
//       },
//     ];
//     console.log(codeActions);
//     return codeActions;
//   },
// });

monacoEditor.languages.registerCompletionItemProvider('python', {
  provideCompletionItems: (
    model: monacoEditor.editor.ITextModel,
    position: monacoEditor.Position,
    context: monacoEditor.languages.CompletionContext,
    _token
  ) => {
    const wordInfo = model.getWordUntilPosition(position);
    const range = new monacoEditor.Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn
    );
    const math = [
      'pi',
      'sin',
      'cos',
      'tan',
      'sqrt',
      'log',
      'log10',
      'pow',
      'hypot',
      'gcd',
    ];
    const python = ['input', 'print', 'len', 'range', 'int', 'float', 'str'];
    const random = ['random'];
    const matter = ['World', 'Circle', 'Rectangle', 'Polygon', 'Label'];
    const parameters = [
      'width',
      'height',
      'isStatic',
      'restitution',
      'fillStyle',
      'image',
      'strokeStyle',
      'lineWidth',
    ];

    const suggestions: monacoEditor.languages.CompletionItem[] = [];

    math.map(label => {
      suggestions.push({
        label,
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules:
          monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    python.map(label => {
      suggestions.push({
        label,
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules:
          monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    random.map(label => {
      suggestions.push({
        label,
        kind: monacoEditor.languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules:
          monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    matter.map(label => {
      suggestions.push({
        label,
        kind: monacoEditor.languages.CompletionItemKind.Constructor,
        insertText: `${label}(\${1})`,
        insertTextRules:
          monacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    parameters.map(label => {
      suggestions.push({
        label,
        kind: monacoEditor.languages.CompletionItemKind.Property,
        insertText: `${label}=`,
        range,
      });
    });
    return { suggestions: suggestions };
  },
});

const zenkaku =
  '[！　”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［＼￥］＾＿‘｛｜｝～￣' +
  'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ' +
  'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ' +
  '１２３４５６７８９０' +
  '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾉﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ]';

type EditorFooterProps = {
  setFontSize: (fontSize: number) => void;
  fontSize: number;
  setIsLive: (isLive: boolean) => void;
  isLive: boolean;
};

const EditorFooter: React.FC<EditorFooterProps> = (
  props: EditorFooterProps
) => {
  const fontPlus = () => {
    props.setFontSize(props.fontSize + 3);
  };
  const fontMinus = () => {
    props.setFontSize(Math.max(12, props.fontSize - 3));
  };
  return (
    <div id="editor-footer">
      <Button onClick={() => props.setIsLive(!props.isLive)}>
        {props.isLive ? (
          <Spinner animation="grow" variant="light" size="sm" />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
        {' LIVE'}
      </Button>
      <Button onClick={fontPlus}>
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <Button onClick={fontMinus}>
        <FontAwesomeIcon icon={faMinus} />
      </Button>
    </div>
  );
};

export type EditorProps = {
  width: number;
  height: number;
  codeEditor: CodeEditor | null;
  decoration: string[];
  fontSize: number;
  theme: string;
  code: string;
  diffStartLineNumber: number | null;
  puppy: Puppy | null;
  isLive: boolean;
  coursePath: string;
  page: number;
  setCode: (code: string) => void;
  setSize: (width: number, height: number) => void;
  setCodeEditor: (codeEditor: CodeEditor | null) => void;
  setDecoration: (decoration: string[]) => void;
  setFontSize: (fontSize: number) => void;
  setDiffStartLineNumber: (startLineNumber: number | null) => void;
  setIsLive: (isLive: boolean) => void;
  trancepile: (
    puppy: Puppy | null,
    code: string,
    alwaysRun: boolean,
    waitStart?: boolean,
    isLive?: boolean
  ) => Puppy | null;
};

let resizeTimer: NodeJS.Timeout;
let trancepileTimer: NodeJS.Timeout | null;
let startTimer: NodeJS.Timeout | null;

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
  const editorOptions = {
    selectOnLineNumbers: true,
    fontSize: props.fontSize,
    wordWrap: 'on' as 'on',
    lightbulb: { enabled: true },
  };

  addEventListener('resize', () => {
    clearTimeout(resizeTimer!);
    resizeTimer = setTimeout(function() {
      props.setSize(
        document.getElementById('right-col')!.clientWidth,
        document.getElementById('right-col')!.clientHeight
      );
    }, 300);
  });

  useEffect(() => {
    props.setSize(
      document.getElementById('right-col')!.clientWidth,
      document.getElementById('right-col')!.clientHeight
    );
  }, []);

  const checkZenkaku = (codeEditor: CodeEditor) => {
    const zenkakuRanges = codeEditor
      .getModel()!
      .findMatches(zenkaku, true, true, false, null, false);
    const decos: monacoEditor.editor.IModelDeltaDecoration[] = zenkakuRanges.map(
      (match: monacoEditor.editor.FindMatch) => ({
        range: match.range,
        options: { inlineClassName: 'zenkakuClass' },
      })
    );
    props.setDecoration(codeEditor.deltaDecorations(props.decoration, decos));
  };

  const codeOnChange = (
    new_code: string,
    event: monacoEditor.editor.IModelContentChangedEvent
  ) => {
    let startNumber = props.diffStartLineNumber;
    event.changes.map(change => {
      startNumber =
        startNumber === null
          ? change.range.startLineNumber
          : Math.min(startNumber, change.range.startLineNumber);
    });
    if (startNumber !== null) {
      props.setDiffStartLineNumber(startNumber);
    }
    props.setCode(new_code);
    if (props.codeEditor) {
      checkZenkaku(props.codeEditor);
    }
    if (props.isLive) {
      if (trancepileTimer) {
        clearTimeout(trancepileTimer);
        trancepileTimer = null;
      }
      // trancepileTimer = setTimeout(() => {
      //   props.trancepile(props.puppy, new_code, false);
      //   window.sessionStorage.setItem(
      //     `/api/sample/${props.coursePath}/${props.page}`,
      //     new_code
      //   );
      // }, 1500);
      trancepileTimer = setTimeout(() => {
        (puppy => {
          if (startTimer) {
            clearTimeout(startTimer);
            startTimer = null;
          }
          startTimer = setTimeout(() => {
            if (puppy) {
              puppy.start();
            }
            props.setDiffStartLineNumber(null);
          }, 1500);
        })(props.trancepile(props.puppy, new_code, false, true, true));
        window.sessionStorage.setItem(
          `/api/sample/${props.coursePath}/${props.page}`,
          new_code
        );
      }, 300);
    }
  };
  const hoge: string = 'piyo';

  hoge.startsWith('hoge');

  const editorDidMount = (editor: CodeEditor) => {
    props.setCodeEditor(editor);
  };

  return (
    <div id="puppy-editor">
      <MonacoEditor
        width={props.width}
        height={props.height}
        language="python"
        theme={props.theme}
        value={props.code}
        options={editorOptions}
        onChange={codeOnChange}
        editorDidMount={editorDidMount}
      />
      <EditorFooter
        setFontSize={props.setFontSize}
        fontSize={props.fontSize}
        setIsLive={props.setIsLive}
        isLive={props.isLive}
      />
    </div>
  );
};

export default Editor;
