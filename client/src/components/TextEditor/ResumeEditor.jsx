import { useCallback } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import './ResumeEditor.css'
import './fonts/fonts.css'
import { fonts } from "./fonts/fonts"

const Font = Quill.import('formats/font');
Font.whitelist = fonts;
Quill.register(Font, true);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: fonts }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];


export default function TextEditor() {
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      }
    });
  }, []);

  return (
    <>
      <div id='resume-editor-container' ref={wrapperRef}></div>
    </>
  )
}