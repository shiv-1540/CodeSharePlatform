import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import feature3 from "../assets/filesharing.png";
import backgroundImage from "../assets/background.png";
import feature1 from "../assets/collaboration.png";
import feature2 from "../assets/management.png";
import { Link } from "react-router-dom";

const Landpage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      < Header />
      
      {/* Hero Section */}
      <section 
        className="relative w-full h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Collaborate. Code. Conquer.</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Build and manage coding projects with your team in real-time — from anywhere.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
              ➕ Create a Room
            </Link>
            <Link to="/demo" className="bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600">
              🎥 Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 px-6 md:px-10 bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-400">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl flex flex-col items-center text-center hover:scale-105 transition-all">
            <img src={feature1} alt="Feature 1" className="h-24 mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-blue-300">👥 Team Rooms with Real-Time Collaboration</h3>
            <p className="text-gray-300">Work together in a shared coding space with seamless collaboration.</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl flex flex-col items-center text-center hover:scale-105 transition-all">
            <img src={feature2} alt="Feature 2" className="h-24 mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-blue-300">📁 File Sharing & Project Organization</h3>
            <p className="text-gray-300">Share project files securely and organize your code efficiently.</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl flex flex-col items-center text-center hover:scale-105 transition-all">
            <img src={feature3} alt="Feature 3" className="h-24 mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-blue-300">✍ Shared Live Code Editor</h3>
            <p className="text-gray-300">Edit and debug your code live with your team in a single workspace.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landpage;