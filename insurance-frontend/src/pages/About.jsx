import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Award } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent">
                        About InsureX
                    </h1>
                    <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                        We are dedicated to providing the most advanced, transparent, and user-friendly insurance management system in the industry.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {[
                        { icon: Shield, title: "Secure", desc: "Enterprise-grade security for your sensitive data." },
                        { icon: Users, title: "User-Centric", desc: "Designed with our customers and agents in mind." },
                        { icon: Target, title: "Efficient", desc: "Streamlined workflows for faster claim processing." },
                        { icon: Award, title: "Reliable", desc: "24/7 system availability and dedicated support." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700 text-center hover:border-primary-500/50 transition-colors"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 mb-4">
                                <item.icon className="text-primary-400 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-slate-800/20 rounded-3xl p-8 md:p-12 border border-slate-700/50">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Our mission is to democratize access to insurance management tools, enabling agents to serve their customers better and giving customers complete control over their financial protection.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                By leveraging modern technology and a customer-first approach, we're building the future of insurance, today.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-video bg-gradient-to-br from-primary-600/20 to-blue-600/20 rounded-2xl border border-white/10 flex items-center justify-center">
                                <Shield className="w-24 h-24 text-primary-500/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
