@df @api
Feature: Demo Framework
  Verifies that basic site functionality is working.

  Scenario: Verify that anonymous users can visit the site.
    Given I am an anonymous user
    And I am on the homepage
    Then the response status code should be 200

  Scenario: Verify that authenticated users can visit the site.
    Given I am logged in as a user with the "administrator" role
    And I am on the homepage
    Then the response status code should be 200

  Scenario: Ensure that database logging is available.
    Given I am logged in as a user with the "administrator" role
    And I am on "/admin/reports/dblog"
    Then I should see "Recent log messages"

  Scenario: Ensure that the update module is disabled by default.
    Given I am logged in as a user with the "administrator" role
    And I am on "/admin/modules"
    Then the "Update Manager" checkbox should not be checked
