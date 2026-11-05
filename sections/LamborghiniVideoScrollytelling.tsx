'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

const FALLBACK_DURATION = 23;
const LERP = 0.15; 

export default function LamborghiniVideoScrollytelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useGSAP(
        (_, contextSafe) => {
            const video = videoRef.current;
            const container = containerRef.current;
            if (!video || !container || !contextSafe) return;

            let targetTime = 0;
            let currentTime = 0;
            let duration = FALLBACK_DURATION;

            
            const unlock = () => {
                video.play().then(() => video.pause()).catch(() => {});
            };
            window.addEventListener('touchstart', unlock, { once: true, passive: true });

            
            const tick = () => {
                currentTime += (targetTime - currentTime) * LERP;
                if (Math.abs(targetTime - currentTime) < 0.001) currentTime = targetTime;

                if (!video.seeking && Math.abs(video.currentTime - currentTime) > 1 / 60) {
                    video.currentTime = currentTime;
                }
            };

            const setup = contextSafe(() => {
                duration = video.duration || FALLBACK_DURATION;
                video.pause();
                video.currentTime = 0;

                const tl = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: container,
                        start: 'top top',
                        end: () => `+=${window.innerHeight * 5}`,
                        scrub: true, 
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        refreshPriority: 1, 
                        onUpdate: (self) => {
                            targetTime = self.progress * duration;
                        },
                    },
                });

                tl.set({}, {}, duration);

                tl.fromTo('.scrolly-text-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 2)
                    .to('.scrolly-text-1', { opacity: 0, y: -40, duration: 1 }, 6);

                tl.fromTo('.scrolly-text-2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 9)
                    .to('.scrolly-text-2', { opacity: 0, y: -40, duration: 1 }, 15);

                tl.fromTo('.scrolly-text-3', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 18)
                    .to('.scrolly-text-3', { opacity: 0, y: -40, duration: 1 }, 22);

                gsap.ticker.add(tick);

                ScrollTrigger.refresh();
            });

            if (video.readyState >= 1 && !Number.isNaN(video.duration)) {
                setup();
            } else {
                video.addEventListener('loadedmetadata', setup, { once: true });
                video.load();
            }

            return () => {
                gsap.ticker.remove(tick);
                video.removeEventListener('loadedmetadata', setup);
                window.removeEventListener('touchstart', unlock);
            };
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className="relative h-svh w-full overflow-hidden bg-black">
            <div>
                <video
                    ref={videoRef}
                    src="/scrub_optimized.mp4"
                    poster="/lamborghini-poster.webp"
                    className="pointer-events-none h-full w-full lg:object-cover"
                    muted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                />
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <h1 className="scrolly-text-1 absolute px-6 text-center text-4xl font-bold uppercase tracking-wider text-white opacity-0 md:text-7xl">
                    Unleash the Beast
                </h1>
                <h2 className="scrolly-text-2 absolute px-6 text-center text-3xl font-bold uppercase tracking-wider text-white opacity-0 md:text-6xl">
                    Twin-Turbo V8 Power &amp; Agility
                </h2>
                <h2 className="scrolly-text-3 absolute px-6 text-center text-4xl font-bold uppercase tracking-wider text-white opacity-0 md:text-7xl">
                    Redefining Performance
                </h2>
            </div>
        </div>
    );
}