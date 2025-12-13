import fs from 'fs';
import path from 'path';
import {ProductType} from "@/lib/types/policy.types";

export function loadFormDefinition(productType: ProductType) {
  const filePath = path.resolve(__dirname, `../../data/questions/${productType}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function getRequiredFieldErrors(formJson: any) {
  return formJson.questions
    .filter((q: any) => q.isRequired)
    .map((q: any) => q.validation?.required?.message || `${q.displayText} is required`);
}
