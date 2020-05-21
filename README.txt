=== Plugin Name ===
Contributors: (this should be a list of wordpress.org userid's)
Donate link: www.david-ok.com
Tags: vuejs, wpapi, display,scrabble
Requires at least: 3.0.1
Tested up to: 3.4
Stable tag: 4.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Display Scrabble Tournaments on WP pages with Vue.js using a single shortcode.
_This is a custom plugin_ and will not work on all WP installs as it requires several customisations, creation of several Custom Post Types and some additional plugins (Scrabble Tou CPT and Pods - Custom Content Types and Fields https://pods.io/) to work. Scrabble Tou CPT is a custom plugin.
== Description ==

Displays Scrabble Tournaments on WP pages with Vue.js using a single shortcode **[tournaments_display]**. Data is fetched through the WP REST API. The Vue template files and vue store are concatenated and converted from ES6 by building them with grunt during development. The final (required) build js file (main.js) is in the /build folder. Assets folder contains the required js, css, images and fonts used in the frontend. This plugin requires three directories in the wp-content directory: 1. Player images/photo folder 2. Event photos 3. Json data files . These folders are created automatically on install of the accompanying plugin (Scrabble Tou CPT). The image folder should be manually populated with player's photo and named in this manner Firstname-Surname.jpg (e.g Bob-James.jpg). POD Custom Post Type (CPT) plugin is required to create 'Players', 'Tournaments' and 'Tournament-Details' CPT. Also a custom taxonomy'Tournament Categories' is required. Some data manipulation and calculations are done in the custom (accompanying) plugin. This plugin further analyse and displays the Scrabble tournament data and stats in a nice and pleasing (easy to navigate) manner.

