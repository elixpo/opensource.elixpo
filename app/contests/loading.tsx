import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { PublicListLoading } from '@/components/public/PublicListLoading';

export default function LoadingContests() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <PublicListLoading label="public contests" />
      <Footer />
    </main>
  );
}
