import Link from 'next/link';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Home, Building2, Check} from 'lucide-react';
import {PageWrapper} from "@/components/layout/PageWrapper";

const ProductsPage = async () => {
  return (
    <PageWrapper>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Insurance Type</h1>
        <p className="text-xl text-gray-600">
          Select the type of insurance that best fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Household Insurance Card */}
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-6">
                <Home className="h-12 w-12 text-blue-600"/>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Household Insurance</CardTitle>
            <CardDescription className="text-center text-base">
              For homeowners protecting their primary residence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Comprehensive building and contents cover</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Protection for your personal belongings</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Emergency accommodation coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Personal liability protection</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/quote/household" className="w-full">
              <Button className="w-full" size="lg">
                Get Household Quote
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Buy to Let Insurance Card */}
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 rounded-full p-6">
                <Building2 className="h-12 w-12 text-purple-600"/>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Buy to Let Insurance</CardTitle>
            <CardDescription className="text-center text-base">
              For landlords insuring rental properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Landlord-specific building cover</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Loss of rental income protection</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Public liability for tenant injuries</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
                <span>Malicious damage coverage</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/quote/buyToLet" className="w-full">
              {/* Could be variant secondary? */}
              <Button className="w-full" size="lg">
                Get Buy to Let Quote
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default ProductsPage;