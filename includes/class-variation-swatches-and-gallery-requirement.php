<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/zqelab
 * @since      1.0.0
 *
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/admin
 */

namespace Zqe;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/admin
 * @author     ZQE <dev@zqe.io>
 */
class Variation_Swatches_And_Gallery_Requirement {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      \Zqe\Variation_Swatches_And_Gallery    $plugin    The ID of this plugin.
	 */
	private $plugin;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      \Zqe\Variation_Swatches_And_Gallery $plugin The name of this plugin.
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
	}


	/**
	 * If the current PHP version is greater than or equal to 5.6.0, return true.
	 *
	 * @return bool The function is_required_php_version() is returning a boolean value.
	 *
	 * @since    1.0.0
	 */
	public function is_required_php_version() {
		return version_compare( PHP_VERSION, '5.6.0', '>=' );
	}

	/**
	 * If the WooCommerce class exists, return true. Otherwise, return false.
	 *
	 * @since    1.0.0
	 */
	public function is_wc_active() {
		return class_exists( 'WooCommerce' );
	}

	/**
	 * If the WooCommerce version is greater than 3.2, return true
	 *
	 * @since    1.0.0
	 */
	public function is_required_wc_version() {
		return version_compare( WC_VERSION, '3.2', '>' );
	}

	/**
	 * If the PHP version is not 5.6 or higher, display a notice
	 *
	 * @since    1.0.0
	 */
	public function php_requirement_notice() {

		if ( ! $this->is_required_php_version() ) {

			$class   = 'notice notice-error';
			$text    = esc_html__( 'Please check PHP version requirement.', 'variable-product-swatches' );
			$link    = esc_url( 'https://docs.woocommerce.com/document/server-requirements/' );
			$message = wp_kses(
				__( 'It\'s required to use latest version of PHP to use <strong>Variation Swatches for WooCommerce</strong>.', 'variable-product-swatches' ),
				array( 'strong' => array() )
			);

			printf(
				'<div class="%1$s"><p>%2$s <a target="_blank" href="%3$s">%4$s</a></p></div>',
				esc_attr( $class ),
				esc_html( $message ),
				esc_attr( $link ),
				esc_html( $text )
			);
		}
	}

	/**
	 * If WooCommerce is not active, display a notice that says "Variation Swatches for WooCommerce is an
	 * add-on of WooCommerce" and link to the WooCommerce plugin page
	 *
	 * @since    1.0.0
	 */
	public function wc_requirement_notice() {

		if ( ! $this->is_wc_active() ) {

			$class = 'notice notice-error';
			$text  = esc_html__( 'WooCommerce', 'variable-product-swatches' );
			$link  = esc_url(
				add_query_arg(
					array(
						'tab'       => 'plugin-information',
						'plugin'    => 'woocommerce',
						'TB_iframe' => 'true',
						'width'     => '640',
						'height'    => '500',
					),
					admin_url( 'plugin-install.php' )
				)
			);

			$message = wp_kses(
				__( '<strong>Variation Swatches for WooCommerce</strong> is an add-on of ', 'variable-product-swatches' ),
				array(
					'strong' => array(),
				)
			);

			printf(
				'<div class="%1$s"><p>%2$s <a class="thickbox open-plugin-details-modal" href="%3$s"><strong>%4$s</strong></a></p></div>',
				esc_attr( $class ),
				esc_html( $message ),
				esc_attr( $link ),
				esc_html( $text )
			);
		}
	}

	/**
	 * If WooCommerce is active and the version is less than 3.0, display a notice
	 *
	 * @since    1.0.0
	 */
	public function wc_version_requirement_notice() {

		if ( $this->is_wc_active() && ! $this->is_required_wc_version() ) {

			$class   = 'notice notice-error';
			$message = sprintf(
				/* translators: %s: search term */
				esc_html__( 'Currently, you are using older version of WooCommerce. It\'s recommended to use latest version of WooCommerce to work with %s.', 'variable-product-swatches' ),
				esc_html__( 'Variation Swatches for WooCommerce', 'variable-product-swatches' )
			);

			printf(
				'<div class="%1$s"><p><strong>%2$s</strong></p></div>',
				esc_attr( $class ),
				esc_html( $message )
			);
		}
	}
}
