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
      <Header />

      {/* Hero Section */}
      <section
        className="relative w-full h-[600px] bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70 flex flex-col items-center justify-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center mb-4 drop-shadow-lg">
            <span className="text-blue-400">Collaborate</span>. <span className="text-purple-400">Code</span>. <span className="text-pink-400">Conquer</span>.
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-gray-300 text-center mb-8">
            Build and manage coding projects with your team in real-time — from anywhere, anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300"
            >
              ➕ Create a Room
            </Link>
            <Link
              to="/demo"
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300"
            >
              🎥 Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-16 bg-gray-800">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          What Makes CodeShare Powerful?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature Card 1 */}
          <div className="bg-gray-700/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 text-center">
            <img src={feature1} alt="Collaboration" className="h-24 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-blue-300 mb-3">👥 Real-Time Team Collaboration</h3>
            <p className="text-gray-300">Work seamlessly with your teammates in real-time with synced coding environments.</p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-gray-700/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 text-center">
            <img src={feature2} alt="Management" className="h-24 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-purple-300 mb-3">📁 Structured Project Management</h3>
            <p className="text-gray-300">Manage files, team roles, and tasks all within a single shared platform.</p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-gray-700/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 text-center">
            <img src={feature3} alt="File Sharing" className="h-24 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-pink-300 mb-3">✍ Live Code Editing & Sharing</h3>
            <p className="text-gray-300">Write, edit, and share code live — with instant previews and version safety.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landpage;
