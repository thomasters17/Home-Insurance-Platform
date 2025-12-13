import { Policyholder, Property, ProductType } from './policy.types';

export interface PolicyFormData {
  productType: ProductType;
  policyholder: Policyholder;
  property: Property;
  productAnswers: Record<string, any>;
}