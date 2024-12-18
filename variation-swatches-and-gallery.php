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
 * Version:           1.0.4
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
 * Autoload dependencies using Composer.
 */
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
 * Plugin version.
 *
 * @since 1.0.0
 */
define( 'VARIATION_SWATCHES_AND_GALLERY_VERSION', '1.0.4' );

/**
 * The code that runs during plugin activation.
 *
 * @since 1.0.0
 */
function activate_variation_swatches_and_gallery() {
    \Zqe\Variation_Swatches_And_Gallery_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 *
 * @since 1.0.0
 */
function deactivate_variation_swatches_and_gallery() {
    \Zqe\Variation_Swatches_And_Gallery_Deactivator::deactivate();
}

// Register activation and deactivation hooks.
register_activation_hook( __FILE__, 'activate_variation_swatches_and_gallery' );
register_deactivation_hook( __FILE__, 'deactivate_variation_swatches_and_gallery' );

/**
 * Begins execution of the plugin.
 *
 * @since 1.0.0
 */
function run_variation_swatches_and_gallery() {
    // Initialize the core plugin class.
    $plugin = new \Zqe\Variation_Swatches_And_Gallery();
    $plugin->run();
}

// Hook to run the plugin after all plugins are loaded.
add_action( 'plugins_loaded', 'run_variation_swatches_and_gallery', 25 );


add_action('add_meta_boxes', function () {
    add_meta_box(
        'product_meta_display',
        __('Product Meta Data', 'textdomain'),
        function ($post) {
            $meta_data = get_post_meta($post->ID);

            if (!empty($meta_data)) {
                echo '<div style="overflow-x: auto;">';
                echo '<table class="widefat striped" style="max-width: 100%;">';
                echo '<thead><tr><th style="width: 30%;">' . __('Meta Key', 'textdomain') . '</th><th>' . __('Meta Value', 'textdomain') . '</th></tr></thead>';
                echo '<tbody>';

                foreach ($meta_data as $key => $value) {
                    echo '<tr>';
                    echo '<td><strong>' . esc_html($key) . '</strong></td>';
                    echo '<td><pre style="white-space: pre-wrap; word-wrap: break-word;">' . esc_html(print_r(get_post_meta($post->ID, $key), true)) . '</pre></td>';
                    echo '</tr>';
                }

                echo '</tbody>';
                echo '</table>';
                echo '</div>';
            } else {
                echo '<p>' . __('No meta data found for this product.', 'textdomain') . '</p>';
            }
        },
        'product',
        'normal',
        'high'
    );
});
