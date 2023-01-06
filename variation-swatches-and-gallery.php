<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://zqe.io
 * @since             1.0.0
 * @package           Variation_Swatches_And_Gallery
 *
 * @wordpress-plugin
 * Plugin Name:       Variation Swatches and Gallery for WooCommerce
 * Plugin URI:        https://zqe.io/variation-swatches-and-gallery
 * Description:       Variation Swatches and Gallery for WooCommerce
 * Version:           1.0.0
 * Author:            ZQE
 * Author URI:        https://zqe.io
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       variation-swatches-and-gallery
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during agendapress activation.
 * This action is documented in vendor/autoload.php
 */
require __DIR__ . '/vendor/autoload.php';

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'VARIATION_SWATCHES_AND_GALLERY_VERSION', '1.0.0' );
define( 'VARIATION_SWATCHES_AND_GALLERY_DEBUG', false );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-variation-swatches-and-gallery-activator.php
 */
function activate_variation_swatches_and_gallery() {
	\Zqe\Variation_Swatches_And_Gallery_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-variation-swatches-and-gallery-deactivator.php
 */
function deactivate_variation_swatches_and_gallery() {
	\Zqe\Variation_Swatches_And_Gallery_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_variation_swatches_and_gallery' );
register_deactivation_hook( __FILE__, 'deactivate_variation_swatches_and_gallery' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_variation_swatches_and_gallery() {
	$plugin = new \Zqe\Variation_Swatches_And_Gallery();
	$plugin->run();
}
add_action( 'plugins_loaded', 'run_variation_swatches_and_gallery', 25 );
