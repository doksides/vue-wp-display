<?php

/**
 *
 * This file is a custom header file
 *
 * @package  WP-NSFTourneyApp
 * @author   David Okunmuyide https://www.esteloi.com
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     http://esteloi.com
 * @version 1.21
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Tournaments | Nigeria Scrabble Federation</title>
	<?php wp_head(); ?>
</head>
<body>
<!--This is the vue template-->

<?php
$the_query = new WP_Query('pagename=tournaments');
while ($the_query-> have_posts()):
    $the_query-> the_post();
    the_content();
endwhile;
/* Restore original Post Data */
wp_reset_postdata();
 /** Footer */ ?>
<div id="footer">
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <p class="w-75 p-5 mx-auto my-5">Scrabble &copy; is a registered trademark. All intellectual property rights in and to the game are owned in the U.S.A
          and Canada by Hasbro Inc., and throughout the rest of the world by J.W. Spear & Sons Limited of Maidenhead, Berkshire,
          England, a subsidiary of Mattel Inc.
        </p>
      </div>
    </div>
  </div>
</div>
<?php
wp_footer();
?>
</body>
</html>