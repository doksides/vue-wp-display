<?php

/*
 Plugin Name:Scrabble Tournament Display using Vue (Test)
 Plugin URI:http://www.esteloi.com/projects/plugins
 Description:Display Scrabble Tournaments on Pages with Shortcodes
 Version:1.5
 Author:David Okunmuyide
 Author URI:https://www.esteloi.com
License:GPL v2 or later
 License URI:http://www.gnu.org/licenses/gpl-2.0.txt
Text Domain:scratoudisplay
 Domain Path:/languages */

if ( ! defined('WPINC'))
{
  die;
}

define('SCRATOUDISPLAY_VERSION', '1.0.6');
define('SCRATOUDISPLAY_DIR', plugin_dir_path(__FILE__));
define('SCRATOUDISPLAY_TEMPLATE_DIR', SCRATOUDISPLAY_DIR . 'templates/');



//Register Scripts to use
function func_load_vuescripts()
{
  $bootswatch_url = plugin_dir_url(__FILE__) . 'assets/css/bootswatch_themes/materia/bootstrap.min.css';
  $bootstrapVueCss = plugin_dir_url(__FILE__) . 'assets/css/bootstrap-vue.min.css';
  $flagicon_css_url = plugin_dir_url(__FILE__) . 'assets/css/flag-icon.min.css';
  $fa5_url = plugin_dir_url(__FILE__) . 'assets/css/fontawesome-free-5.10.0-web/css/all.min.css';
  $animate_css_url = plugin_dir_url(__FILE__) . 'assets/css/animate.min.css';
  $vue_simple_suggest_css_url = plugin_dir_url(__FILE__) . 'assets/css/vue-simple-suggest.css';
  $main_css = plugin_dir_url(__FILE__) . 'assets/css/site.css';

// Scripts
$vuejs_url = plugin_dir_url(__FILE__) . 'assets/js/vue.js';
$axios_url = plugin_dir_url(__FILE__) . 'assets/js/axios/axios.min.js';
$vue_router_url = plugin_dir_url(__FILE__) . 'assets/js/vue-router.min.js';
$vuex_url = plugin_dir_url(__FILE__) . 'assets/js/vuex.min.js';
$vueSimpleSuggest = plugin_dir_url(__FILE__) . 'assets/js/vue-simple-suggest-iife.js';
$vue2Filters_url = plugin_dir_url(__FILE__) . 'assets/js/vue2-filters.min.js';
$apexChartJs = plugins_url('assets/js/apexcharts.min.js', __FILE__);
$lodash = plugins_url('assets/js/lodash.min.js', __FILE__);
$vueApexCharts = plugins_url('assets/js/vue-apexcharts.js', __FILE__);
$bootstrapVue = plugin_dir_url(__FILE__) . 'assets/js/bootstrap-vue.min.js';
$es6Promise = plugin_dir_url(__FILE__) . 'assets/js/es6-promise.auto.js';
$popperJs = plugin_dir_url(__FILE__) . 'assets/js/popper.min.js';
$momentJs = plugin_dir_url(__FILE__) . 'assets/js/moment.min.js';
$bootstrapVueIcons = plugin_dir_url(__FILE__) . 'assets/js/bootstrap-vue-icons.min.js';
$mainJs = plugin_dir_url(__FILE__) . 'build/main.js';

if (is_single(array('tournament', 'tourney_detail')) || is_singular(array('tournament', 'tourney_detail')) || is_page('tournaments'))
{
wp_enqueue_style('bootswatch', $bootswatch_url);
wp_enqueue_style('bootstrap-vue', $bootstrapVueCss, 'bootstrap');
wp_enqueue_style('flag-icon', $flagicon_css_url, 'bootstrap');
wp_enqueue_style('font-awesome5', $fa5_url);
wp_enqueue_style('animatecss', $animate_css_url);
wp_enqueue_style('vue-simple-suggest', $vue_simple_suggest_css_url);
wp_enqueue_style('display-scrabble', $main_css, 'bootstrap');

wp_register_script('bootstrap-vue-polyfill', 'https://polyfill.io/v3/polyfill.min.js?features=es2015%2CIntersectionObserver', ['bootstrap-vuejs']);
wp_register_script('vuejs', $vuejs_url);
wp_register_script('axios', $axios_url, ['vuejs']);
wp_register_script('vue-router', $vue_router_url, ['vuejs']);
wp_register_script('vuex', $vuex_url, ['vuejs']);
wp_register_script('vueSimpleSuggest', $vueSimpleSuggest, ['vuejs']);
wp_register_script('vue2Filters', $vue2Filters_url, ['vuejs']);
wp_register_script('apexCharts', $apexChartJs, ['vuejs']);
wp_register_script('dst-lodash', $lodash, ['vuejs']);
wp_register_script('vueApexCharts', $vueApexCharts, ['vuejs']);
wp_register_script('bootstrap-vuejs', $bootstrapVue, ['popperjs']);
wp_register_script('es6-promise', $es6Promise, ['vuex'], false, true);
wp_register_script('popperjs', $popperJs, ['vuejs'], false, true);
wp_register_script('momentjs', $momentJs, ['vuejs'], false, true);
wp_register_script('bootstrap-vue-icons', $bootstrapVueIcons, ['vuejs'], false, true);
wp_register_script('dst_main', $mainJs, array( 'vuejs', ));

// Enqueue the scripts

// wp_enqueue_script('bootstrap-vue-polyfill');
wp_dequeue_script('jquery');
wp_enqueue_script('vuejs');
wp_enqueue_script('axios');
wp_enqueue_script('apexCharts');
wp_enqueue_script('vueApexCharts');
wp_enqueue_script('vue-router');
wp_enqueue_script('vue2Filters');
wp_enqueue_script('dst-lodash');
wp_enqueue_script('vuex');
wp_enqueue_script('vueSimpleSuggest');
wp_enqueue_script('es6-promise');
wp_enqueue_script('momentjs');
wp_enqueue_script('popperjs');
wp_enqueue_script('bootstrap-vuejs');
wp_enqueue_script('bootstrap-vue-icons');
wp_enqueue_script('dst_main');
}
else
{
  wp_enqueue_script('jquery');
  wp_dequeue_script('bootstrap-vue-polyfill');
  wp_dequeue_script('vuejs');
  wp_dequeue_script('axios');
  wp_dequeue_script('apexCharts');
  wp_dequeue_script('vueApexCharts');
  wp_dequeue_script('vue-router');
  wp_dequeue_script('vue2Filters');
  wp_dequeue_script('dst-lodash');
  wp_dequeue_script('vuex');
  wp_dequeue_script('vueSimpleSuggest');
  wp_dequeue_script('es6-promise');
  wp_dequeue_script('momentjs');
  wp_dequeue_script('popperjs');
  wp_dequeue_script('bootstrap-vuejs');
  wp_dequeue_script('bootstrap-vue-icons');
  wp_dequeue_script('dst_main');
  // Remove plugin stylesheets
  wp_dequeue_style('bootswatch');
  wp_dequeue_style('bootstrap-vue');
  wp_dequeue_style('flag-icon');
  wp_dequeue_style('animatecss');
  wp_dequeue_style('vue-simple-suggest');
  wp_dequeue_style('display-scrabble');
  }
}

add_action('wp_enqueue_scripts', 'func_load_vuescripts');

//add_filter('template_include', 'scrabtou_custom_templates', 99);

function scrabtou_custom_templates($template)
{

   $new_template = '';

   if (is_page('tournaments'))
    {
     $new_template = 'page-tournaments.php';
    }
    if (is_single('tournament') || is_singular('tournament'))
    {
     $new_template = 'single-tournament.php';
    }
    if (is_single('tourney_detail') || is_singular('tourney_detail'))
     {
      $new_template = 'single-tourney_detail.php';
     }
    $plugin_template = SCRATOUDISPLAY_TEMPLATE_DIR . $new_template;

    if (file_exists($plugin_template))
    {
      return $plugin_template;
    }

  return $template;

}

//Add shortscode
function add_scrabtou_vue_shortcode()
{
   $str = '<noscript>To view the tournaments, you must have JavaScript enabled. Please enable it to continue.</noscript><div id="app">
   <router-view></router-view></div>';
  return $str;
}

//Add shortcode to WordPress
add_shortcode('tournaments_display', 'add_scrabtou_vue_shortcode');

add_filter('script_loader_tag', 'add_type_att_to_main_script', 10, 3);
add_filter('script_loader_tag', 'add_type_att_to_polyfill', 10, 3);

function add_type_att_to_main_script($tag, $handle, $src)
{
  if ('dst_main' === $handle)
    {
      $tag = '<script src="' . esc_url($src) . '" type="module"></script>';
   }
   return $tag;
}

function add_type_att_to_polyfill($tag, $handle, $src)
{
  if ('bootstrap-vue-polyfill' === $handle)
    {
      $tag = '<script src="' . esc_url($src) . '" crossorigin="anonymous"></script>';
   }
   return $tag;
}



