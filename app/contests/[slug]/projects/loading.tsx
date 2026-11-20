import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { PublicListLoading } from '@/components/public/PublicListLoading';

export default function LoadingProjects() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <PublicListLoading label="public projects" />
      <Footer />
    </main>
  );
}
