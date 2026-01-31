import { Card } from '@/components/ui/Card';
import { Mail, FileBarChart, Trophy } from 'lucide-react';

const STEPS = [
    {
        number: '01',
        title: 'Subscribe',
        description: 'Enter your email. It starts free.',
        icon: Mail
    },
    {
        number: '02',
        title: 'Get Insights',
        description: 'Weekly PDFs sent every Monday.',
        icon: FileBarChart
    },
    {
        number: '03',
        title: 'Win',
        description: 'Make smarter decisions with data.',
        icon: Trophy
    }
];

export function HowItWorks() {
    return (
        <section className="px-4 py-24 bg-[#f9f9f9]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#37003c] mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Simple. Powerful. Free. Get Premier League insights delivered to your inbox.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {STEPS.map((step, index) => (
                        <Card key={step.number} variant="default" className="relative group h-full overflow-visible bg-white hover:shadow-xl transition-all border-none">
                            {/* Connector line */}
                            {index < STEPS.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-[#37003c]/10 to-transparent -z-10" />
                            )}

                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 bg-[#37003c] rounded-2xl flex items-center justify-center border border-[#37003c] group-hover:scale-110 transition-all duration-300 shadow-lg z-10">
                                        <step.icon className="w-8 h-8 text-white group-hover:text-[#00ff85] transition-colors" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00ff85] rounded-full flex items-center justify-center text-xs font-bold text-[#37003c] z-20">
                                        {step.number}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-[#37003c] mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
