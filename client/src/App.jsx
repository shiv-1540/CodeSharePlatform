import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import LoginForm from './pages/Forms/LoginForm';
import RegistrationForm from './pages/Forms/RegistrationForm';
import HomePage from './pages/Home';
import CreateProjectPage from './pages/Project/CreateProjectPage';
import JoinProjectPage from './pages/Project/JoinProjectPage';
import ProjectRoomPage from './pages/Project/ProjectRoomPage';

import { Toaster } from 'react-hot-toast';
import EditorPage from './pages/CodeRoom/EditorPage';
import CodeHome from './pages/CodeRoom/CodeHome';
import './App.css'
import UploadFilePage from './components/UploadFilePage';
import Landpage from './pages/Landpage';


const routes = createBrowserRouter([
    { path: '/', element: <Landpage /> },
    { path: '/login', element: <LoginForm /> },
    { path: '/registration', element: <RegistrationForm /> },
    { path: '/home', element: <HomePage /> },
    { path: '/createProject', element: <CreateProjectPage /> },
    { path: '/joinProject', element: <JoinProjectPage /> },
    { path: '/projectRoom/:roomCode', element: <ProjectRoomPage /> },
    { path:'/uploadFilePage',element: <UploadFilePage/>},
    
    { path: '/home1', element: <CodeHome /> },
    { path:'/editor/:roomId' ,element: <EditorPage/>},
]);

const App = () => (
    <>
        <Toaster position="top-center" />
        <AuthProvider>
            <RouterProvider router={routes} />
        </AuthProvider>
    </>
);

export default App;
