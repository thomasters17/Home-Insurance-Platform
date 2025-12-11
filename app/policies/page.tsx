'use client';

import Link from 'next/link';
import { PolicyCard } from '@/components/policy/PolicyCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Plus, FileText } from 'lucide-react';
import {usePolicies} from "@/lib/hooks/usePolicies";
import {PageWrapper} from "@/components/layout/PageWrapper";

const PoliciesPage = () => {
  const { policies, isLoading, count } = usePolicies();

  if (isLoading) {
    return (
      <PageWrapper center>
        <LoadingSpinner />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Policies</h1>
            <p className="text-lg text-gray-600">
              {count === 0
                ? 'No policies created yet'
                : `${count} ${count === 1 ? 'policy' : 'policies'} found`}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {count === 0 && (
          <div className="text-center py-20">
            <FileText className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No Policies Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first insurance policy.
              Choose between household or buy-to-let insurance.
            </p>
            <Link href="/products">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Policy
              </Button>
            </Link>
          </div>
        )}

        {/* Policy Grid */}
        {count > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default PoliciesPage;