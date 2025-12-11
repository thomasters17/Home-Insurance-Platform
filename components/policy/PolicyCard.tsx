import Link from 'next/link';
import {Policy, isHouseholdPolicy, isBuyToLetPolicy} from '@/lib/types/policy.types';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Home, Calendar, User} from 'lucide-react';
import {PRODUCT_TYPES} from "@/lib/utils/constants";

interface PolicyCardProps {
  policy: Policy;
}

export const PolicyCard = ({policy}: PolicyCardProps) => {
  const productLabel = policy.productType === PRODUCT_TYPES.HOUSEHOLD ? 'Household' : 'Buy to Let';
  const createdDate = new Date(policy.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link href={`/policies/${policy.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">
                {policy.policyholder.firstName} {policy.policyholder.lastName}
              </CardTitle>
              <CardDescription>{policy.property.addressLine1}</CardDescription>
            </div>
            <Badge variant={policy.productType === PRODUCT_TYPES.HOUSEHOLD ? 'default' : 'secondary'}>
              {productLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4"/>
              <span>{policy.property.postcode}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4"/>
              <span>
                {isHouseholdPolicy(policy) && `${policy.productAnswers.numberOfBedrooms} bedrooms`}
                {isBuyToLetPolicy(policy) && `${policy.productAnswers.numberOfBedrooms} bedrooms`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4"/>
              <span>Created {createdDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}