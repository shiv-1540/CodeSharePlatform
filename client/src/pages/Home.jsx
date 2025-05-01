import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { Button } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import { Select } from "@chakra-ui/react";
import ProjectCard from "../components/ProjectCard";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // AuthContext import
import defaultProfile from "../assets/ProfileImages/avtaar.jpg";
import logo from "../../public/logo-white.png";
import { toast } from "react-hot-toast";
const api = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [projectRooms, setProjectRooms] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [userProfilePic, setProfilePic] = useState(defaultProfile);
  const { authData, logout } = useContext(AuthContext);

  const handleDeleteRoom = async (roomCode) => {
    try {
      const res = await axios.delete(`${api}/projectRoom/delete/${roomCode}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      alert(res.data.message);
    
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting room");
    }
  };

  // Fetch project rooms when the component mounts
  useEffect(() => {
    if (!authData?.token) {
      navigate("/"); // Redirect to login if token is missing
      return;
    }

    axios
      .get(`${api}/projectRoom/getProjectRooms`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setProjectRooms(response.data.projectRooms);
          setUserInfo(response.data.userInfo);
          setProfilePic(
            userInfo.profilePic
              ? require(`../assets/ProfileImages/${response.data.userInfo.profilePic}`)
              : defaultProfile
          );
        } 
        else {
          alert("No Data currently");
        }
        
      })
      .catch((error) => {
        console.error("Error fetching project rooms:", error);
        // alert("Error fetching project rooms: " + error.message);
      });
  }, [authData, navigate]);

   const handleLogout=()=>{
    logout();
    navigate('/');
    toast.success("Logged Out Sucessfully !")
   }
   console.log("Hiii auth ka data:" ,authData);
  return (
    <main id="home-main-container" className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row"> 
    {/* Sidebar Profile */} 
      <aside id="profile-container" className="bg-gray-800 mx-20px w-full md:w-1/5 p-6 flex flex-col items-center border-r border-gray-700"> 
      {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
           <img src={logo} alt="logo-dark" className="h-12 border-r border-gray-500 pr-3" />
           <p className="text-lg font-semibold text-gray-200">Code Share</p> </div>
   
    {/* Profile */}
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-teal-500">
        <img src={userProfilePic} alt="profile" className="object-cover w-full h-full" />
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold">@{authData.username}</h1>
        <p className="text-sm text-gray-400">{userInfo.email}</p>
      </div>
    </div>
    
    {/* Logout Button */}
    <Button
      rightIcon={<MdLogout />}
      colorScheme="teal"
      size="md"
      className="w-full"
      onClick={handleLogout}
    >
      Logout
    </Button>
    </aside>
    {/* Main Content */}
    
    <section id="main-content" className="flex-1 p-6">
       {/* Welcome Header */} 
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
         <h1 className="text-2xl font-bold mb-2 md:mb-0"> Welcome Back, <span className="text-teal-400">{authData.username}</span> </h1>
         <div className="flex gap-4"> 
            <Button leftIcon={<IoIosCreate />} colorScheme="green" onClick={() => navigate('/createProject')} > 
              Create
           </Button>
           <Button leftIcon={<IoMdAddCircle />} colorScheme="red" onClick={() => navigate('/joinProject')} > 
              Join 
            </Button> 
          </div>
       </div>

    {/* Filters */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <InputGroup size="md" className="w-full md:w-1/3">
        <InputLeftElement pointerEvents="none">
          <IoSearch className="text-gray-400" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search Project"
          aria-label="Search projects"
          className="bg-white text-black rounded"
        />
      </InputGroup>
    
      <Select
        placeholder="Select Domain"
        className="w-full md:w-1/6 bg-black text-white rounded"
      >
        <option value="web development">Web Development</option>
        <option value="java development">Java Development</option>
        <option value="data science">Data Science</option>
        <option value="ai & ml">AI & ML</option>
      </Select>
    </div>
    
    {/* Projects Grid */}
    <div id="projects-card-box" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectRooms.map((room) => (
        <ProjectCard
          key={room._id}
          room={room}
          onDeleteRequest={handleDeleteRoom}
        />
      ))}
    </div>
    </section> 
    
    </main>
  );
};

export default Home;
