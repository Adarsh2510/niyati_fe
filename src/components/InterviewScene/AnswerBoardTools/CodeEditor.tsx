import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { langs } from '@uiw/codemirror-extensions-langs';
import { useSetAtom } from 'jotai';
import { userCodeResponseAtom } from './atoms';

export default function CodeEditor({placeholder}: {placeholder: string}) {
    const setAnswer = useSetAtom(userCodeResponseAtom);
    const onChange = (value: string) => {
        setAnswer(value.replace(placeholder, ''));
    }


    return (
        <CodeMirror value={placeholder} height="44rem" theme={vscodeDark} extensions={[langs.javascript()]} onChange={onChange}/>
    )
}