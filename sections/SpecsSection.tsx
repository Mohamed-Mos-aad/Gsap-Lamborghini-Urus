
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const SPECS = [
    { label: 'Horsepower', value: 650, decimals: 0, unit: 'HP' },
    { label: '0 – 100 km/h', value: 3.6, decimals: 1, unit: 'sec' },
    { label: 'Top Speed', value: 305, decimals: 0, unit: 'km/h' },
];

export default function SpecsSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        const title = section.querySelector('.spec-title');
        const grid = section.querySelector('.spec-grid');
        const cards = section.querySelectorAll('.spec-card');
        const counters = section.querySelectorAll('.spec-value');

        // Title animation
        gsap.fromTo(
            title,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    toggleActions: 'play reverse play reverse',
                },
            }
        );

        // Cards animation
        gsap.fromTo(
            cards,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                },
            }
        );

        // Counter animations
        counters.forEach((el) => {
            const target = Number(el.getAttribute('data-value'));
            const decimals = Number(el.getAttribute('data-decimals'));

            const counter = { value: 0 };

            gsap.to(counter, {
                value: target,
                duration: 2.5,
                ease: 'power2.out',
                onUpdate: () => {
                    el.textContent = counter.value.toFixed(decimals);
                },
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                },
            });
        });

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-svh flex-col items-center justify-center bg-black px-6 py-24 text-white"
        >
            <h2 className="spec-title mb-16 text-center text-sm font-semibold uppercase tracking-[0.4em] text-amber-400 md:text-base">
                Performance Specs
            </h2>

            <div className="spec-grid grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
                {SPECS.map((spec) => (
                    <div
                        key={spec.label}
                        className="spec-card flex flex-col items-center rounded-2xl border border-amber-400/20 bg-white/5 px-6 py-12 shadow-[0_0_40px_rgba(251,191,36,0.06)] backdrop-blur-sm"
                    >
                        <div className="flex items-baseline gap-2">
                            <span
                                className="spec-value text-6xl font-bold tabular-nums sm:text-7xl md:text-8xl text-white"
                                data-value={spec.value}
                                data-decimals={spec.decimals}
                            >
                                {(0).toFixed(spec.decimals)}
                            </span>

                            <span className="text-xl font-semibold text-amber-400 md:text-2xl">
                                {spec.unit}
                            </span>
                        </div>

                        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/60 md:text-sm">
                            {spec.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
