import { Header } from '@/components/landing/Header';
import { SubscribeForm } from '@/components/landing/SubscribeForm';

export default function SubscribePage() {
    return (
        <main className="min-h-screen bg-[#f9f9f9]">
            <Header />
            <section className="min-h-screen px-4 pt-28 pb-16 flex items-center justify-center">
                <div className="w-full max-w-xl text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#37003c]">
                        Weekly Premier League insights
                    </h1>
                    <p className="mt-4 text-base text-gray-600">
                        A short, sharp read with analytics that go beyond the box score.
                    </p>
                    <p className="mt-1 text-base text-gray-600">
                        Free to join. Unsubscribe anytime.
                    </p>
                    <div className="mt-8">
                        <SubscribeForm autoFocus showFooterText={false} />
                    </div>
                </div>
            </section>
        </main>
    );
}
