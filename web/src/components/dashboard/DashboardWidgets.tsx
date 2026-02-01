import Link from 'next/link';

interface WidgetProps {
    teamName: string;
    teamShortName: string;
    points: number;
}

export function NextMatchCard({ teamShortName }: { teamShortName: string }) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full">
            <div className="mb-4 flex items-center justify-between">
                <h4 className="font-bold text-[#37003c]">Next Match</h4>
                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500">GW 24</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-center">
                    <span className="block text-2xl font-bold text-[#37003c]">{teamShortName}</span>
                    <span className="text-xs text-gray-500">Home</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="mb-1 text-xs font-bold text-gray-400">SAT 07 FEB</span>
                    <span className="text-xl font-bold text-[#37003c]">15:00</span>
                </div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-400">OPP</span>
                    <span className="text-xs text-gray-500">Away</span>
                </div>
            </div>
        </div>
    );
}

export function RecentFormCard() {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full">
            <div className="mb-4 flex items-center justify-between">
                <h4 className="font-bold text-[#37003c]">Recent Form</h4>
                <div className="flex gap-1">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00ff85] text-[10px] font-bold text-[#37003c]">W</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-[10px] font-bold text-gray-600">D</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#e90052] text-[10px] font-bold text-white">L</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00ff85] text-[10px] font-bold text-[#37003c]">W</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00ff85] text-[10px] font-bold text-[#37003c]">W</span>
                </div>
            </div>
            <p className="text-xs text-gray-500">
                Last 5 matches in Premier League.
            </p>
        </div>
    );
}

export function MiniTableCard({ teamShortName, points }: WidgetProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full">
            <div className="mb-4 flex items-center justify-between">
                <h4 className="font-bold text-[#37003c]">Table Position</h4>
                <span className="text-2xl font-bold text-[#37003c]">--</span>
            </div>
            <div className="space-y-3">
                {/* Fake rows for visuals */}
                <div className="flex items-center justify-between text-sm opacity-50">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400">1</span>
                        <span>LIV</span>
                    </div>
                    <span>50</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold bg-[#37003c]/5 p-2 rounded-lg -mx-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[#37003c]">2</span>
                        <span>{teamShortName}</span>
                    </div>
                    <span>{points}</span>
                </div>
                <div className="flex items-center justify-between text-sm opacity-50">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400">3</span>
                        <span>MCI</span>
                    </div>
                    <span>45</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <Link href="#" className="text-xs font-bold text-[#37003c] hover:underline">View Full Table &rarr;</Link>
            </div>
        </div>
    );
}
