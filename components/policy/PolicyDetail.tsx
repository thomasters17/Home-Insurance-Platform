'use client';

import { Policy, isHouseholdPolicy, isBuyToLetPolicy } from '@/lib/types/policy.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PolicyDetailProps {
  policy: Policy;
}

export const PolicyDetail = ({ policy }: PolicyDetailProps) => {
  const productLabel = policy.productType === 'household' ? 'Household Insurance' : 'Buy to Let Insurance';
  const createdDate = new Date(policy.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const dob = new Date(policy.policyholder.dateOfBirth).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Map property type codes to readable labels
  const propertyTypeLabels: Record<string, string> = {
    TerracedHouse: 'Terraced House',
    DetachedHouse: 'Detached House',
    SemiDetachedHouse: 'Semi Detached House',
    TerracedBungalow: 'Terraced Bungalow',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Policy Details</h1>
          <p className="text-gray-600">Policy ID: {policy.id}</p>
        </div>
        <Badge variant={policy.productType === 'household' ? 'default' : 'secondary'} className="text-lg py-2 px-4">
          {productLabel}
        </Badge>
      </div>

      {/* Policyholder Information */}
      <Card>
        <CardHeader>
          <CardTitle>Policyholder Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{policy.policyholder.firstName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{policy.policyholder.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">{dob}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Address Line 1</dt>
              <dd className="mt-1 text-sm text-gray-900">{policy.property.addressLine1}</dd>
            </div>
            {policy.property.addressLine2 && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Address Line 2</dt>
                <dd className="mt-1 text-sm text-gray-900">{policy.property.addressLine2}</dd>
              </div>
            )}
            {policy.property.addressLine3 && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Address Line 3</dt>
                <dd className="mt-1 text-sm text-gray-900">{policy.property.addressLine3}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Postcode</dt>
              <dd className="mt-1 text-sm text-gray-900">{policy.property.postcode}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Product-Specific Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Property Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {propertyTypeLabels[policy.productAnswers.propertyType]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Number of Bedrooms</dt>
              <dd className="mt-1 text-sm text-gray-900">{policy.productAnswers.numberOfBedrooms}</dd>
            </div>
            {isHouseholdPolicy(policy) && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Year of Construction</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {policy.productAnswers.yearOfConstruction === 1700 && 'Pre 1750'}
                  {policy.productAnswers.yearOfConstruction === 1750 && 'Between 1750 and 1799'}
                  {policy.productAnswers.yearOfConstruction === 1800 && 'Between 1800 and 1899'}
                  {policy.productAnswers.yearOfConstruction === 1900 && 'Between 1900 and 1999'}
                  {policy.productAnswers.yearOfConstruction === 2000 && '2000 onwards'}
                </dd>
              </div>
            )}
            {isBuyToLetPolicy(policy) && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Let to Students</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {policy.productAnswers.isPropertyLetToStudents ? 'Yes' : 'No'}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">{createdDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}