import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/Toast';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-zinc-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-200 bg-white py-3 text-center text-xs text-zinc-400 font-mono">
        TUCKIT Physical Locker Operations Console • v2.4.0 • Connected Node: AWS IoT AP-South-1
      </footer>
      <ToastContainer />
    </div>
  );
};
