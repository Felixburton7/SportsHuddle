import { Card } from '@/components/ui/Card';
import { BarChart3, Hand, Zap, Target, Shield, GalleryVerticalEnd, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SAMPLE_METRICS = [
    {
        name: 'Pythagorean Wins',
        description: 'Detects luck vs skill. If Actual > Pythagorean, a drop is coming.',
        highlight: 'Arsenal: 52.3 xPts vs 48 Actual',
        insight: 'Slight underperformance',
        trend: 'up',
        icon: BarChart3
    },
    {
        name: 'Sieve Index',
        description: 'Is the defense solid, or is the keeper just saving them?',
        highlight: 'Index > 0.40',
        insight: 'Clean sheets will disappear',
        trend: 'down',
        icon: Hand
    },
    {
        name: 'Verticality Index',
        description: 'Identifies which teams bypass midfield to counter-attack.',
        highlight: 'Wolves: 4.2 Rating',
        insight: 'Most direct team in league',
        trend: 'neutral',
        icon: Zap
    },
    {
        name: 'Clinical Ratio',
        description: 'Goals per shot on target. High ratio = unsustainable form.',
        highlight: 'Brighton: 0.52',
        insight: 'Due for a cold streak',
        trend: 'down',
        icon: Target
    },
    {
        name: 'Defensive Fragility',
        description: 'Exposes true defensive weakness hidden by keeper heroics.',
        highlight: 'Newcastle: Low Fragility',
        insight: 'Genuinely solid defense',
        trend: 'up',
        icon: Shield
    },
    {
        name: 'Discipline ROI',
        description: 'Fouls committed per yellow card. Predicts crackdowns.',
        highlight: 'Man Utd: 6.2 Ratio',
        insight: 'Card accumulation likely',
        trend: 'down',
        icon: GalleryVerticalEnd
    }
];

export function MetricsPreview() {
    return (
        <section id="metrics" className="px-4 py-24 bg-gray-50/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#37003c] mb-4">
                        Beyond Basic Stats
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        We calculate unique metrics so you can make informed decisions
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SAMPLE_METRICS.map((metric) => (
                        <Card key={metric.name} variant="default" className="hover:border-[#37003c] hover:shadow-xl transition-all duration-300 h-full bg-white group border-transparent shadow-sm">
                            <div className="flex flex-col h-full p-2">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-[#37003c]/5 rounded-2xl text-[#37003c] group-hover:bg-[#37003c] group-hover:text-white transition-colors duration-300">
                                        <metric.icon className="w-6 h-6" />
                                    </div>
                                    {metric.trend === 'down' && <AlertTriangle className="w-5 h-5 text-amber-500/50" />}
                                    {metric.trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500/50" />}
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-[#37003c] mb-2">{metric.name}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                        {metric.description}
                                    </p>
                                </div>

                                {/* Insight Box */}
                                <div className="mt-auto bg-[#37003c]/[0.02] rounded-xl p-4 border border-[#37003c]/10 group-hover:border-[#37003c]/30 transition-colors">
                                    <div className="text-xs font-bold text-[#37003c]/60 uppercase tracking-wider mb-1">
                                        Real Insight
                                    </div>
                                    <div className="text-sm font-semibold text-[#37003c] mb-1">
                                        {metric.highlight}
                                    </div>
                                    <div className={cn(
                                        "text-xs font-bold px-2 py-1 rounded inline-block",
                                        metric.trend === 'down' ? "bg-amber-100 text-amber-800" :
                                            metric.trend === 'up' ? "bg-emerald-100 text-emerald-800" :
                                                "bg-blue-100 text-blue-800"
                                    )}>
                                        {metric.insight}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-[#37003c] text-white rounded-full font-bold hover:bg-[#500055] transition-all hover:scale-105 shadow-lg shadow-[#37003c]/10">
                        Explore all 39 metrics
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
