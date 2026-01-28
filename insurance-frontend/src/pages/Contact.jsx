import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent">
                        Get in Touch
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                    <Mail className="text-primary-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email Us</h3>
                                    <p className="text-slate-400 text-sm">support@insurex.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Phone className="text-blue-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Call Us</h3>
                                    <p className="text-slate-400 text-sm">+1 (555) 000-0000</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <MapPin className="text-purple-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Visit Us</h3>
                                    <p className="text-slate-400 text-sm">123 Tech Avenue, Silicon Valley</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Your Name</label>
                                        <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                                        <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Subject</label>
                                    <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="How can we help?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Message</label>
                                    <textarea rows="4" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none" placeholder="Write your message here..."></textarea>
                                </div>
                                <button className="w-full py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                                    Send Message <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
