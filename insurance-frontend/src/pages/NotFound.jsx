import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ghost, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-800/50 mb-8 border border-white/5"
                >
                    <Ghost className="w-12 h-12 text-primary-400" />
                </motion.div>

                <h1 className="text-7xl font-black text-white mb-4 tracking-tighter">404</h1>
                <p className="text-slate-400 text-xl mb-10 max-w-md mx-auto">
                    Oops! The page you're looking for has drifted into the void.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" /> Back Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" /> Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
