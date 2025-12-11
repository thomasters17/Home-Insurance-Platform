import {Policy} from "@/lib/types/policy.types";

export const mockPolicies: Policy[] = [
  {
    id: "a3f1e300-6b0f-4e25-9f0d-4c92dbf30b21",
    productType: "household",
    policyholder: {
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "1985-03-12",
    },
    property: {
      addressLine1: "12 Oak Street",
      addressLine2: "Flat 2B",
      postcode: "AB12 3CD",
    },
    productAnswers: {
      propertyType: "DetachedHouse",
      numberOfBedrooms: 4,
      yearOfConstruction: 1980,
    },
    createdAt: "2024-05-01T10:15:30Z",
  },
  {
    id: "b72ce4af-20af-44a6-82e1-9914bc0d56cf",
    productType: "buyToLet",
    policyholder: {
      firstName: "Michael",
      lastName: "Smith",
      dateOfBirth: "1972-11-08",
    },
    property: {
      addressLine1: "88 Riverbank Road",
      postcode: "ZX98 1QP",
    },
    productAnswers: {
      propertyType: "TerracedHouse",
      numberOfBedrooms: 3,
      isPropertyLetToStudents: true,
    },
    createdAt: "2024-04-15T14:22:10Z",
  },
  {
    id: "e90ac03d-6ba3-44e3-9351-8ba8d384f395",
    productType: "household",
    policyholder: {
      firstName: "Amelia",
      lastName: "Watson",
      dateOfBirth: "1990-07-20",
    },
    property: {
      addressLine1: "5 Meadow Lane",
      addressLine2: "Unit 4",
      addressLine3: "Northside",
      postcode: "QR45 9UV",
    },
    productAnswers: {
      propertyType: "SemiDetachedHouse",
      numberOfBedrooms: 2,
      yearOfConstruction: 1930,
    },
    createdAt: "2024-03-10T08:55:00Z",
  },
  {
    id: "56dea360-a7da-4a81-b0d1-64c1b76f1b95",
    productType: "buyToLet",
    policyholder: {
      firstName: "Oliver",
      lastName: "Green",
      dateOfBirth: "1966-02-01",
    },
    property: {
      addressLine1: "23 Hilltop View",
      postcode: "LM10 4BY",
    },
    productAnswers: {
      propertyType: "TerracedBungalow",
      numberOfBedrooms: 1,
      isPropertyLetToStudents: false,
    },
    createdAt: "2024-01-22T16:40:12Z",
  },
];
