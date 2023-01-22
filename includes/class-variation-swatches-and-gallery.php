<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://zqe.io
 * @since      1.0.0
 *
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/includes
 */

namespace Zqe;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/includes
 * @author     ZQE <dev@zqe.io>
 */
class Variation_Swatches_And_Gallery {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      \Zqe\Variation_Swatches_And_Gallery_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The option that's responsible for maintaining all code necessary to manage options/settings of
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      \Zqe\Variation_Swatches_And_Gallery_Option    $option    Maintains all code necessary to manage plugin option.
	 */
	protected $option;

	/**
	 * The helper that's responsible for maintaining necessary helper functions used on
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      \Zqe\Variation_Swatches_And_Gallery_Helper    $helper    All necessary helper functions used on the plugin.
	 */
	protected $helper;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'VARIATION_SWATCHES_AND_GALLERY_VERSION' ) ) {
			$this->version = VARIATION_SWATCHES_AND_GALLERY_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'variation-swatches-and-gallery';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		$this->loader = new \Zqe\Variation_Swatches_And_Gallery_Loader();
		$this->option = new \Zqe\Variation_Swatches_And_Gallery_Option();
		$this->helper = new \Zqe\Variation_Swatches_And_Gallery_Helper();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Variation_Swatches_And_Gallery_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new \Zqe\Variation_Swatches_And_Gallery_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new \Zqe\Variation_Swatches_And_Gallery_Admin( $this );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'settings_menu' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'settings_init' );
		$this->loader->add_filter( 'product_attributes_type_selector', $plugin_admin, 'product_attributes_type_selector_filter' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'add_attribute_meta' );

		$this->loader->add_action( 'woocommerce_product_option_terms', $plugin_admin, 'woocommerce_product_option_terms_action', 10, 3 );
		$this->loader->add_filter( 'zqe_manage_edit_taxonomy_columns', $plugin_admin, 'zqe_manage_edit_taxonomy_columns_filter', 10, 1 );
		$this->loader->add_filter( 'zqe_manage_taxonomy_custom_column', $plugin_admin, 'zqe_manage_taxonomy_custom_column_filter', 10, 3 );
		$this->loader->add_action( 'woocommerce_after_edit_attribute_fields', $plugin_admin, 'woocommerce_after_edit_attribute_fields_action' );
		$this->loader->add_action( 'woocommerce_product_after_variable_attributes', $plugin_admin, 'woocommerce_product_after_variable_attributes_action', 10, 3 );
		$this->loader->add_action( 'admin_footer', $plugin_admin, 'admin_footer_action' );
		$this->loader->add_action( 'woocommerce_save_product_variation', $plugin_admin, 'woocommerce_save_product_variation_action', 10, 2 );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new \Zqe\Variation_Swatches_And_Gallery_Public( $this );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		$this->loader->add_action( 'body_class', $plugin_public, 'body_class_action', 10, 1 );
		$this->loader->add_filter( 'woocommerce_dropdown_variation_attribute_options_html', $plugin_public, 'woocommerce_dropdown_variation_attribute_options_html_filter', 10, 2 );
		$this->loader->add_filter( 'woocommerce_variation_is_active', $plugin_public, 'woocommerce_variation_is_active_filter', 10, 2 );
		$this->loader->add_filter( 'woocommerce_available_variation', $plugin_public, 'woocommerce_available_variation_filter', 10, 3 );
		$this->loader->add_filter( 'woocommerce_ajax_variation_threshold', $plugin_public, 'woocommerce_ajax_variation_threshold_filter' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    \Zqe\Variation_Swatches_And_Gallery_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * The reference to the class that manage all the plugin settings/options.
	 *
	 * @since     1.0.0
	 * @return    \Zqe\Variation_Swatches_And_Gallery_Option    Manage all the plugin settings/options.
	 */
	public function get_option() {
		return $this->option;
	}

	/**
	 * The reference to the class that contains all helper functions used on plugin.
	 *
	 * @since     1.0.0
	 * @return    \Zqe\Variation_Swatches_And_Gallery_Helper    Contains all helper functions used on plugin.
	 */
	public function get_helper() {
		return $this->helper;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
