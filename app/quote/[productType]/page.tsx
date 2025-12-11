import {notFound} from 'next/navigation';
import {Metadata} from "next";
import {DynamicForm} from "@/components/forms/DynamicForm";
import {ProductType} from "@/lib/types/policy.types";
import {PRODUCT_TYPES} from "@/lib/utils/constants";
import {PageWrapper} from "@/components/layout/PageWrapper";

interface QuotePageProps {
  params: Promise<{ productType: string }>;
}

const QuotePage = async ({params}: QuotePageProps) => {
  const {productType} = await params;

  if (productType !== PRODUCT_TYPES.HOUSEHOLD && productType !== PRODUCT_TYPES.BUY_TO_LET) {
    notFound();
  }

  const productLabel = productType === PRODUCT_TYPES.HOUSEHOLD ? 'Household' : 'Buy to Let';

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{productLabel} Insurance Quote</h1>
          <p className="text-lg text-gray-600">
            Please fill in the details below to create your insurance policy
          </p>
        </div>

        <DynamicForm productType={productType as ProductType} />
      </div>
    </PageWrapper>
  );
}

export default QuotePage;

/**
 * Generate static params for both product types
 * This enables static generation at build time: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export function generateStaticParams() {
  return [
    {productType: PRODUCT_TYPES.HOUSEHOLD},
    {productType: PRODUCT_TYPES.BUY_TO_LET},
  ];
}

/**
 * Dynamic Metadata for SEO: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({params}: QuotePageProps): Promise<Metadata> {
  const {productType} = await params;

  const productLabel = productType === PRODUCT_TYPES.HOUSEHOLD ? 'Household' : 'Buy to Let';

  return {
    title: `${productLabel} Insurance Quote | Uinsure`,
    description: `Get a comprehensive ${productLabel.toLowerCase()} insurance quote in minutes`,
  };
}