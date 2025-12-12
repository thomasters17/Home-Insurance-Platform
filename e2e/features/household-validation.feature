Feature: Household quote form validation
  As a user creating a new Household policy
  I want to be warned if I submit an empty form
  So that I can correct the missing information

  Background:
    Given I am on the Household quote page

  Scenario: Submitting the Household quote form without entering data shows all required field errors
    When I submit the quote form without entering any data
    Then I should see the following validation errors:
      | message                          |
      | First name is required           |
      | Last name is required            |
      | Date of birth is required        |
      | Address line 1 is required       |
      | Postcode is required             |
      | Property type is required        |
      | Number of bedrooms is required   |
      | Year of construction is required |