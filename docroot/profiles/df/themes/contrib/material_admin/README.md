# Material Admin
Material Design Inspired Admin Theme Utilizing the [Materialize CSS](http://materializecss.com/) Framework

![alt text][logo]

[logo]: https://github.com/briancwald/material_admin/blob/8.x-1.x/images/screenshot.png "Drupal Material Admin"

## Dev Requirments 
[Yarn package manager](https://yarnpkg.com)

## Dev Setup 
 - `yarn install` installs Yarn dependencies
 - `gulp libsrc` gets libraries (currently not needed)
 - `gulp rename` renames conflict with jQueryUI and Materialize CSS autocomplete plugin
 - `gulp copy` moves updated libraries over to js/lib folder
 - `gulp sass` or `gulp` to watch sass changes

 ## Features Notes
 Portal style login [screenshot](https://dl.dropboxusercontent.com/u/8476966/portal-login.png). To use this, you will want to alter the login paths to use the admin theme. I created a simple module that does this for you: https://www.drupal.org/project/admin_login_path

## To-Do
- [x] Gulp Setup
- [x] Add method to use materialize partials
- [x] Navigation / Local Tasks
- [x] Breadcrumbs (responsive)
- [x] Date and Time selector
- [x] Submit and action buttons
- [x] Vertical Tabs support desktop
- [x] Vertical Tabs support mobile (menu style)
- [x] Submit button loading UX
- [x] Admin landing page / group styling
- [x] Dropbutton replacement
- [x] Throbber/progress icons
- [x] Admin/content enhancements 
- [x] Views UI
- [ ] Form styling defaults (90%)
- [x] Tables
- [x] Status pages
- [x] Status Message
- [x] Theme Select page
- [ ] Node add/edit (70%)
- [x] jQueryUI Dialog Theme & Enhancements
- [ ] Behat Testing
- [ ] Visual Regression Testing

## Clean-up oganization To-Do
Since this is just a POC, code is not very well organized and needs to be matured. here is what I see so far:

- [ ] Make JS features optional in settings
- [ ] Move SCSS out of admin.scss into sub components (e.g. navigation, buttons, forms (done), etc.)
- [ ] Move preprocess functions into .inc files and out of .theme
- [ ] Better way to handle Materialize CSS overrides
- [ ] Remove Classy as a parent theme entirely?
- [ ] Prod deployment packaging (Min, optimize, etc)

## Meta

- Grid: Implement a more structure grid system. The template structure in D8 has basically no notion of grid system. I have started to add in Materialize CSS very light grid system but it's awkward.
