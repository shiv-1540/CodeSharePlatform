import React, { useState, useEffect, useContext } from 'react';
import { Button, Select, CloseButton } from '@chakra-ui/react';
import { DiJavascript } from 'react-icons/di';
import { SiGoogledocs, SiCss3 } from 'react-icons/si';
import { FaFilePdf, FaImage, FaHtml5 } from 'react-icons/fa';
import { HiUpload } from 'react-icons/hi';
import { IoMdAdd } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import nofiles from '../../assets/no-files.png';
import { toast } from 'react-hot-toast';
import FileUploadModal from '../../components/UploadFilePage';
import GroupChat from '../CodeRoom/ChatBox';
const api = import.meta.env.VITE_API_URL;

const ProjectRoomPage = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [projectRoomData, setProjectRoomData] = useState({});
  const [members, setProjectRoomMembersData] = useState([]);
  const { authData } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  // const [deleteFile, initiateDelete] = useState(false);
  const [fileId, setFileId] = useState(0);
  const [fileType, setSelectedFileType] = useState('all');
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [codefiles,setCodeFiles]=useState([]);

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  

  // View file in a new tab
  const viewFile = (file_url) => {
    window.open(file_url, "_blank");
  };

  // Download file
  const downloadFile = async (file_url, filename) => {
    const response = await fetch(file_url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || file_url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };
  
  
  

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "application/pdf":
        return <FaFilePdf size="2.6rem" color="#f1f1f1" />;
      case "text/html":
        return <FaHtml5 size="2.6rem" color="#f1f1f1" />;
      case "image/png":
        return <FaImage size="2.6rem" color="#f1f1f1" />;
      case "image/jgp":
        return <FaImage size="2.6rem" color="#f1f1f1" />;
      case "text/css":
        return <SiCss3 size="2.6rem" color="#f1f1f1" />;
      case "application/doc":
        return <SiGoogledocs size="2.6rem" color="#f1f1f1" />;
      case "text/javascript":
        return <DiJavascript size="2.6rem" color="#f1f1f1" />;
      default:
        return <SiGoogledocs size="2.6rem" color="#f1f1f1" />; // Default icon
    }
  };


  const deleteData = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteFile/${fileId}`
      );
      console.log(response.data);
      toast.success("File deleted successfully");

      // After deletion, refetch files
      const updatedFiles = await axios.get(
        `http://localhost:3000/fileRoutes/getAllDat`
      );
      setFiles(updatedFiles.data); // Update the state with the new list of files
    } catch (error) {
      console.error(error);
      toast.error("Error deleting file");
    } finally {
      // Reset deleteFile and fileId states after the deletion is done
      initiateDelete(false);
      setFileId(0);
    }
  };

  const deleteFile= async (fileId) => {
    try {
      const response = await axios.delete(
        `${api}/fileRoutes/deleteFile/${fileId}`
      );
      console.log(response.data);
      toast.success("File deleted successfully");

      fetchFiles();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting file");
    } finally {
      // Reset deleteFile and fileId states after the deletion is done
      initiateDelete(false);
      setFileId(0);
    }
  };

  // // Delete file useEffect
  // useEffect(() => {
  //   if (deleteFile) {
  //     const deleteData = async () => {
  //       try {
  //         const response = await axios.delete(
  //           `http://localhost:3000/fileRoutes/deleteFile/${fileId}`
  //         );
  //         console.log(response.data);
  //         toast.success("File deleted successfully");

  //         fetchFiles();
  //       } catch (error) {
  //         console.error(error);
  //         toast.error("Error deleting file");
  //       } finally {
  //         // Reset deleteFile and fileId states after the deletion is done
  //         initiateDelete(false);
  //         setFileId(0);
  //       }
  //     };

  //     deleteData(); // Call deleteData function
  //   }
  // }, [deleteFile, fileId]); // Dependency on deleteFile and fileId

  const fetchCodeFiles = async () => {
    try {
      const res = await axios.get(`${api}/fileRoutes/getCodeFiles/${roomCode}`);
      setCodeFiles(res.data); // create state codeFiles = []
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetchCodeFiles = async () => {
      try {
        const res = await axios.get(`${api}/fileRoutes/getCodeFiles/${roomCode}`);
        setCodeFiles(res.data); // create state codeFiles = []
      } catch (err) {
        console.error(err);
      }
    };
    fetchCodeFiles();
  }, []);
  
  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `${api}/fileRoutes/getRoomFiles/${roomCode}`
      );
      setFiles(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching files");
    }
  };



  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `${api}/fileRoutes/getRoomFiles/${roomCode}`
        );
        setFiles(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching files");
      }
    };
    fetchFiles();
  }, []);

  // function to copy roomcode
  const copyRoomCode = () => {
    navigator.clipboard
      .writeText(roomCode)
      .then(() => {
        toast.success("Room code copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy room code!");
      });
  };

  useEffect(() => {
    if (!authData?.token) {
      navigate("/");
      return;
    }

    axios
      .get(
        `${api}/projectRoom/getProjectRoomDetail/${roomCode}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setProjectRoomData(response.data.projectDetails);
          setProjectRoomMembersData(response.data.membersInfo || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching project room details:", error);
      });
  }, [authData, navigate, roomCode]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
  {/* Header */}
  <header className="mb-6 flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-semibold">{projectRoomData.title}</h1>
      <p className="text-gray-400">{projectRoomData.projectDomain}</p>
    </div>
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() =>
          navigate('/home1', {
            state: { username: authData.username, room: roomCode },
          })
        }
      >
        Open Editor
      </Button>
      <Button colorScheme="teal" size="sm" onClick={copyRoomCode}>
        Copy Room Code
      </Button>
      <CloseButton onClick={() => navigate('/home')} />
    </div>
  </header>

  {/* Main content */}
  <main className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
    {/* Members Section */}
    <section className="md:w-1/4 bg-gray-800 p-4 rounded-lg overflow-auto">
      <h2 className="font-semibold mb-4">Members</h2>
      {members.map((member) => (
        <div
          key={member._id}
          className="mb-3 p-2 bg-gray-700 rounded flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium">{member.name}</h3>
            <p className="text-xs text-gray-400">{member.email}</p>
          </div>
          <Button size="xs">Remove</Button>
        </div>
      ))}
    </section>

    {/* Files Section */}
    <section className="flex-1 bg-gray-800 p-4 rounded-lg overflow-auto">
      {/* Section Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">📁 Files</h2>
          <div className="flex flex-wrap gap-2">
            <Select
              placeholder="File Type"
              size="sm"
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="doc">Doc</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
            </Select>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded flex items-center gap-1"
              leftIcon={<IoMdAdd />}
            >
              Create
            </Button>
            <Button
              size="sm"
              onClick={() => setUploadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded flex items-center gap-1"
              leftIcon={<HiUpload />}
            >
              Upload File
            </Button>
          </div>
        </div>
        <hr className="border-gray-700" />
      </div>

      {/* File List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.length === 0 ? (
          <div className="col-span-full flex flex-col items-center text-center">
            <img src={nofiles} className="w-32 mb-2" alt="No files" />
            <p>No files shared yet</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-gray-700 rounded p-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                {getFileIcon(file.file_type)}
                <span>{file.file_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="xs" colorScheme="blue" onClick={() => viewFile(file.file_url)}>
                  View
                </Button>
                <Button size="xs" colorScheme="green" onClick={() => downloadFile(file.file_url, file.file_name)}>
                  Download
                </Button>
                <Button size="xs" colorScheme="red" onClick={() => deleteFile(file._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Saved Code Files */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">📝 Saved Code Files</h3>
        <ul className="space-y-2">
          {codefiles.map((file) => (
            <li
              key={file._id}
              className="bg-zinc-700 p-3 rounded flex justify-between items-center"
            >
              <span>{file.file_name}</span>
              <button
                className="text-sm bg-indigo-500 hover:bg-indigo-600 px-2 py-1 rounded"
                onClick={() => viewFile(file.file_url)}
              >
                View
              </button>
              <Button size="xs" colorScheme="green" onClick={() => downloadFile(file.file_url, file.file_name)}>
                  Download
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <GroupChat username={authData.username} roomCode={roomCode} />

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadOpen}
        roomCode={roomCode}
        onClose={() => setUploadOpen(false)}
        onFileUploaded={fetchFiles}
      />
    </section>
  </main>
</div>

  );
};

export default ProjectRoomPage;