import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { policyService } from '@/lib/services/policyService';
import {CreatePolicyInput} from "@/lib/types/policy.types";

let counter = 1;

vi.mock('uuid', () => ({
  v4: () => `mocked-uuid-${counter++}`,
}));

describe('PolicyService', () => {
  beforeEach(() => {
    policyService.clear();
    counter = 1;
  });

  afterEach(() => {
    // Restore mocks to avoid leaking to other tests
    vi.restoreAllMocks();
  });

  const basePolicyholder = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
  };

  const baseProperty = {
    addressLine1: '123 Street',
    postcode: 'AB1 2CD',
  };

  const householdAnswers = {
    propertyType: 'DetachedHouse',
    numberOfBedrooms: 3,
    yearOfConstruction: 1970,
  } as const;

  const buyToLetAnswers = {
    propertyType: 'TerracedHouse',
    numberOfBedrooms: 2,
    isPropertyLetToStudents: true,
  } as const;

  it('should create a new household policy with UUID and timestamp', () => {
    const input: CreatePolicyInput = {
      productType: 'household',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: householdAnswers,
    };

    const created = policyService.create(input);

    expect(created.id).toBe('mocked-uuid-1');
    expect(created.productType).toBe('household');
    expect(created.productAnswers).toEqual(householdAnswers);
    expect(created.createdAt).toBeDefined();
  });

  it('should create a new buy-to-let policy', () => {
    const input: CreatePolicyInput = {
      productType: 'buyToLet',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: buyToLetAnswers,
    };

    const created = policyService.create(input);

    expect(created.id).toBe('mocked-uuid-1');
    expect(created.productType).toBe('buyToLet');
    expect(created.productAnswers).toEqual(buyToLetAnswers);
  });

  it('should retrieve a policy by ID', () => {
    const created = policyService.create({
      productType: 'household',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: householdAnswers,
    });

    const found = policyService.getById(created.id);
    expect(found).toEqual(created);
  });

  it('should return undefined for a non-existent policy', () => {
    expect(policyService.getById('missing-id')).toBeUndefined();
  });

  it('should delete a policy', () => {
    const created = policyService.create({
      productType: 'household',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: householdAnswers,
    });

    const deleted = policyService.delete(created.id);
    expect(deleted).toBe(true);
    expect(policyService.getById(created.id)).toBeUndefined();
  });

  it('should return false when deleting a missing policy', () => {
    expect(policyService.delete('does-not-exist')).toBe(false);
  });

  it('should return all policies sorted by newest first', async () => {
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    const first = policyService.create({
      productType: 'household',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: householdAnswers,
    });

    // small delay to ensure createdAt differs
    await wait(10);

    const second = policyService.create({
      productType: 'buyToLet',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: buyToLetAnswers,
    });

    const all = policyService.getAll();

    expect(all).toHaveLength(2);
    expect(all[0]).toEqual(second); // newest first
    expect(all[1]).toEqual(first);
  });

  it('should return the correct count', () => {
    expect(policyService.count()).toBe(0);

    policyService.create({
      productType: 'household',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: householdAnswers,
    });

    expect(policyService.count()).toBe(1);
  });

  it('should clear all policies', () => {
    policyService.create({
      productType: 'household',
      policyholder: basePolicyholder,
      property: baseProperty,
      productAnswers: householdAnswers,
    });

    policyService.clear();

    expect(policyService.count()).toBe(0);
  });
});