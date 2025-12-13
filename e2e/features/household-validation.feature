Feature: Quote form validation
  As a user creating a new policy
  I want to be warned if I submit an empty form
  So that I can correct the missing information

  Scenario: Submitting the Household quote form without entering data shows required field errors
    Given I am on the "household" quote page
    When I submit the quote form without entering any data
    Then I should see all required field errors for "household"

#  Scenario: Submitting the Buy-to-Let quote form without entering data shows required field errors
#    Given I am on the "buyToLet" quote page
#    When I submit the quote form without entering any data
#    Then I should see all required field errors for "buyToLet"
