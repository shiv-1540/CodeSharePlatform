import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../../Actions.js';
import Client from './clients';
import Editor from '../CodeEditor/Editor.jsx';

import { initSocket } from '../../Socket.js';
import { Bot, X } from 'lucide-react';
import axios from 'axios';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

import AIHelpAssistant from './AIHelpAssistant.jsx';


const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [projectcode,setProcode]=useState();
    const [language,setLanguage]=useState("javascript");

    console.log("project room ka code1111111 ::",projectcode);
    const [isAssistantOpen, setAssistantOpen] = useState(false);


      useEffect(() => {
        if (location.state) {
          setProcode(location.state.room);
        }
      }, [location.state]);
    
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

   
    
    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/home');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }
    const handleSaveCode = async () => {
      const fileName = prompt("Enter file name (without extension):");
      if (!fileName) return;
      
      try {
        const res = await axios.post("http://localhost:3000/fileRoutes/saveCodeFile", {
          code: codeRef.current,
          fileName,
          language,      // from your code editor selection
          roomCode: projectcode,
        });
    
        if (res.status === 201) toast.success("Code saved to S3!");
      } catch (err) {
        console.error(err);
        toast.error("Error saving code");
      }
    };
    
    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/5 bg-zinc-900 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo-white.png" alt="logo" className="h-8" />
            <h3 className="text-xl font-semibold">CodeShare</h3>
          </div>
  
          <h4 className="text-sm text-gray-400 mb-2">Connected</h4>
  
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
  
          <div className="mt-4 space-y-2">
         
            <button onClick={handleSaveCode} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm" >
                Save Code 
            </button>
            <button
              onClick={copyRoomId}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded transition"
            >
              Copy ROOM ID
            </button>
            <button
              onClick={leaveRoom}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded transition"
            >
              Leave
            </button>
          </div>
        </aside>
  
        <main className="flex-1 h-full overflow-auto p-4 relative">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
  
          {/* AI Assistant button */}
          <button
            onClick={() => setAssistantOpen(!isAssistantOpen)}
            className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full shadow-lg"
          >
            {isAssistantOpen ? <X className="text-white" /> : <Bot className="text-white" />}
          </button>
  
          {/* AI Assistant Popup */}
          {isAssistantOpen && (
            <div className="fixed bottom-20 right-6 w-[400px] bg-zinc-800 rounded-lg shadow-xl p-4">
              <AIHelpAssistant selectedCode={codeRef.current} />
            </div>
          )}
        </main>
      </div>
      
    );
          
};

export default EditorPage;
