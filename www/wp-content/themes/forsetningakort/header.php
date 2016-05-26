<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Forsetningakort
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,400italic|Lora" rel="stylesheet" type="text/css">

<script type="text/javascript">
	siteRoot = "<?php echo get_site_url(); ?>";
</script>
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php if (is_page_template ('map-page.php')) { ?>

<div id="appView">
	<div class="map-view"></div>

	<div class="map-intro map-window">
		<?php dynamic_sidebar( 'map-intro' ); ?>
		<div class="intro-button close-button"><a class="button button-primary">Opna kort</a></div>
	</div>

	<div class="map-menu">
		<h1 class="menu-header"><span>Allt á sér stað: Íslandskort með forsetningum</span></h1>

		<a href="<?php echo get_site_url(); ?>" class="back-link"><span class="icon icon-left-arrow"></span>Til baka</a>

		<div class="menu-tabs">
			<a data-action="all" class="selected">Allir staðir</a>
			<a data-action="advanced">Þekjur</a>
		</div>

		<div class="menu-filters menu-content"></div>

	</div>

	<div class="info-popup map-window hidden">
		<div class="layer-place-list"></div>
	</div>

	<div class="map-footer">
		<p><strong>Stofnun Árna Magnússonar í íslenskum fræðum</strong></p>
	</div>
</div>

<?php } else { ?>

<div class="header">
	<h1 class="site-logo"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><span><?php bloginfo( 'name' ); ?></span></a></h1>
</div>
<div class="main-wrapper">

	<div class="container">
		
		<div class="row">
			<div class="eight columns">

				<div class="background"></div>

				<div class="col-content">

					<nav id="site-navigation" class="main-navigation" role="navigation">
						<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
					</nav>

<?php } ?>