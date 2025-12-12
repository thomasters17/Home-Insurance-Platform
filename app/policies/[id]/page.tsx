'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PolicyDetail } from '@/components/policy/PolicyDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { usePolicies } from '@/lib/hooks/usePolicies';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {PageWrapper} from "@/components/layout/PageWrapper";
import {ROUTES} from "@/lib/utils/constants";

const PolicyDetailPage = () => {
  const params = useParams<{id: string}>();
  const router = useRouter();

  const { getPolicyById, isLoading } = usePolicies();

  const policy = getPolicyById(params.id);

  if (isLoading) {
    return (
      <PageWrapper center>
        <LoadingSpinner />
      </PageWrapper>
    );
  }

  if (!policy) {
    return (
      <PageWrapper className="flex justify-center">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 text-center">

          {/* Back Button */}
          <div className="mb-8 text-left">
            <Link href={ROUTES.POLICIES}>
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Policies
              </Button>
            </Link>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold mb-4">Policy Not Found</h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find a policy with ID: <span className="font-mono">{params.id}</span>
          </p>

          {/* Action Button */}
          <Button
            className="blue inline-flex items-center"
            onClick={() => router.push(ROUTES.PRODUCTS)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create a New Policy
          </Button>

        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href={ROUTES.POLICIES}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Policies
            </Button>
          </Link>
          <Link href={ROUTES.PRODUCTS}>
            <Button className="rounded-3xl">
              <Plus/>
              Create Another Policy
            </Button>
          </Link>
        </div>

        {/* Policy Details */}
        <PolicyDetail policy={policy} />
      </div>
    </PageWrapper>
  );
};

export default PolicyDetailPage;