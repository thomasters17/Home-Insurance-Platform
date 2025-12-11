import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import {PageWrapper} from "@/components/layout/PageWrapper";
import {ROUTES} from "@/lib/utils/constants";

const HomePage = async () => {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Protect Your Home with Uinsure
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get comprehensive home insurance coverage tailored to your needs.
              Whether you&#39;re insuring your own home or a buy-to-let property, we&#39;ve got you covered.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={ROUTES.PRODUCTS}>
                <Button size="lg" className="text-lg px-8 py-6">
                  Get a Quote
                </Button>
              </Link>
              <Link href={ROUTES.POLICIES}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Policies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default HomePage;