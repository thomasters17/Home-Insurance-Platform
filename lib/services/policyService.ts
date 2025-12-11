import {Policy, CreatePolicyInput, ProductAnswers, ProductType} from '../types/policy.types';
import { v4 as uuidv4 } from 'uuid';

class PolicyService {
  /**
   * Private in-memory storage
   * In production, this would be replaced with API calls to a backend
   * @private
   */
  private policies: Map<string, Policy> = new Map();

  /**
   * Creates a new policy
   * Generates UUID and timestamp automatically
   */
  create<T extends ProductAnswers>(input: CreatePolicyInput<T>): Policy<T> {
    const newPolicy: Policy<T> = {
      ...input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.policies.set(newPolicy.id, newPolicy as Policy);
    return newPolicy;
  }

  /**
   * Retrieves all policies
   * Returns array sorted by creation date (newest first)
   */
  getAll(): Policy[] {
    const allPolicies = Array.from(this.policies.values());
    // Sort by creation date, newest first
    return allPolicies.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Retrieves a single policy by ID
   * Returns undefined if not found
   */
  getById(id: string): Policy | undefined {
    return this.policies.get(id);
  }

  /**
   * Deletes a policy by ID
   * Returns true if deleted, false if not found
   */
  delete(id: string): boolean {
    return this.policies.delete(id);
  }

  /**
   * Gets policies filtered by product type
   */
  getByProductType(productType: ProductType): Policy[] {
    return this.getAll().filter(policy => policy.productType === productType);
  }

  /**
   * Clears all policies (useful for testing)
   */
  clear(): void {
    this.policies.clear();
  }

  /**
   * Gets count of all policies
   */
  count(): number {
    return this.policies.size;
  }
}

// We export a single instance to ensure consistent state across the app
// In production with a real backend, this would be a class that makes API calls
export const policyService = new PolicyService();