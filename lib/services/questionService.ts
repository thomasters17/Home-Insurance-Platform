import {ProductQuestions} from '../types/question.types';
import {ProductType} from "@/lib/types/policy.types";

class QuestionService {
  private cache = new Map<ProductType, ProductQuestions>();

  async getQuestions(productType: ProductType): Promise<ProductQuestions> {
    if (this.cache.has(productType)) {
      return this.cache.get(productType)!;
    }

    const res = await fetch(`/data/questions/${productType}.json`);
    if (!res.ok) throw new Error('Failed to load questions');

    const questions = (await res.json()) as ProductQuestions;

    this.validateQuestionStructure(questions);
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

  clearCache() {
    this.cache.clear();
  }
}

export const questionService = new QuestionService();
