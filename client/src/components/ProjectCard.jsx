import React, { useState } from "react";
// import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { MdEditDocument } from "react-icons/md";
import "./ProjectCard.css";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ room }) => {
  // Accept room prop
  const [showModal, setShowModal] = useState(false);
  const [inputText, setInputText] = useState("");
  

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setIsDeleteEnabled(value.toLowerCase() === "delete");
  };

  const handleDeleteConfirmation = () => {
    if (isDeleteEnabled) {
      // Add your delete logic here
      console.log("Item Deleted");
      handleCloseModal(); // Close modal after deletion
    }
  };

  return (
     <div className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-700 flex flex-col justify-between h-full"> 
        {/* Title and Description */}
         <div className="mb-7"> 
            <h1 className="text-xl font-semibold text-white">{room.title}</h1> 
            <p className="text-gray-400 text-sm mt-3 line-clamp-3">{room.description}</p>
         </div>     
        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-auto">
            <button
              onClick={() => navigate(`/projectRoom/${room.roomCode}`)}
              className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-sm text-white font-medium transition"
            >
              Enter
            </button>
      
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Edit coming soon!')}
              className="p-2 rounded hover:bg-zinc-700 transition text-white"
              title="Edit Project"
            >
               <MdEditDocument size={20} />
            </button>
            <button
              onClick={() => onDeleteRequest(room._id)}
              className="p-2 rounded hover:bg-red-600 transition text-white"
              title="Delete Project"
            >
              <AiFillDelete size={20} />
            </button>
          </div>
        </div>
      </div>
      
  );
};

export default ProjectCard;
