import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { MetricsPreview } from '@/components/landing/MetricsPreview';
import { HowItWorks } from '@/components/landing/HowItWorks';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <MetricsPreview />
    </main>
  );
}
