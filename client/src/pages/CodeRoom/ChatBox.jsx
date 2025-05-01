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

return ( 
<div className="flex flex-col h-[450px] border border-gray-700 bg-zinc-900 rounded-lg p-4 shadow-md">
  {/* Chat Messages */}
  <div className="flex-1 overflow-y-auto mb-3 space-y-3 p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
    {messages.map((m, idx) => (
      <div key={idx} className={`flex ${m.sender === "You" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[75%] p-3 rounded-lg text-sm ${m.sender === "You" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"} shadow-md`}>
          <strong className="text-teal-300 block">{m.sender}</strong>
          <p>{m.message}</p>
        </div>
      </div>
    ))}
    <div ref={bottomRef} />
  </div>

  {/* Chat Input */}
  <div className="flex gap-2 items-center">
    <input
      value={msg}
      onChange={(e) => setMsg(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Type your message..."
      className="flex-1 p-3 rounded-lg bg-gray-900 text-white outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={sendMessage}
      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-all duration-200"
    >
      Send
    </button>
  </div>
</div>

      
  ); }

