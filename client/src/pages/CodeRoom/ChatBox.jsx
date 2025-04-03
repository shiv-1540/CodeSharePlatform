import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'; 
import axios from 'axios';
const api = import.meta.env.VITE_API_URL;

export default function GroupChat({ username, roomCode }) {
     const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState(''); const socketRef = useRef(null); const bottomRef = useRef();

useEffect(() => { // Connect and join room 
 socketRef.current = io(api); 
 socketRef.current.emit('join-room', { roomCode, username });

// Load previous messages
axios.get(`${api}/groupRoutes/chat/${roomCode}`).then((res) => {
  setMessages(res.data);
});

// Listen for new messages
socketRef.current.on('group-message', (data) => {
  setMessages((prev) => [...prev, data]);
});

return () => {
  socketRef.current.disconnect();
};
}, [roomCode, username]);

useEffect(() => {
   bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

const sendMessage = () => { 
  if (!msg.trim()) return; 
  
  const messageData = { roomCode, sender: username, message: msg }; 
  socketRef.current.emit('group-message', messageData); 
  setMsg(''); 
};

return ( <div className="flex flex-col h-[400px] border border-gray-600 bg-zinc-800 rounded p-3"> 
<div className="flex-1 overflow-y-auto mb-2 space-y-2"> 
       {messages.map((m, idx) => ( 
           <div key={idx} className="text-sm"> 
              <strong className="text-teal-400">{m.sender}:</strong>
                 {m.message}
         </div> 
         
        )
      )} 
      <div ref={bottomRef} /> 
        </div> 
        <div className="flex gap-2"> 
          <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type message..." className="flex-1 p-2 rounded bg-zinc-700 text-white outline-none" /> 
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm" > 
            Send
         </button>
       </div> 
       </div> 
      ); }

