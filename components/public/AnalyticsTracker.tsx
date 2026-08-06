"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { UAParser } from "ua-parser-js";

// SAFE ID GENERATOR: Prevents iPhone/Safari crashes when testing on local HTTP networks
const generateSafeId = () => {
    try {
        return crypto.randomUUID();
    } catch (e) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
};

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const trackingData = useRef({
        pageViewId: "",
        startTime: 0,
        maxScroll: 0,
        clicks: [] as string[],
        hasInteracted: false,
    });

    useEffect(() => {
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
            visitorId = generateSafeId();
            localStorage.setItem("visitor_id", visitorId);
        }

        const pageViewId = generateSafeId();
        
        trackingData.current = {
            pageViewId,
            startTime: Date.now(),
            maxScroll: 0,
            clicks: [],
            hasInteracted: false,
        };

        const initializeTracking = async () => {
            const Parser = UAParser as unknown as {
                new(): {
                    getResult(): {
                        browser: { name?: string; version?: string };
                        os: { name?: string; version?: string };
                        device: { type?: string };
                    };
                };
            };
            
            const parser = new Parser();
            const result = parser.getResult();
            
            let osName = result.os.name;
            let osVersion = result.os.version;
            let deviceType = result.device.type;

            // WINDOWS 11 FIX: Bypass standard User-Agent freeze
            if ((navigator as any).userAgentData && (navigator as any).userAgentData.getHighEntropyValues) {
                try {
                    const ua = await (navigator as any).userAgentData.getHighEntropyValues(["platformVersion"]);
                    if ((navigator as any).userAgentData.platform === "Windows") {
                        const majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
                        if (majorPlatformVersion >= 13) {
                            osVersion = "11";
                        }
                    }
                } catch (error) {
                    console.warn("Client Hints API failed for OS.");
                }
            }

            // ADVANCED MOBILE DETECTION FIX
            if (!deviceType) {
                // Check 1: Client Hints API (Very reliable on modern Android/Chrome)
                if ((navigator as any).userAgentData && (navigator as any).userAgentData.mobile !== undefined) {
                    deviceType = (navigator as any).userAgentData.mobile ? "mobile" : "desktop";
                } 
                // Check 2: Raw User-Agent Regex Fallback (Catches iPhones and older devices)
                else {
                    const rawUA = navigator.userAgent;
                    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(rawUA)) {
                        deviceType = "mobile";
                    } else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(rawUA)) {
                        deviceType = "tablet";
                    } else {
                        deviceType = "desktop";
                    }
                }
            }

            // 3. Send initial page load data to DB
            fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId,
                    pageViewId,
                    path: pathname,
                    referrer: document.referrer,
                    browser: `${result.browser.name} ${result.browser.version}`,
                    os: `${osName} ${osVersion}`,
                    device: deviceType, // Now uses our bulletproof detection
                }),
            });
        };

        initializeTracking();

        // 4. Setup Event Listeners (Scroll & Click)
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

            if (scrollPercent > trackingData.current.maxScroll) {
                trackingData.current.maxScroll = scrollPercent;
            }
            trackingData.current.hasInteracted = true;
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const elementIdentifier = `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}`;

            if (trackingData.current.clicks.length < 50) { 
                trackingData.current.clicks.push(elementIdentifier);
            }
            trackingData.current.hasInteracted = true;
        };

        // Send update payload using fetch with keepalive when leaving
        const sendUpdate = () => {
            const duration = Math.round((Date.now() - trackingData.current.startTime) / 1000);
            const isBounce = duration < 10 && !trackingData.current.hasInteracted;

            const payload = {
                pageViewId: trackingData.current.pageViewId,
                duration,
                scrollDepth: trackingData.current.maxScroll,
                clicks: trackingData.current.clicks,
                isBounce,
            };

            fetch("/api/track", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                sendUpdate();
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("click", handleClick, { passive: true });
        window.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            sendUpdate();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("click", handleClick);
            window.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [pathname]);

    return null;
}