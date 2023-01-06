<?php
/**
 * Plugin options management.
 *
 * @link       https://zqe.io
 * @since      1.0.0
 *
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/includes
 */

namespace Zqe;

/**
 * Define the options management functionality.
 *
 * This class defines all code necessary to manage plugin option.
 *
 * @since      1.0.0
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/includes
 * @author     ZQE <dev@zqe.io>
 */
class Variation_Swatches_And_Gallery_Option {

	/**
	 * The core is main cclass to manage options/settings of the plugin.
	 *
	 * @var \Zqe\Wp_Settings_Api $core Maintains and registers all hooks for the plugin.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public $core;

	/**
	 * Option name for the plugin.
	 *
	 * @var string $name    Option name for the plugin.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public $name = 'vsg_option';

	/**
	 * Define the core functionality of the plugin option / settings.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function __construct() {
		$this->core = new \Zqe\Wp_Settings_Api();
		$this->core->set_name( $this->get_name() );
		$this->core->set_pages( $this->get_pages() );
		$this->core->set_defaults();
	}

	/**
	 * Reset plugin option.
	 *
	 * @return    string
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function reset_option() {

		if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_GET['_wpnonce'] ) ), 'reset_vsg_option' ) ) {
			return;
		}
		delete_option( $this->name );
	}

	/**
	 * Get the plugin option / settings name.
	 *
	 * @return    string
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Get an option from the database.
	 *
	 * @param    string $key        The key of the option to get.
	 * @param    mixed  $detault    The default value to return if the option is not set.
	 *
	 * @return    mixed
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function get_option( $key, $detault ) {
		return $this->core->get_option( $key, $detault );
	}

	/**
	 * It returns the options array from the core class.
	 *
	 * @return    mixed The options array.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function get_options() {
		return $this->core->get_options();
	}

	/**
	 * It returns an array of pages, each page contains an array of sections, each section contains an
	 * array of fields
	 *
	 * @return    array An array of pages.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function get_pages() {
		return apply_filters(
			'variation_swatches_and_gallery_option',
			array(
				apply_filters(
					'vsg_option_basic_group',
					array(
						'group'    => 'basic_group',
						'id'       => 'basic',
						'title'    => 'General',
						'sections' => array(
							array(
								'id'     => 'button',
								'title'  => 'Button Swatch',
								'desc'   => 'Button visual styles',
								'fields' => array(
									array(
										'id'      => 'button_swatch_default',
										'title'   => __( 'Button Swatch as Default', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Convert default dropdowns to button', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => 'on',
									),
								),
							),
							array(
								'id'     => 'image',
								'title'  => 'Image Swatch',
								'desc'   => 'Image visual styles',
								'fields' => array(
									array(
										'id'      => 'image_swatch_default',
										'title'   => __( 'Image Swatch as Default ', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Convert default dropdowns to image if variation has an image.', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => 'on',
									),
									array(
										'id'         => 'image_swatch_default_attribute',
										'title'      => __( 'Default Image Attribute', 'variation-swatches-and-gallery' ),
										'type'       => 'select',
										'default'    => '__first',
										'dependency' => array(
											'image_swatch_default' => array(
												'type'  => '===',
												'value' => 'on',
											),
										),
										'options'    => array(
											'__first' => 'First attribute',
											'__max'   => 'Maximum attribute',
											'__min'   => 'Minimum attribute',
											'__last'  => 'Last attribute',
										),
									),
									array(
										'id'      => 'image_swatch_thumbnail_size',
										'title'   => __( 'Image Swatch Size ', 'variation-swatches-and-gallery' ),
										'type'    => 'select',
										'default' => 'thumbnail',
										'options' => $this->get_all_image_sizes(),
									),
								),
							),

						),
					),
				),
				apply_filters(
					'vsg_option_advanced_group',
					array(
						'id'       => 'advanced',
						'title'    => 'Advanced',
						'group'    => 'advanced_group',
						'sections' => array(
							array(
								'id'     => 'default',
								'title'  => 'Visual Section',
								'desc'   => 'Advanced change some visual styles',
								'fields' => array(
									array(
										'id'      => 'disabled_variation_behavior',
										'title'   => __( 'Disabled Swatch Behavior', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Disabled attribute will be hide / blur.', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'blur-cross',
										'options' => array(
											'blur-cross' => __( 'Blur with cross', 'variation-swatches-and-gallery' ),
											'blur-no-cross' => __( 'Blur without cross', 'variation-swatches-and-gallery' ),
											'hide'       => __( 'Hide', 'variation-swatches-and-gallery' ),
										),
									),
									array(
										'id'      => 'clickable_disabled_variation_attribute',
										'title'   => __( 'Clickable Disabled Variation', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Enable click disable variation label beside the attribute label.', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => '',
									),
									array(
										'id'      => 'clear_on_reselect',
										'title'   => __( 'Clear Selected Variation', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Clear selected variation on click.', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => '',
									),

									array(
										'id'      => 'tooltip',
										'title'   => __( 'Enable Tooltip', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Enable tooltip on each product attribute.', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => 'on',
									),
									array(
										'id'      => 'tooltip_placement',
										'title'   => __( 'Tooltip Placement', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Tooltip placement position. Applicable for image and color', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'top',
										'options' => array(
											'top'    => 'Top',
											'bottom' => 'Bottom',
										),
									),
								),
							),
							array(
								'id'     => 'ajax_section',
								'title'  => 'Ajax Section',
								'desc'   => 'Advanced change some visual styles',
								'fields' => array(
									array(
										'id'      => 'threshold',
										'title'   => __( 'Ajax Variation Threshold', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Control the number of enable ajax variation threshold', 'variation-swatches-and-gallery' ),
										'type'    => 'number',
										'default' => '30',
									),
									array(
										'id'      => 'stockcount',
										'title'   => __( 'Show Variation Stock', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Show each variation stock and update according selected combination', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => '',
									),
								),
							),
						),
					)
				),
				apply_filters(
					'vsg_option_single_group',
					array(
						'id'       => 'single',
						'title'    => 'Single / Product',
						'group'    => 'single_group',
						'sections' => array(
							array(
								'id'     => 'default',
								'title'  => 'Product Single Page - Visual Section',
								'desc'   => 'Advanced change some visual styles',
								'fields' => array(
									array(
										'id'      => 'selected_variation_attribute_label',
										'title'   => __( 'Show Selected Variation Attribute Label', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Show selected variation label beside the attribute label.', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => '',
									),
									array(
										'id'      => 'label_separator',
										'title'   => __( 'Label Separator', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute and variation label separator', 'variation-swatches-and-gallery' ),
										'type'    => 'text',
										'default' => ':',
									),
								),
							),
							array(
								'id'     => 'button',
								'title'  => 'Button Swatch',
								'desc'   => 'Button visual styles',
								'fields' => array(
									array(
										'id'      => 'button_swatch_style',
										'title'   => __( 'Button Shape', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute shape for button.', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'rounded',
										'options' => array(
											'circle'  => 'Circle Shape',
											'rounded' => 'Rounded Shape',
											'squared' => 'Squared Shape',
										),
									),
									array(
										'id'      => 'button_swatch_display',
										'title'   => __( 'Button Display Style', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute display style for button', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'inline',
										'options' => array(
											'inline' => 'Inline',
											'block'  => 'Block',
										),
									),
								),
							),
							array(
								'id'     => 'image',
								'title'  => 'Image Swatch',
								'desc'   => 'Image visual styles',
								'fields' => array(
									array(
										'id'      => 'image_swatch_width',
										'title'   => __( 'Swatch Width', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Swatch width', 'variation-swatches-and-gallery' ),
										'type'    => 'number',
										'size'    => 'small',
										'default' => '50',
										'suffix'  => 'px',
									),
									array(
										'id'      => 'image_swatch_height',
										'title'   => __( 'Swatch Height', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Swatch height', 'variation-swatches-and-gallery' ),
										'type'    => 'number',
										'size'    => 'small',
										'default' => '50',
										'suffix'  => 'px',
									),
									array(
										'id'      => 'image_swatch_style',
										'title'   => __( 'Image Shape', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute shape.', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'rounded',
										'options' => array(
											'circle'  => 'Circle Shape',
											'rounded' => 'Rounded Shape',
											'squared' => 'Squared Shape',
										),
									),
									array(
										'id'      => 'image_swatch_display',
										'title'   => __( 'Image Display Style', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute display style for image', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'inline',
										'options' => array(
											'inline' => 'Inline',
											'block'  => 'Block',
										),
									),
									array(
										'id'      => 'image_swatch_show_label',
										'title'   => __( 'Show Label', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Show swatch label.', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => '',
									),
								),
							),
							array(
								'id'     => 'color',
								'title'  => 'Color Swatch',
								'desc'   => 'Color visual styles',
								'fields' => array(
									array(
										'id'      => 'color_swatch_width',
										'title'   => __( 'Swatch Width', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Swatch width', 'variation-swatches-and-gallery' ),
										'type'    => 'number',
										'size'    => 'small',
										'default' => '30',
										'suffix'  => 'px',
									),
									array(
										'id'      => 'color_swatch_height',
										'title'   => __( 'Swatch Height', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Swatch height.', 'variation-swatches-and-gallery' ),
										'type'    => 'number',
										'size'    => 'small',
										'default' => '30',
										'suffix'  => 'px',
									),
									array(
										'id'      => 'color_swatch_style',
										'title'   => __( 'Color Shape', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute shape.', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'rounded',
										'options' => array(
											'circle'  => 'Circle Shape',
											'rounded' => 'Rounded Shape',
											'squared' => 'Squared Shape',
										),
									),
									array(
										'id'      => 'color_swatch_display',
										'title'   => __( 'Color Display Style', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute display style for color', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'inline',
										'options' => array(
											'inline' => 'Inline',
											'block'  => 'Block',
										),
									),
									array(
										'id'      => 'color_swatch_show_label',
										'title'   => __( 'Show Label', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Show swatch label.', 'variation-swatches-and-gallery' ),
										'type'    => 'checkbox',
										'default' => '',
									),
								),
							),
							array(
								'id'     => 'radio',
								'title'  => 'Radio Swatch',
								'desc'   => 'Radio visual styles',
								'fields' => array(
									array(
										'id'      => 'radio_swatch_style',
										'title'   => __( 'Radio Shape', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute shape.', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'rounded',
										'options' => array(
											'circle'  => 'Circle Shape',
											'rounded' => 'Rounded Shape',
											'squared' => 'Squared Shape',
										),
									),
									array(
										'id'      => 'radio_swatch_display',
										'title'   => __( 'Radio Display Style', 'variation-swatches-and-gallery' ),
										'desc'    => __( 'Attribute display style for radio', 'variation-swatches-and-gallery' ),
										'type'    => 'radio',
										'default' => 'inline',
										'options' => array(
											'inline' => 'Inline',
											'block'  => 'Block',
										),
									),
								),
							),
						),
					),
				),
			),
		);
	}

	/**
	 * It returns an array of all registered image sizes.
	 *
	 * @return    array An array of image sizes.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function get_all_image_sizes() {
		$image_subsizes = wp_get_registered_image_subsizes();
		return array_reduce(
			array_keys( $image_subsizes ),
			function ( $carry, $item ) use ( $image_subsizes ) {
				$title          = ucwords( str_ireplace( array( '-', '_' ), ' ', $item ) );
				$width          = $image_subsizes[ $item ]['width'];
				$height         = $image_subsizes[ $item ]['height'];
				$carry[ $item ] = sprintf( '%s ( %d &times; %d )', $title, $width, $height );
				return $carry;
			},
			array()
		);
	}
}
