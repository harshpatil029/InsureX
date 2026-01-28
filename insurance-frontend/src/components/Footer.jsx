import React from 'react';

const Footer = () => {
    return (
        <footer className="py-8 bg-[#0f172a] border-t border-slate-800 ml-64 px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-slate-500 text-sm">
                    © 2026 InsureX Systems. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm text-slate-400">
                    <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-primary-400 transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
