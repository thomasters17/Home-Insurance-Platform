import { describe, it, expect, vi } from "vitest";
import {
  policyholderSchema,
  propertySchema,
  householdAnswersSchema,
  buyToLetAnswersSchema,
  createPolicySchema,
  validateFormData,
} from "@/lib/validations/schemas";
import { formatPostcode } from "@/lib/validations/validators";

// Freeze time for date-of-birth testing
const fixedNow = new Date("2025-01-01T12:00:00Z");
vi.useFakeTimers();
vi.setSystemTime(fixedNow);

describe("policyholderSchema", () => {
  it("validates a correct policyholder", () => {
    const result = policyholderSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid first name characters", () => {
    const result = policyholderSchema.safeParse({
      firstName: "J0hn!",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "First name can only contain letters, spaces, hyphens and apostrophes"
    );
  });

  it("rejects invalid date format", () => {
    const result = policyholderSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "not-a-date",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid date format");
  });

  it("rejects age under 18", () => {
    const result = policyholderSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2010-05-01",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.message.includes("18 or over"))).toBe(true);
  });
});

describe("propertySchema", () => {
  it("validates a correct property", () => {
    const result = propertySchema.safeParse({
      addressLine1: "123 Test Road",
      postcode: "SW1A 1AA",
    });

    expect(result.success).toBe(true);
    expect(result.data?.postcode).toBe("SW1A 1AA"); // transformed
  });

  it("rejects invalid postcode", () => {
    const result = propertySchema.safeParse({
      addressLine1: "123 Test Road",
      postcode: "INVALID",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid UK postcode format");
  });

  it("auto-formats postcode via transformer", () => {
    const result = propertySchema.safeParse({
      addressLine1: "123 Test Road",
      postcode: "sw1a1aa",
    });

    expect(result.success).toBe(true);
    expect(result.data?.postcode).toBe(formatPostcode("sw1a1aa"));
  });
});

describe("householdAnswersSchema", () => {
  it("accepts valid inputs", () => {
    const result = householdAnswersSchema.safeParse({
      propertyType: "TerracedHouse",
      numberOfBedrooms: 3,
      yearOfConstruction: 1990,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid property type", () => {
    const result = householdAnswersSchema.safeParse({
      propertyType: "InvalidType",
      numberOfBedrooms: 3,
      yearOfConstruction: 1990,
    });

    expect(result.success).toBe(false);
  });

  it("rejects out-of-range bedroom count", () => {
    const result = householdAnswersSchema.safeParse({
      propertyType: "DetachedHouse",
      numberOfBedrooms: 10,
      yearOfConstruction: 1990,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid construction year", () => {
    const result = householdAnswersSchema.safeParse({
      propertyType: "DetachedHouse",
      numberOfBedrooms: 3,
      yearOfConstruction: 1600,
    });

    expect(result.success).toBe(false);
  });
});

describe("buyToLetAnswersSchema", () => {
  it("accepts valid inputs", () => {
    const result = buyToLetAnswersSchema.safeParse({
      propertyType: "DetachedHouse",
      numberOfBedrooms: 4,
      isPropertyLetToStudents: true,
    });

    expect(result.success).toBe(true);
  });

  it("requires boolean for isPropertyLetToStudents", () => {
    const result = buyToLetAnswersSchema.safeParse({
      propertyType: "DetachedHouse",
      numberOfBedrooms: 4,
      isPropertyLetToStudents: "yes",
    });

    expect(result.success).toBe(false);
  });
});

describe("createPolicySchema", () => {
  const base = {
    productType: "household",
    policyholder: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
    },
    property: {
      addressLine1: "123 Road",
      postcode: "SW1A 1AA",
    }
  };

  it("validates a household policy", () => {
    const result = createPolicySchema.safeParse({
      ...base,
      productAnswers: {
        propertyType: "TerracedHouse",
        numberOfBedrooms: 3,
        yearOfConstruction: 1990,
      }
    });

    expect(result.success).toBe(true);
  });

  it("validates a buy-to-let policy", () => {
    const result = createPolicySchema.safeParse({
      ...base,
      productType: "buyToLet",
      productAnswers: {
        propertyType: "TerracedHouse",
        numberOfBedrooms: 3,
        isPropertyLetToStudents: false,
      }
    });

    expect(result.success).toBe(true);
  });
});

describe("validateFormData", () => {
  const base = {
    policyholder: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
    },
    property: {
      addressLine1: "123 Road",
      postcode: "SW1A 1AA",
    }
  };

  it("correctly validates household product", () => {
    const result = validateFormData(
      {
        ...base,
        productType: "household",
        productAnswers: {
          propertyType: "DetachedHouse",
          numberOfBedrooms: 3,
          yearOfConstruction: 1980,
        }
      },
      "household"
    );

    expect(result.success).toBe(true);
  });

  it("correctly validates buy-to-let product", () => {
    const result = validateFormData(
      {
        ...base,
        productType: "buyToLet",
        productAnswers: {
          propertyType: "TerracedHouse",
          numberOfBedrooms: 4,
          isPropertyLetToStudents: true,
        }
      },
      "buyToLet"
    );

    expect(result.success).toBe(true);
  });

  it("rejects mismatched productAnswers for given productType", () => {
    const result = validateFormData(
      {
        ...base,
        productType: "household",
        productAnswers: {
          // Missing fields like yearOfConstruction
          propertyType: "TerracedHouse",
          numberOfBedrooms: 3,
        }
      },
      "household"
    );

    expect(result.success).toBe(false);
  });
});

vi.useRealTimers();
