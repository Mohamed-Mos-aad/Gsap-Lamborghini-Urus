'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const DURATION = 23;

export default function LamborghiniVideoScrollytelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useGSAP(
        () => {
            const video = videoRef.current;
            if (!video) return;

            const setup = () => {
                video.pause();
                video.currentTime = 0;


                const state = { time: 0 };
                let lastTime = -1;


                video.currentTime = 0;

                const tl = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=4000',
                        scrub: 0.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                tl.to(
                    state,
                    {
                        time: video.duration || DURATION,
                        duration: DURATION,
                        onUpdate: () => {
                            if (Math.abs(state.time - lastTime) >= 1 / 30) {
                                video.currentTime = state.time;
                                lastTime = state.time;
                            }
                        },
                    },
                    0
                );

                tl.fromTo('.text-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 2)
                    .to('.text-1', { opacity: 0, y: -40, duration: 1 }, 6);

                tl.fromTo('.text-2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 9)
                    .to('.text-2', { opacity: 0, y: -40, duration: 1 }, 15);

                tl.fromTo('.text-3', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 18)
                    .to('.text-3', { opacity: 0, y: -40, duration: 1 }, 22);
            };

            if (video.readyState >= 1 && !isNaN(video.duration)) {
                setup();
            } else {
                video.onloadedmetadata = () => {
                    video.pause();
                    video.currentTime = 0;
                    setup();
                };
                video.load();
            }

            return () => {
                if (video) video.onloadedmetadata = null;
            };
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
            <video
                ref={videoRef}
                src="/scrub_mid.mp4"
                className="w-full h-full object-cover pointer-events-none"
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-label="Lamborghini Scrollytelling Video"
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-1 absolute text-white text-4xl md:text-7xl font-bold tracking-wider uppercase text-center opacity-0">
                    Unleash the Beast
                </h1>
                <h2 className="text-2 absolute text-white text-3xl md:text-6xl font-bold tracking-wider uppercase opacity-0 text-center px-6">
                    Twin-Turbo V8 Power &amp; Agility
                </h2>
                <h2 className="text-3 absolute text-white text-4xl md:text-7xl font-bold tracking-wider uppercase opacity-0 text-center px-6">
                    Redefining Performance
                </h2>
            </div>
        </div>
    );
}