@df @layout @api @errors
Feature: Panelizer

  @landing-page @1e244c89
  Scenario: Panelizer is enabled for landing pages
    Given I am logged in as a user with the administrator role
    And landing_page content:
      | title  | path    |
      | Foobar | /foobar |
    When I visit "/foobar"
    Then I should see a "#panels-ipe-content" element
    And I should not see a ".field--name-uid" element
    And I should not see a ".field--name-created" element

  @landing-page @javascript @43f95224
  Scenario: One-off changes can be made to Landing Pages using the IPE out of the box.
    Given I am logged in as a user with the "access panels in-place editing,administer panelizer node landing_page content,edit any landing_page content,view any unpublished content,use draft_draft transition,view latest version,access user profiles,set panelizer default" permissions
    And landing_page content:
      | title  | path    | moderation_state |
      | Foobar | /foobar | draft            |
    When I visit "/foobar"
    And I place the "views_block:who_s_online-who_s_online_block" block from the "Lists" category
    # Click IPE Save
    And I save the layout
    And I visit "/foobar"
    Then I should see a "views_block:who_s_online-who_s_online_block" block

  @landing-page @javascript @c1cdf042
  Scenario: Quick-editing custom blocks in an IPE layout
    Given I am logged in as a user with the administrator role
    And landing_page content:
      | title  | path    | moderation_state |
      | Foobar | /foobar | draft            |
    And block_content entities:
      | type  | info               | body    | uuid                  |
      | basic | Here be dragons... | RAWWWR! | test--here-be-dragons |
    When I visit "/foobar"
    And I place the "block_content:test--here-be-dragons" block from the "Basic block" category
    And I save the layout
    And I reload the page
    And I wait 5 seconds
    Then I should see a "block_content:test--here-be-dragons" block with a "quickedit" contextual link

  @landing-page @javascript @e787aec5
  Scenario: Quick-editing fields placed in an IPE layout
    Given I am logged in as a user with the administrator role
    And landing_page content:
      | title  | path    | moderation_state | body                                 |
      | Zebras | /zebras | draft            | How quickly deft jumping zebras vex. |
    When I visit "/zebras"
    And I place the "entity_field:node:body" block from the "Content Fields" category
    And I save the layout
    And I reload the page
    And I wait 5 seconds
    Then I should see a "system_main_block" block with a "quickedit" contextual link

  @landing-page @javascript @29bc5778
  Scenario: Editing layouts does not affect other layouts if the user has not saved the edited layout as default
    Given I am logged in as a user with the administrator role
    And landing_page content:
      | title   | path     | moderation_state |
      | Layout1 | /layout1 | draft            |
      | Layout2 | /layout2 | draft            |
    When I visit "/layout1"
    And I place the "views_block:who_s_online-who_s_online_block" block from the "Lists" category
    # And visit the second landing page without saving the layout changes to the first
    And I visit "/layout2"
    And I accept the popup
    # I should not see the block placed by the first landing page
    Then I should not see a "views_block:who_s_online-who_s_online_block" block

  @landing-page @javascript @ccabe17e
  Scenario: Changing layouts through the IPE
    Given users:
      | name | mail          | roles                               |
      | Foo  | foo@localhost | administrator |
    And landing_page content:
      | title  | path    | moderation_state | author |
      | Foobar | /foobar | draft            | Foo    |
    And I am logged in as Foo
    When I visit "/foobar"
    And I change the layout to "foundation_3col" from the "Three Columns" category
    And I should see "Region: left"
    And I should see "Region: middle"
    And I should see "Region: right"
    And I change the layout to "foundation_2col" from the "Two Columns" category
    And I should see "Region: left"
    And I should see "Region: right"
    Then I should not see "Region: middle"
    And I close the editor

  @landing-page @javascript @8f8ee69f
  Scenario: Not all entity types should be exposed as embeddable blocks
    Given I am logged in as a user with the administrator role
    And landing_page content:
      | title  | path    | moderation_state |
      | Foobar | /foobar | draft            |
    When I visit "/foobar"
    And I open the "Existing Content" category
    Then I should not see the "entity_block:block" plugin
    And I should not see the "entity_block:block_custom" plugin
