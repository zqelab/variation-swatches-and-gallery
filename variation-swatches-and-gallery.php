<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the admin area.
 * It includes all dependencies, registers activation/deactivation hooks, and starts the plugin.
 *
 * @link              https://zqe.io
 * @since             1.0.0
 * @package           Variation_Swatches_And_Gallery
 *
 * @wordpress-plugin
 * Plugin Name:       Variation Swatches and Gallery for WooCommerce
 * Plugin URI:        https://zqe.io/variation-swatches-and-gallery
 * Description:       Variation Swatches and Gallery for WooCommerce
 * Version:           1.0.5
 * Author:            ZQE
 * Author URI:        https://zqe.io
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       variation-swatches-and-gallery
 * Domain Path:       /languages
 */

/**
 * Autoload dependencies using Composer.
 *
 * Throws an error if the autoload file is not found to ensure the plugin
 * cannot run without required dependencies.
 *
 * @throws RuntimeException If the autoload file is missing.
 */
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    throw new RuntimeException('Composer autoload file not found. Please run "composer install".');
}

require_once __DIR__ . '/vendor/autoload.php';

/**
 * Initialize Freemius SDK.
 */
if ( ! function_exists( 'vsg_fs' ) ) {
    /**
     * Create a helper function for easy SDK access.
     *
     * @since 1.0.0
     * @return object Freemius SDK instance.
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

    // Initialize Freemius.
    vsg_fs();

    // Signal that the SDK was initiated.
    do_action( 'vsg_fs_loaded' );
}

/**
 * Define plugin constants.
 *
 * @since 1.0.0
 */
define( 'VARIATION_SWATCHES_AND_GALLERY_VERSION', '1.0.5' );

/**
 * Registers the plugin's activation hook.
 *
 * This uses an arrow function for concise activation logic. However, for
 * improved debugging and maintainability, using a named function is generally
 * recommended (see example below).
 *
 * @since 1.0.0
 */
register_activation_hook( __FILE__, fn() => \Zqe\Variation_Swatches_And_Gallery_Activator::activate() );

/**
 * Registers the plugin's deactivation hook.
 *
 * This uses an arrow function for concise deactivation logic. While concise,
 * using a named function is generally recommended for deactivation hooks due to
 * improved debugging and documentation possibilities.
 *
 * @since 1.0.0
 */
register_deactivation_hook( __FILE__, fn() => \Zqe\Variation_Swatches_And_Gallery_Deactivator::deactivate() );

/**
 * Initializes and runs theVariation Swatches and Gallery for WooCommerce plugin (using an arrow function).
 * This is the most concise way for simple initialization tasks.
 *
 * @since 1.0.
 */
add_action( 'plugins_loaded', fn() => ( new \Zqe\Variation_Swatches_And_Gallery() )->run(), 25 );