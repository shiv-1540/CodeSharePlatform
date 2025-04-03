import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FileUploadModal = ({ isOpen, onClose, roomCode, onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file-upload', file);
    formData.append('title', title);
    formData.append('roomCode', roomCode);

    try {
      await axios.post('http://localhost:3000/fileRoutes/uploadFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded successfully!');
      onFileUploaded(); // Refresh files after upload
      onClose(); // close modal
    } catch (error) {
      toast.error('Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
       <h2 className='text-gray-900 font-bold'>Upload File</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖️
        </button>
        <h2 className="text-xl font-bold mb-4">Upload a File</h2>
        <input
          type="text"
          placeholder="File title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border  text-gray-900 rounded p-2 mb-3"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border text-gray-900 rounded p-2 mb-3"
        />
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-blue-600 text-gray-900 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
};

export default FileUploadModal;
