import {notFound} from 'next/navigation';
import Link from 'next/link';
import {PolicyDetail} from '@/components/policy/PolicyDetail';
import {Button} from '@/components/ui/button';
import {ArrowLeft, Plus} from 'lucide-react';
import {mockPolicies} from "@/data/mocks/policies";

interface PolicyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PolicyDetailPage = async ({params}: PolicyDetailPageProps) => {
  const {id} = await params;

  console.log({id})

  // TODO: Create mock policy service
  const policy = mockPolicies[0]

  if (!policy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href="/policies">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4"/>
              Back to Policies
            </Button>
          </Link>
          <Link href="/products">
            <Button>
              <Plus className="mr-2 h-4 w-4"/>
              Create Another Policy
            </Button>
          </Link>
        </div>

        {/* Policy Details */}
        <PolicyDetail policy={policy}/>
      </div>
    </div>
  );
}

export default PolicyDetailPage;