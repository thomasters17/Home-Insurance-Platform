Feature: On Blur Form Validation Based on JSON Config
  As a user
  I want to see validation errors for required fields onBlur
  So that I know what information is needed

  Scenario: Required field validation triggers on blur
    Given the household JSON config is:
      | field        | isRequired |
      | propertyType | true       |
    When I navigate to the household quote form
    And I click on the "Property Type" field
    And I click outside the "Property Type" field
    Then I should see a validation error for "Property Type"

  Scenario: Optional field validation does not trigger
    Given the household JSON config is:
      | field            | isRequired |
      | numberOfBedrooms | false      |
    When I navigate to the household quote form
    And I click on the "Number of bedrooms" field
    And I click outside the "Number of bedrooms" field
    Then I should not see a validation error for "Number of bedrooms"
