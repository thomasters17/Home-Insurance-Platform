import {notFound} from 'next/navigation';
import {Metadata} from "next";

interface QuotePageProps {
  params: Promise<{ productType: string }>;
}

const QuotePage = async ({params}: QuotePageProps) => {
  const {productType} = await params;

  if (productType !== 'household' && productType !== 'buyToLet') {
    notFound();
  }

  const productLabel = productType === 'household' ? 'Household' : 'Buy to Let';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{productLabel} Insurance Quote</h1>
          <p className="text-lg text-gray-600">
            Please fill in the details below to create your insurance policy
          </p>
        </div>

        {/* TODO: Build DynamicForm for selected product type */}
      </div>
    </div>
  );
}

export default QuotePage;

/**
 * Generate static params for both product types
 * This enables static generation at build time: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export function generateStaticParams() {
  return [
    {productType: 'household'},
    {productType: 'buyToLet'},
  ];
}

/**
 * Dynamic Metadata for SEO: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({params}: QuotePageProps): Promise<Metadata> {
  const {productType} = await params;

  const productLabel = productType === 'household' ? 'Household' : 'Buy to Let';

  return {
    title: `${productLabel} Insurance Quote | Uinsure`,
    description: `Get a comprehensive ${productLabel.toLowerCase()} insurance quote in minutes`,
  };
}