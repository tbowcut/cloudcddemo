# Acquia Demo Framework (DF + Proprietary Assets)
[![Build Status](https://magnum.travis-ci.com/acquia/demo_framework.svg?token=fkKCDWeX7fUCfybPUjJb&branch=8.x)](https://magnum.travis-ci.com/acquia/demo_framework)

## PRIVATE BUILD FOR ACQUIA USE ONLY 
### -- DO NOT SHARE THIS CODE!

This repository is used for development of our proprietary Drupal demo.

You may not share this code with anyone outside Acquia. Neither partners nor clients may have access.

Acquia Demo Framework is powered by the open source [Demo Framework](https://www.drupal.org/project/df).

### Installation

Demo Framework requires **Drush 8.1.2 or higher** (ref: https://github.com/drush-ops/drush/pull/2124)

Download a [pre-built tarball](http://j.mp/acquia-latest-demo-build) of the latest stable release.

To build a copy of the Acquia Demo Framework from source using composer.

  ``composer install``

Composer will combine all the private Acquia files with the open source version of Demo Framework from Drupal.org.

A build script is also provided that wraps the composer install command and moves everything into a target directory as well.

  ``./build.sh ~/Destination``

You can add in commands for composer here. We do NOT suggest using the --no-dev option unless you are managing the dev dependencies globally. Other commands, such as --prefer-dist are valid and may help depending on your situation.

  ``./build.sh ~/Destination``

At this point, you will need to prepare your settings.php file just as you would for a normal Drupal install.

We recommend Acquia Dev Desktop running ``PHP 5_6`` and using the ``Import local Drupal site...`` function.

Now use the ``site-install`` command to install Drupal with the DF installation profile.

  ``drush si df``

Enable a DF Scenario using the ``enable-scenario`` command.

  ``drush es dfs_tec``

If everything worked correctly, you should see console output that some migrations ran.

You may now login to your site.

  ``drush uli -l http://mysite.dd``

You may also reset the content of a DF Scenario if it is enabled.

  ``drush rs dfs_tec``

#### Fast install using the install.sh script to get both DF and a scenario quickly. 

After installing Acquia Demo Framework via Composer or build.sh, you may use the install script to simplify the installation of the site and enablement of a scenario.

  ``./install.sh ~/Destination dfs_fin``
  
### Packaging a Demo Framework site for distribution via tarball

If you need to package your current working demo (usually a local site) as a tarball (usually to push to cloud) - use package.sh

  ``./package.sh ~/Dir my_demo``
  
A directory (``~/Dir``) with a docroot and vendor inside is packaged alongside the database in a tar.gz file.

The second argument (``my_demo``) can be anything. This string will be used for the name of the tarball.

For example, if your site's docroot is at ``~/Sites/devdesktop/dfd8/docroot`` then you would run ``sh package.sh ~/Sites/devdesktop/dfd8 my_demo`` and the script would output a file called ``my_demo-MM-DD-YY.tar.gz``.

### Deploying a Demo Framework site from local to Acquia Cloud

We provide an autobahn.sh script that will both package and deploy your local Demo Framework instance. Usage is similar to package.sh.

This script must be run inside the top level project directory that contains your docroot and vendor directories. (e.g., ~/Sites/devdesktop/dfd8)

  ``./autobahn.sh $PWD mycloudsubname``

WARNING: This script uses the Cloud Demo Script and it will attempt to completely overwrite an existing Acquia Cloud environment with a copy of your local.

For more information, see: https://github.com/acquia/cloud-demo-script

### Using the Zurb Foundation Sub Theme

To motify the CSS/JS you must use the scss files. You will find various different SCSS files in SCSS directory that root. There are specifc ones for the theme in base & layout. All the variables are set in _settings.scss, you will also be able to override variables there.

To compile scss you will need a few things installed on your machine:
- NPM [IF you need to install](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
- Bower ``npm install -g bower``

Then you will need to run:
- ``npm install``
- ``bower install``

if you need to update the vendor js, I added in some gulp files that make that easy.
- ``gulp copy`` will copy the bower_component files for zurb and motion ui
- ``gulp concat`` will concatenate all the files into a single vendor.all.js file and put it in your js/ folder where its already being called by drupal

Once that is installed, start the gulp file which will watch for scss changes:
- ``npm start``

## Running Tests
These instructions assume you have used Composer to install Lightning. Once you
have it up and running, follow these steps to execute all of Lightning's Behat
tests:

### Behat
    $ cd MYPROJECT
    $ ./bin/drupal behat:init http://YOUR.DF.SITE --merge=../docroot/profiles/df/tests/behat.yml
    $ ./bin/drupal behat:include ../docroot/profiles/df/tests/features --with-subcontexts=../docroot/profiles/df/tests/features/bootstrap --with-subcontexts=../docroot/profiles/df/src/DFExtension/Context
    $ ./bin/behat --config ./docroot/sites/default/files/behat.yml

If necessary, you can edit ```docroot/sites/default/files/behat.yml``` to match
your environment, but generally you will not need to do this.
