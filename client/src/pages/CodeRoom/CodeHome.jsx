import React, { useState,useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import {useLocation, useNavigate } from 'react-router-dom';
import logo from "../../../public/logo-white.png";


const CodeHome = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const location = useLocation(); // ✅ get passed state
  const [room,setProcode]=useState();

  useEffect(() => {
    if (location.state) {
      setProcode(location.state.room);
      setUsername(location.state.username);
      console.log("project room ka username ::", location.state.username);
    }
  }, [location.state]);

 console.log("project room ka code ::",location.state.room);
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('ROOM ID & username is required');
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: { username ,room},
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') joinRoom();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="bg-zinc-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="logo" className="h-12" />
          <p className="text-2xl font-semibold text-white">Code Share</p>
        </div>

        <h4 className="text-lg font-medium mb-4">Paste invitation ROOM ID</h4>

        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="w-full p-3 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button
            onClick={joinRoom}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition"
          >
            Join
          </button>
          <p className="text-sm text-gray-300 text-center">
            If you don't have an invite then create&nbsp;
            <a
              href="#"
              onClick={createNewRoom}
              className="text-indigo-400 hover:underline"
            >
              a new room
            </a>
          </p>
        </div>
      </div>

      <footer className="mt-6 text-sm text-gray-400 text-center">
        Built with 💛 by&nbsp;
        <a
          href="https://github.com/shiv-1540"
          className="text-indigo-400 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          CodeShare
        </a>
      </footer>
    </div>
  );
};

export default CodeHome;
