<?php

/*
 Plugin Name:Scrabble Tournament Display
 Plugin URI:http://www.site-zoom.com/projects/plugins
 Description:Display Scrabble Tournaments on Pages with Shortcodes
 Version:1.4
 Author:David Okunmuyide
 Author URI:https://www.esteloi.com
 License:GPL v2 or later
 License URI:http://www.gnu.org/licenses/gpl-2.0.txt
 Text Domain:scratoudisplay
 Domain Path:/languages
 */


 // If this file is called directly, abort.
if ( ! defined('WPINC'))
{
  die;
}

define('SCRATOUDISPLAY_VERSION', '1.0.6');
define('SCRATOUDISPLAY_DIR', plugin_dir_path(__FILE__));
define('SCRATOUDISPLAY_TEMPLATE_DIR', plugin_dir_path(__FILE__) . 'templates/');

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
// vue_log(SCRATOUDISPLAY_TEMPLATE_DIR);

//Register Scripts to use
function func_load_vuescripts()
{
  wp_enqueue_style('bootstrap', plugin_dir_url(__FILE__) . 'assets/css/bootswatch_themes/materia/bootstrap.min.css', []);
  // Bootstrap-Vue CSS //unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css
  wp_enqueue_style('bootstrap-vue', plugin_dir_url(__FILE__) . 'assets/css/bootstrap-vue.min.css', 'bootstrap');
  wp_enqueue_style('flag-icon', plugin_dir_url(__FILE__) . 'assets/css/flag-icon.min.css', 'bootstrap');
  wp_enqueue_style('font-awesome5', plugin_dir_url(__FILE__) . 'assets/css/font-awesome/css/all.min.css');
  wp_enqueue_style('animatecss', plugin_dir_url(__FILE__) . 'assets/css/animate.min.css');
  wp_enqueue_style('vue-simple-suggest', plugin_dir_url(__FILE__) . 'assets/css/vue-simple-suggest.css');
  wp_enqueue_style('display-scrabble', plugin_dir_url(__FILE__) . 'assets/css/site.css', 'bootstrap');

  // cached version used if possible
  wp_register_script('bootstrap-vue-polyfill', '//polyfill.io/v3/polyfill.min.js?features=es2015%2CIntersectionObserver', 'bootstrap-vuejs', false);
  // Vue.js //unpkg.com/vue@latest/dist/vue.min.js
$vuejs = date("ymd-Gis", filemtime(plugin_dir_path(__FILE__) . 'assets/js/vue.js'));
  wp_register_script('axios', plugins_url('assets/js/axios/axios.js', __FILE__));
  wp_register_script('vue-router', plugin_dir_url(__FILE__) . 'assets/js/vue-router.min.js', [$vuejs]);
  wp_register_script('vuex', plugin_dir_url(__FILE__) . 'assets/js/vuex.min.js', [$vuejs]);
  wp_register_script('vuejs', plugin_dir_url(__FILE__) . 'assets/js/vue.js');
  // Vue Simple-suggest js
  // https://unpkg.com/vue-simple-suggest/dist/iife.js
  wp_register_script('vueSimpleSuggest', plugin_dir_url(__FILE__) . 'assets/js/vue-simple-suggest-iife.js',  [$vuejs]);
  // Vue 2 Filters
  // https://cdn.jsdelivr.net/npm/vue2-filters/dist/vue2-filters.min.js
  wp_register_script('vue2Filters', plugins_url('assets/js/vue2-filters.min.js', __FILE__),  [$vuejs]);
  wp_register_script('apexCharts', plugins_url('assets/js/apexcharts.min.js', __FILE__),  [$vuejs]);
  wp_register_script('dst-lodash', plugins_url('assets/js/lodash.min.js', __FILE__),[$vuejs]);
  wp_register_script('vueApexCharts', plugins_url('assets/js/vue-apexcharts.js', __FILE__),  [$vuejs]);
  //Bootstrap-Vue //unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js
  wp_register_script('bootstrap-vuejs', plugin_dir_url(__FILE__) . 'assets/js/bootstrap-vue.min.js', 'popperjs', true);
wp_register_script('es6-promise', plugin_dir_url(__FILE__) . 'assets/js/es6-promise.auto.js', 'vuex', true);
  wp_register_script('popperjs', plugin_dir_url(__FILE__) . 'assets/js/popper.min.js', 'vuejs', true);
 wp_register_script('momentjs', plugin_dir_url(__FILE__) . 'assets/js/moment.min.js', 'vuejs', true);
 // Bootstrap-Vue-Icons //unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.js
 wp_register_script('bootstrap-vue-icons', plugin_dir_url(__FILE__) . 'assets/js/bootstrap-vue-icons.min.js', 'vuejs', true);
   wp_register_script('dst_main', plugin_dir_url(__FILE__) . 'build/main.js', array('vuejs', 'axios', 'vue-router'), true);
  // Enqueue the scripts

  //Add Vue.js
  wp_enqueue_script('bootstrap-vue-polyfill');
  wp_enqueue_script('vuejs');
  // Add Axios
  wp_enqueue_script('axios');
  // Animation
  // wp_enqueue_script('velocityjs');
  // Chart
  wp_enqueue_script('apexCharts');
  wp_enqueue_script('vueApexCharts');
  // Add VueRouter
  wp_enqueue_script('vue-router');
  wp_enqueue_script('vue2Filters');
  wp_enqueue_script('vuex');
  wp_enqueue_script('vueSimpleSuggest');
  wp_enqueue_script('es6-promise');
  wp_enqueue_script('momentjs');
  wp_enqueue_script('popperjs');
  wp_enqueue_script('bootstrap-vuejs');
  wp_enqueue_script('bootstrap-vue-icons');
  wp_enqueue_script('dst-lodash');

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
  //wp_localize_script('dst_main', 'scriptsLocation', $scripts);
}

add_filter('template_include', 'scrabtou_custom_templates', 99);
add_action('wp_enqueue_scripts', 'func_load_vuescripts');

/*
 // Disable WordPress automatic plugin update check

function scrabtou_hidden_plugin_12345($r, $url)
{
	if (0 !== strpos($url, 'http://api.wordpress.org/plugins/update-check' ) )
		return $r; // Not a plugin update request. Bail immediately.
	$plugins = unserialize($r['body']['plugins']);
	unset($plugins - > plugins[ plugin_basename(__FILE__)]);
	unset($plugins - > active[ array_search(plugin_basename(__FILE__), $plugins - > active)]);
	$r['body']['plugins'] = serialize($plugins);
	return $r;
}

add_filter('http_request_args', 'scrabtou_hidden_plugin_12345', 5, 2);

*/

function scrabtou_custom_templates($template)
{
  //  vue_log(get_post());

   $new_template = '';

   if (is_page('tournaments'))
    {
     $new_template = 'page-tournaments.php';
    }
   if (is_page('scorecards'))
    {
     $new_template = 'page-scorecards.php';
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
  $str = "<noscript><strong>We're sorry but to view the tournaments section properly you must have JavaScript enabled. Please enable it to continue.</strong></noscript><router-view></router-view>";
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



