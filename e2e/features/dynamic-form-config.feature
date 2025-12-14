Feature: Dynamic Form Configuration
  As a product manager
  I want to configure insurance forms via JSON
  So that I can change form requirements without code changes

  Scenario: All fields are required when JSON specifies isRequired true
    Given the household JSON config is:
      | field              | isRequired |
      | propertyType       | true       |
      | numberOfBedrooms   | true       |
      | yearOfConstruction | true       |
    When I navigate to the household quote form
    Then I should see the "Property Type" field marked as required
    And I should see the "Number of bedrooms" field marked as required
    And I should see the "Year of construction" field marked as required
    When I fill in the policyholder information
    And I fill in the property address
    And I submit the form without filling product questions
    Then I should see a validation error for "Property Type"

  Scenario: Fields are optional when JSON specifies isRequired false
    Given the household JSON config is:
      | field              | isRequired |
      | propertyType       | false      |
      | numberOfBedrooms   | false      |
      | yearOfConstruction | false      |
    When I navigate to the household quote form
    And I fill in the policyholder information
    And I fill in the property address
    And I submit the form without filling product questions
    Then the form should submit successfully


  Scenario: Mixed required and optional fields
    Given the household JSON config is:
      | field              | isRequired |
      | propertyType       | true       |
      | numberOfBedrooms   | false      |
      | yearOfConstruction | true       |
    When I navigate to the household quote form
    And I fill in the policyholder information
    And I fill in the property address
    And I submit the form without filling product questions
    Then I should see a validation error for "Property Type"
    And I should see a validation error for "Year of construction"
    And I should not see a validation error for "Number of bedrooms"


# Would also write similar tests for buy to let