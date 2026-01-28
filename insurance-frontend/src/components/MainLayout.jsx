import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[#0f172a]">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-20 p-8">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
