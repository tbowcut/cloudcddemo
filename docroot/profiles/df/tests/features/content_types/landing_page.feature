@df @df_tools @df_tools_landing_page @content_types @landing_page @api
Feature: Demo Framework: Landing page

  Scenario: Create Landing Page
    Given I am logged in as a user with the "administrator" role
    And landing_page content:
      | title  | path    | moderation_state |
      | Foobar | /foobar | draft            |
    When I go to "/foobar"
    Then I should see "Foobar"
