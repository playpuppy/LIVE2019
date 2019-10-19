import { setTheme, setCode, setMarker, setDecoration } from './editor';
import { CourseShape, setCourse, setContent, setCources } from './course';
import { setPuppy, setShowTLIcon } from './puppy';
import { setPlaceholder, setShow } from './input';
import { PuppyCode, Puppy, runPuppy, ErrorLog } from '../vm/vm';
import store, { ReduxActions } from '../store';
import { compile } from '../puppy-transpiler/puppy';

import { Range } from 'monaco-editor';

import { PATH_PREFIX } from '../env';

const checkError = (
  dispatch: (action: ReduxActions) => void,
  code: PuppyCode
) => {
  let error_count = 0;
  const annos: ErrorLog[] = [];
  // editor.getSession().clearAnnotations();
  for (const e of code.errors) {
    if (e.type === 'error') {
      error_count += 1;
    }
    // ignore info
    if (e.type === 'info') {
      continue;
    }
    annos.push(e);
    // editor.getSession().setAnnotations(annos);
  }
  dispatch(setMarker(annos));
  if (error_count === 0) {
    dispatch(setTheme('vs'));
    return false;
  }
  dispatch(setTheme('error'));
  // editorPanel.style.backgroundColor = 'rgba(254,244,244,0.7)';
  return true;
};

let new_puppy: Puppy | null = null;

export const trancepile = (dispatch: (action: ReduxActions) => void) => (
  puppy: Puppy | null,
  source: string,
  alwaysRun: boolean,
  waitStart = false,
  _isLive = false
): Puppy | null => {
  const code = compile({ source }) as PuppyCode; // Eval javascript code
  console.log(code);
  if (!checkError(dispatch, code)) {
    // if (isLive && puppy && puppy!.getCode().hash === code.hash) {
    //   return puppy;
    // }
    if (new_puppy) {
      new_puppy.dispose();
    }
    new_puppy = runPuppy(puppy!, code, alwaysRun, waitStart);
    dispatch(setPuppy(new_puppy));
  }
  return new_puppy;
};

// export const trancepile = (dispatch: (action: ReduxActions) => void) => (
//   puppy: Puppy | null,
//   source: string,
//   alwaysRun: boolean,
//   waitStart = false,
//   isLive = false
// ): Promise<Puppy | null> =>
//   fetch('/api/compile', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/text; charset=utf-8',
//     },
//     body: source,
//   })
//     .then((res: Response) => {
//       if (res.ok) {
//         return res.text();
//       }
//       throw new Error(res.statusText);
//     })
//     .then((js: string) => {
//       try {
//         const code = Function(js)(); // Eval javascript code
//         if (!checkError(dispatch, code)) {
//           if (isLive && puppy && puppy!.getCode().hash === code.hash) {
//             return puppy;
//           }
//           if (new_puppy) {
//             new_puppy.dispose();
//           }
//           new_puppy = runPuppy(puppy!, code, alwaysRun, waitStart);
//           dispatch(setPuppy(new_puppy));
//         }
//         return new_puppy;
//       } catch (e) {
//         // alert(`トランスパイルにしっぱいしています ${e}`);
//         // editorPanel.style.backgroundColor = 'rgba(244,244,254,0.7)';
//         console.log(js);
//         console.log(`FAIL TO TRANSCOMPILE ${e}`);
//         console.log(e);
//         return null;
//       }
//     })
//     .catch((msg: string) => {
//       alert(`Puppy is down!! ${msg}`);
//       return null;
//     });

const loadFile: (path: string) => Promise<string> = path => {
  return fetch(path, {
    method: 'GET',
  })
    .then((res: Response) => {
      if (res.ok) {
        return res.text();
      }
      throw new Error(res.statusText);
    })
    .then((sample: string) => {
      return sample;
    });
};

export const fetchSetting = (dispatch: (action: ReduxActions) => void) => (
  path: string
): Promise<void> =>
  loadFile(`${PATH_PREFIX}/course/${path}/setting.json`)
    .then((s: string) => {
      return JSON.parse(s);
    })
    .then((course: CourseShape) => {
      dispatch(setCourse(course));
    })
    .catch((msg: string) => {
      console.log(`ERR ${msg}`);
    });

export const fetchContent = (dispatch: (action: ReduxActions) => void) => (
  coursePath: string,
  path: string
): Promise<void> =>
  loadFile(`${PATH_PREFIX}/course/${coursePath}/${path}/index.md`).then(
    (content: string) => dispatch(setContent(content))
  );

export const fetchSample = (dispatch: (action: ReduxActions) => void) => (
  puppy: Puppy | null,
  coursePath: string,
  page: number,
  path: string
): void => {
  const sample = window.sessionStorage.getItem(
    `${PATH_PREFIX}/course/${coursePath}/${path}/sample.py`
  );
  if (sample) {
    dispatch(setCode(sample));
    trancepile(dispatch)(puppy, sample, false);
  } else {
    loadFile(`${PATH_PREFIX}/course/${coursePath}/${path}/sample.py`).then(
      (sample: string) => {
        dispatch(setCode(sample));
        trancepile(dispatch)(puppy, sample, false);
      }
    );
  }
};

export const getInputValue = async (msg: string) => {
  const awaitForClick = target => {
    return new Promise(resolve => {
      target.addEventListener('submit', resolve, { once: true });
    });
  };
  store.dispatch(setShow(true));
  store.dispatch(setPlaceholder(msg));
  await awaitForClick(document.getElementById('puppy-input-form'));
  return store.getState().input.value;
};

export const getIsLive = () => store.getState().puppy.isLive;

export const showTimeLeapIcon = () =>
  new Promise(resolve => resolve(store.dispatch(setShowTLIcon(true))));

export const getDiffStartLineNumber = () => {
  const num = store.getState().editor.diffStartLineNumber;
  return num === null ? 0 : num;
};

export const setCodeHighlight = (startLineNum: number, endLineNum: number) => {
  const codeEditor = store.getState().editor.codeEditor!;
  const decoration = store.getState().editor.decoration;
  store.dispatch(
    setDecoration(
      codeEditor.deltaDecorations(decoration, [
        {
          range: new Range(startLineNum, 1, endLineNum, 1),
          options: { isWholeLine: true, className: 'code-highlight' },
        },
      ])
    )
  );
};

export const resetCodeHighlight = () => {
  const codeEditor = store.getState().editor.codeEditor!;
  const decoration = store.getState().editor.decoration;
  store.dispatch(setDecoration(codeEditor.deltaDecorations(decoration, [])));
};

export const fetchCourses = (
  dispatch: (action: ReduxActions) => void
) => (): void => {
  const courses: { [path: string]: CourseShape } = {};
  const get_course: Promise<void>[] = [];
  ['LIVE2019'].forEach(path => {
    get_course.push(
      loadFile(`${PATH_PREFIX}/course/${path}/setting.json`)
        .then((s: string) => {
          return JSON.parse(s);
        })
        .then((course: CourseShape) => {
          courses[path] = course;
        })
    );
  });
  Promise.all(get_course).then(() => dispatch(setCources(courses)));
  // fetch('/api/courses')
  //   .then((res: Response) => {
  //     if (res.ok) {
  //       return res.json();
  //     }
  //     throw new Error(res.statusText);
  //   })
  //   .then((json: { [path: string]: CourseShape }) => {
  //     dispatch(setCources(json));
  //   });
};
