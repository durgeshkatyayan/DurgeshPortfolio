"use client";

import { motion } from "motion/react";
import { Activity } from "lucide-react";

export default function CodingAnalytics() {
    return (
        <section>
            <div className="flex items-center gap-3 mb-5">
                <Activity className="text-cyan-500" size={28} />
                <h2 className="text-2xl font-bold">Coding Analytics</h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative overflow-hidden rounded-2xl bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60 p-4 hover:bg-neutral-900/80 transition-colors duration-500 shadow-sm hover:shadow-md"
                >
                    {/* Subtle Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition duration-700 ease-out" />

                    <h3 className="mb-6 mt-2 text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                        Weekly Coding Activity
                    </h3>

                    <div className="relative w-full rounded-xl overflow-hidden bg-[#161618]  border border-neutral-800/50">
                        <img
                            src="https://wakatime.com/share/@kaniskkatyayan/2170336c-b43a-441f-8ef7-538268f04ff2.svg"
                            alt="Weekly Coding Activity"
                            className="w-full h-auto  transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                    </div>
                </motion.div>

                {/* Languages Used Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                    className="group relative overflow-hidden rounded-2xl bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60 p-4 hover:bg-neutral-900/80 transition-colors duration-500 shadow-sm hover:shadow-md"
                >
                    {/* Subtle Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-700 ease-out" />

                    <h3 className="mb-6 mt-2 text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
                        Languages Used
                    </h3>

                    <div className="relative rounded-xl overflow-hidden bg-[#161618]border border-neutral-800/50">
                        <img
                            src="https://wakatime.com/share/@kaniskkatyayan/a2c448f9-a48b-4b06-b677-a3148fc668b0.svg"
                            alt="Languages Used"
                            className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}