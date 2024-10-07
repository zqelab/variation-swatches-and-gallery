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
 * Version:           1.0.3
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

// freemius.
if ( ! function_exists( 'vsg_fs' ) ) {
	/**
	 * Create a helper function for easy SDK access.
	 */
	function vsg_fs() {
		global $vsg_fs;

		if ( ! isset( $vsg_fs ) ) {
			// Activate multisite network integration.
			if ( ! defined( 'WP_FS__PRODUCT_11789_MULTISITE' ) ) {
				define( 'WP_FS__PRODUCT_11789_MULTISITE', true );
			}

			// Include Freemius SDK.
			require_once __DIR__ . '/freemius/start.php';

			$vsg_fs = fs_dynamic_init(
				array(
					'id'             => '11789',
					'slug'           => 'variation-swatches-and-gallery',
					'type'           => 'plugin',
					'public_key'     => 'pk_7a21b9ce7016553430b9df4a42b85',
					'is_premium'     => false,
					'has_addons'     => true,
					'has_paid_plans' => false,
					'menu'           => array(
						'slug'       => 'variation-swatches-and-gallery',
						'first-path' => 'admin.php?page=variation-swatches-and-gallery',
					),
				)
			);
		}

		return $vsg_fs;
	}

	// Init Freemius.
	vsg_fs();
	// Signal that SDK was initiated.
	do_action( 'vsg_fs_loaded' );
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'VARIATION_SWATCHES_AND_GALLERY_VERSION', '1.0.3' );

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
