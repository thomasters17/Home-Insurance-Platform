import {ProductQuestions} from '../types/question.types';
import householdQuestions from '@/data/questions/household.json';
import buyToLetQuestions from '@/data/questions/buytolet.json';
import {ProductType} from "@/lib/types/policy.types";
import {PRODUCT_TYPES} from "@/lib/utils/constants";

class QuestionService {
  // Cache loaded questions to avoid re-parsing
  private cache: Map<ProductType, ProductQuestions> = new Map();

  /**
   * Loads questions for a specific product type
   * Returns parsed and validated question configuration
   */
  async getQuestions(productType: ProductType): Promise<ProductQuestions> {
    // Check cache first
    if (this.cache.has(productType)) {
      return this.cache.get(productType)!;
    }

    /**
     * In a real application, this would be an API call. For now, we import JSON files directly
     */
    let questions: ProductQuestions;

    switch (productType) {
      case PRODUCT_TYPES.HOUSEHOLD:
        questions = householdQuestions as ProductQuestions;
        break;
      case PRODUCT_TYPES.BUY_TO_LET:
        questions = buyToLetQuestions as ProductQuestions;
        break;
      default:
        throw new Error(`Unknown product type: ${productType}`);
    }

    /**
     * In production, we would validate the JSON structure against a schema here using Zod to catch config errors early
     */
    this.validateQuestionStructure(questions);

    // Cache the result
    this.cache.set(productType, questions);

    return questions;
  }

  /**
   * Basic validation of question structure
   * In production, this would use a Zod schema
   */
  private validateQuestionStructure(questions: ProductQuestions): void {
    if (!questions.productType || !questions.version || !Array.isArray(questions.questions)) {
      throw new Error('Invalid question configuration structure');
    }

    // Validate each question has required fields
    questions.questions.forEach((q, index) => {
      if (!q.key || !q.displayText || !q.type) {
        throw new Error(`Invalid question at index ${index}: missing required fields`);
      }
    });
  }

  /**
   * Clears the cache (useful for testing or hot-reloading configs)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Pre-loads all question configurations
   * Useful for ensuring configs are valid at app startup
   */
  async preloadAll(): Promise<void> {
    await Promise.all([
      this.getQuestions(PRODUCT_TYPES.HOUSEHOLD),
      this.getQuestions(PRODUCT_TYPES.BUY_TO_LET),
    ]);
  }
}

// Export singleton instance
export const questionService = new QuestionService();