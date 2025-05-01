import React, { useState,useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import { Box, HStack } from "@chakra-ui/react";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../../Actions';
import Output from "./Output";
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from './constants';


const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const [language, setLanguage] = useState("javascript");
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

      // Update language and code snippet when language changes
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const newSnippet = CODE_SNIPPETS[lang] ;
    setValue(newSnippet);
    editorRef.current?.setValue(newSnippet);
  };



    return(
        <div className="p-4 bg-black text-white min-h-screen"> 
          <div className="flex flex-col md:flex-row gap-6">
             {/* Left: Editor + Language + Save */}
              <div className="w-full md:w-1/2">
               {/* Language selector and Save button side-by-side */} 
               <div className="flex items-center justify-between mb-3">
                 <LanguageSelector language={language} onSelect={handleLanguageChange} />
                  
                </div>
        {/* Code editor */}
  <textarea
    id="realtimeEditor"
    className="w-full h-[75vh] bg-zinc-900 text-white p-4 rounded-md font-mono resize-none focus:outline-none border border-zinc-700"
  ></textarea>
</div>

{/* Right: Output panel */}
<div className="w-full md:w-1/2">
  <Output editorRef={editorRef} language={language} />
</div>
</div> </div>
        
    ); 
};

export default Editor;
