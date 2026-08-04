"use client";

import React from "react";

// Helper component to render the tech icons
const TechIcon = ({ name }: { name: string }) => {
    const iconMap: Record<string, { src: string; invertInDark?: boolean }> = {
        html: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        css: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        js: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        react: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        node: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        mongo: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        nextjs: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invertInDark: true },
        tailwind: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
        express: { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invertInDark: true },
    };

    const icon = iconMap[name];

    if (!icon) {
        // Fallback for icons not in devicon (like OpenAI or Expo) - renders a sleek dark placeholder
        return (
            <div className="w-6 h-6 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
                {name.slice(0, 2)}
            </div>
        );
    }

    return (
        <img
            src={icon.src}
            alt={`${name} icon`}
            className={`w-6 h-6 object-contain ${icon.invertInDark ? "invert opacity-90" : ""}`}
        />
    );
};

export default function WhatIDoSection() {
    const services = [
        {
            title: "Full Stack Web Development",
            icons: ["html", "css", "js", "react", "node", "mongo"],
            items: [
                "Building responsive frontends with React & modern UI libraries (MUI, Radix, shadcn)",
                "Scalable backend APIs with Node.js, Express, and PostgreSQL / MongoDB",
                "JWT & session-based authentication, role-based access control",
            ],
        },
        {
            title: "Next.js & React Development",
            icons: ["nextjs", "node", "js", "react", "tailwind", "express"],
            items: [
                "High-performance SSR / RSC applications with Next.js App Router",
                "SEO-optimized pages with structured data, Core Web Vitals, and dynamic OG images",
                "Full-stack API routes with Prisma ORM and PostgreSQL",
            ],
        },
        {
            title: "AI Automation & Integration",
            icons: ["ai", "nextjs", "js", "js", "react"], // 'ai' uses fallback badge
            items: [
                "Integrating OpenAI GPT-4o & Anthropic Claude APIs into web applications",
                "Building n8n & Make.com automation workflows to eliminate repetitive tasks",
                "Designing RAG (Retrieval-Augmented Generation) pipelines with vector search",
            ],
        },
        {
            title: "UI & UX Implementation",
            icons: ["html", "css"],
            items: [
                "Pixel-perfect UI from Figma designs with Tailwind CSS and shadcn/ui",
                "Accessible, keyboard-navigable components following WCAG 2.1 guidelines",
                "Smooth animations and micro-interactions for delightful user experiences",
            ],
        },
        {
            title: "Performance & SEO",
            icons: ["nextjs", "css"],
            items: [
                "Core Web Vitals optimization: LCP, FID, CLS targeting 90+ Lighthouse score",
                "Structured data (JSON-LD), dynamic OG images, sitemap, and robots.txt",
                "GA4 / GTM integration, conversion tracking, and performance monitoring",
            ],
        },
        {
            title: "Mobile App Development",
            icons: ["react", "ex"], // 'ex' for Expo fallback badge
            items: [
                "Cross-platform iOS & Android apps with React Native and Expo",
                "Native device APIs: camera, push notifications, offline storage",
                "App Store & Google Play deployment with CI/CD pipelines",
            ],
        },
    ];

    return (
        <section className="w-full bg-[#0a0a0a] py-8">
            <div className="max-w-7xl mx-auto px-3 md:*:px-0">

                <h2 className="md:text-3xl text-xl font-extrabold text-white tracking-tight mb-6 ">
                    What I'm doing
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group bg-[#111113] rounded-[24px] border border-neutral-800/60 p-6 sm:p-8 hover:border-neutral-700 hover:bg-[#151518] transition-all duration-300 shadow-sm hover:shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                {service.title}
                            </h3>

                            <div className="flex items-center gap-3 mb-6">
                                {service.icons.map((iconName, idx) => (
                                    <TechIcon key={idx} name={iconName} />
                                ))}
                            </div>

                            <ul className="space-y-2">
                                {service.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-[6px] w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                        <span className="text-neutral-400 text-sm leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}