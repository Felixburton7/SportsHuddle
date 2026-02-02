import Image from 'next/image';
import { SubscribeForm } from './SubscribeForm';

const logos = [
    "Arsenal.png", "AstonVilla.png", "Bournemouth.png", "Brentford.png",
    "BrightonHove.png", "Burnley.png", "Chelsea.png", "CrystalPalace.png",
    "Everton.png", "Fulham.png", "Liverpool.png", "ManchesterCity.png",
    "ManchesterUnited.png", "NewcastleUnited.png", "Nottingham Forest.png",
    "Tottenham Hotspur.png", "West Ham United.png", "Wolverhampton Wanderers.png"
];

export function Hero() {
    return (
        <section id="subscribe" className="relative px-4 pt-12 pb-10 overflow-hidden bg-[#f9f9f9]">
            {/* Background gradient effects - Light Mode */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#37003c]/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#37003c]/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-center lg:justify-between gap-8 lg:gap-10 text-center lg:text-left">
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                    <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-4xl aspect-[3/4]">
                        <Image
                            src="/sportshuddlephonephoto.png"
                            alt="SportsHuddle mobile preview"
                            fill
                            priority
                            sizes="(min-width: 1024px) 72vw, (min-width: 640px) 60vw, 45vw"
                            className="object-contain origin-center scale-100 sm:scale-[1.15] lg:scale-[1.3]"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    {/* Headline */}
                    <h1 className="w-full text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-[#37003c]">
                        Master the market with <span className="bg-gradient-to-r from-[#37003c] to-[#a8005d] bg-clip-text text-transparent">free Premier League analytics</span>
                    </h1>

                    <div className="flex flex-col gap-3 text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                        <p className="flex items-start gap-2 text-left">
                            <span className="text-[#a8005d] font-bold mt-1">✓</span>
                            <span>Free to join</span>
                        </p>
                        <p className="flex items-start gap-2 text-left">
                            <span className="text-[#a8005d] font-bold mt-1">✓</span>
                            <span>Delivered to your inbox</span>
                        </p>
                    </div>

                    {/* Subscribe Form */}
                    <div className="w-full max-w-xl mx-auto lg:mx-0">
                        <SubscribeForm footerText="Unsubscribe anytime" />
                    </div>
                </div>
            </div>

            {/* Team Logos Marquee */}
            <div className="w-full mt-8 mb-4 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f9f9f9] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#f9f9f9] to-transparent z-10 pointer-events-none" />

                <div className="flex animate-scroll gap-12 w-max py-4">
                    {[...logos, ...logos].map((logo, i) => (
                        <div key={`${logo}-${i}`} className="w-16 h-16 relative flex-shrink-0 opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300">
                            <Image
                                src={`/logos/${logo}`}
                                alt={logo.replace('.png', '')}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
