<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link       www.site-zoom.com
 * @since      1.2.5
 * @package    Scratoudisplay
 *
 * @wordpress-plugin
 * Plugin Name:       Scrabble Tournament Display
 * Plugin URI:        http://www.site-zoom.com/project/plugins
 * Description:Display Scrabble Tournaments on Pages with Shortcodes
 * Version:1 . 0 . 0
 * Author:David Okunmuyide
 * Author URI:www.site-zoom.com
 * License:GPL-2.0+
 * License URI:http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:scratoudisplay
 * Domain Path:/languages */

// If this file is called directly, abort.
if ( ! defined('WPINC'))
{
  die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org * Rename this for your plugin and update it as you release new versions .  */
define('SCRATOUDISPLAY_VERSION', '1.0.0');

if ( ! function_exists('vue_log'))
{

  function vue_log($log)
  {

    if (true === WP_DEBUG)
        {

      if (is_array($log) || is_object($log))
            {

        error_log(print_r($log, true));

      }else
            {

        error_log($log);

      }

    }

  }

}

//Register Scripts to use
function func_load_vuescripts()
{
  wp_enqueue_style('bootstrap', plugin_dir_url(__FILE__) . 'assets/css/bootswatch_themes/materia/bootstrap.min.css', []);
  wp_enqueue_style('bootstrap-vue', plugin_dir_url(__FILE__) . 'assets/css/bootstrap-vue.min.css', 'bootstrap');
  wp_enqueue_style('flag-icon', plugin_dir_url(__FILE__) . 'assets/css/flag-icon.min.css', 'bootstrap');
  wp_enqueue_style('font-awesome5', plugin_dir_url(__FILE__) . 'assets/css/font-awesome/css/all.min.css');
  wp_enqueue_style('animatecss', plugin_dir_url(__FILE__) . 'assets/css/animate.min.css');
  wp_enqueue_style('display-scrabble', plugin_dir_url(__FILE__) . 'assets/css/site.css', 'bootstrap');

  // cached version used if possible
  $vuejs = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . 'assets/js/vue.js'));
  wp_register_script('axios', plugins_url('assets/js/axios/axios.js', __FILE__));
  wp_register_script('vue-router', plugin_dir_url(__FILE__) . 'assets/js/vue-router.min.js', 'vuejs', true);
  wp_register_script('vuex', plugin_dir_url(__FILE__) . 'assets/js/vuex.min.js', 'vuejs', true);
  wp_register_script('vuejs', plugin_dir_url(__FILE__) . 'assets/js/vue.js', [], $vuejs);
  wp_register_script('apexCharts', plugins_url('assets/js/apexcharts.min.js', __FILE__), [], $vuejs);
  wp_register_script('vueApexCharts', plugins_url('assets/js/vue-apexcharts.js', __FILE__), [], $vuejs);
 wp_register_script('bootstrap-vue', plugin_dir_url(__FILE__) . 'assets/js/bootstrap-vue.min.js', 'vuejs', true);
 wp_register_script('es6-promise', plugin_dir_url(__FILE__) . 'assets/js/es6-promise.auto.js', 'vuex', true);
 wp_register_script('momentjs', plugin_dir_url(__FILE__) . 'assets/js/moment.min.js', 'vuejs', true);
  wp_register_script('vuex-store', plugin_dir_url(__FILE__) . 'build/store.js', 'vuex', true);
 wp_register_script('dst_main', plugin_dir_url(__FILE__) . 'build/main.js', array('vuejs', 'axios', 'vue-router'), true);
 wp_register_script('tlist', plugin_dir_url(__FILE__) . 'build/pages/list.js', array('vuejs'), true);
  wp_register_script('tdetail', plugin_dir_url(__FILE__) . 'build/pages/detail.js', array('vuejs'), true);
  wp_register_script('catedetail', plugin_dir_url(__FILE__) . 'build/pages/category.js', array('vuejs'), true);
  wp_register_script('players', plugin_dir_url(__FILE__) . 'build/pages/playerlist.js', array('vuejs'), true);
  wp_register_script('stats', plugin_dir_url(__FILE__) . 'build/pages/stats.js', array('vuejs'), true);
  wp_register_script('board', plugin_dir_url(__FILE__) . 'build/pages/scoreboard.js', array('vuejs'), true);
  wp_register_script('performers', plugin_dir_url(__FILE__) . 'build/pages/top.js', array('vuejs'), true);
  wp_register_script('alerts', plugin_dir_url(__FILE__) . 'build/pages/alerts.js', array('vuejs'), true);

  // Enqueue the scripts

  //Add Vue.js
  wp_enqueue_script('vuejs');
  // Add Axios
  wp_enqueue_script('axios');
  // Chart
  wp_enqueue_script('apexCharts');
  wp_enqueue_script('vueApexCharts');
  // Add VueRouter
  wp_enqueue_script('vue-router');
  wp_enqueue_script('vuex');
  wp_enqueue_script('es6-promise');
  wp_enqueue_script('vuex-store');
  wp_enqueue_script('momentjs');
  wp_enqueue_script('bootstrap-vue');


 // Add Components

 wp_enqueue_script('alerts');
 wp_enqueue_script('performers');
 wp_enqueue_script('board');
 wp_enqueue_script('stats');
 wp_enqueue_script('players');
 wp_enqueue_script('catedetail');
 wp_enqueue_script('tdetail');
 wp_enqueue_script('tlist');

  wp_dequeue_script('theme-global-3');
  wp_dequeue_style('font-awesome-css');
  wp_dequeue_style('theme-global-css');
  wp_dequeue_style('ult_core_template_2-css');

 // Add Vue code
  wp_enqueue_script('dst_main');
  $scripts = array(
    'lodash' => plugin_dir_url(__FILE__) . 'assets/js/lodash.min.js',
    'nsflogo' => plugin_dir_url(__FILE__) . 'assets/images/nsflogo.png',
    'noimage' => plugin_dir_url(__FILE__) . 'assets/images/nophoto.jpg',
    'webmaster' => plugin_dir_url(__FILE__) . 'assets/images/me.jpg', );
 $home_url = home_url();
  // Lodash library location dynamically loaded in Vue components
  wp_localize_script('dst_main', 'scriptsLocation', $scripts);
}

add_action('wp_enqueue_scripts', 'func_load_vuescripts');

//Add shortscode
function func_wp_vue()
{
  $str = "<noscript><strong>We're sorry but to view the tournaments section properly you must have JavaScript enabled. Please enable it to continue.</strong></noscript>";

  $str .= "<router-view></router-view>";
  //Return
  return $str;
}// end function

//Add shortcode to WordPress
add_shortcode('tournaments_display', 'func_wp_vue');

add_filter('script_loader_tag', 'add_type_att_to_main_script', 10, 3);

function add_type_att_to_main_script($tag, $handle, $src)
{
  if ('dst_main' === $handle)
    {
      $tag = '<script src="' . esc_url($src) . '" type="module"></script>';
   }
   return $tag;
}


