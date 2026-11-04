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

    useGSAP(
        () => {
        gsap.from('.spec-title', {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        });

        gsap.from('.spec-card', {
            opacity: 0,
            y: 60,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.spec-grid', start: 'top 80%', once: true },
        });

        gsap.utils.toArray<HTMLElement>('.spec-value').forEach((el) => {
            const target = Number(el.dataset.value);
            const decimals = Number(el.dataset.decimals);
            const counter = { val: 0 };

            gsap.to(counter, {
            val: target,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: () => {
                el.textContent = counter.val.toFixed(decimals);
            },
            scrollTrigger: { trigger: '.spec-grid', start: 'top 80%', scrub: true },
            });
        });
        },
        { scope: sectionRef }
    );

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
                className="spec-card flex flex-col items-center rounded-2xl border border-amber-400/20 bg-white/2 px-6 py-12 shadow-[0_0_40px_rgba(0,229,255,0.06)] backdrop-blur-sm"
            >
                <div className="flex items-baseline gap-2">
                <span
                    className="spec-value text-6xl font-bold tabular-nums sm:text-7xl md:text-8xl [text-shadow:0_0_28px_rgba(0,229,255,0.5)]"
                    data-value={spec.value}
                    data-decimals={spec.decimals}
                >
                    {(0).toFixed(spec.decimals)}
                </span>
                <span className="text-xl font-semibold text-amber-400 md:text-2xl">{spec.unit}</span>
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