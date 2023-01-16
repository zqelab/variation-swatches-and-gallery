<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://zqe.io
 * @since      1.0.0
 *
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/public
 */

namespace Zqe;

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/public
 * @author     ZQE <dev@zqe.io>
 */
class Variation_Swatches_And_Gallery_Public {


	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      \Zqe\Variation_Swatches_And_Gallery $plugin The ID of this plugin.
	 */
	private $plugin;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      object $plugin The name of this plugin.
	 */
	public function __construct( $plugin ) {

		$this->plugin = $plugin;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    \Zqe\Variation_Swatches_And_Gallery Orchestrates the hooks of the plugin.
	 */
	public function get_plugin() {
		return $this->plugin;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Variation_Swatches_And_Gallery_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Variation_Swatches_And_Gallery_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_style(
			$this->plugin->get_plugin_name(),
			plugin_dir_url( __FILE__ ) . "css/variation-swatches-and-gallery-public{$suffix}.css",
			array(),
			$this->plugin->get_version(),
			'all'
		);

		$style = sprintf(
			':root {%s}',
			$this->implode_css_property_value( $this->inline_style_declaration() )
		);

		wp_add_inline_style( $this->plugin->get_plugin_name(), $style );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Variation_Swatches_And_Gallery_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Variation_Swatches_And_Gallery_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		wp_deregister_script( 'flexslider' );

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_script(
			$this->plugin->get_plugin_name() . '-flexslider',
			plugin_dir_url( __FILE__ ) . 'js/jquery.flexslider.js',
			array(
				'jquery',
			),
			$this->plugin->get_version(),
			true
		);

		wp_enqueue_script(
			$this->plugin->get_plugin_name(),
			plugin_dir_url( __FILE__ ) . "js/variation-swatches-and-gallery-public{$suffix}.js",
			array( 'jquery' ),
			$this->plugin->get_version(),
			true
		);

		wp_localize_script(
			$this->plugin->get_plugin_name(),
			'_VSG',
			array(
				'option'         => $this->plugin->get_option()->get_options(),
				'gallery_images' => $this->gallery_images(),
			)
		);
	}

	/**
	 * It returns an array of all the images in the product gallery, including the featured image
	 *
	 * @return array An array of images.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function gallery_images() {

		$gallery_images = array();

		if ( is_singular( 'product' ) ) {
			$product                   = wc_get_product( get_the_ID() );
			$product_image_id          = absint( $product->get_image_id() );
			$product_gallery_image_ids = $product->get_gallery_image_ids();
			if ( $product_image_id ) {
				array_unshift( $product_gallery_image_ids, $product_image_id );
			}
			foreach ( $product_gallery_image_ids as $i => $attachment_id ) {
				if ( wp_get_attachment_image_src( $attachment_id ) ) {
					$gallery_images[ $i ] = apply_filters( 'woocommerce_single_product_image_thumbnail_html', wc_get_gallery_image_html( $attachment_id ), $attachment_id );
				}
			}
		}

		return $gallery_images;
	}


	/**
	 * It takes an array of CSS properties and values and returns a string of CSS properties and values
	 *
	 * @param     array $raw_properties    An array of CSS properties and values.
	 *
	 * @return    string The function implode_css_property_value() is returning a string of CSS properties.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function implode_css_property_value( $raw_properties ) {
		$properties = array();
		foreach ( $raw_properties as $name => $value ) {
			$properties[] = esc_attr( $name ) . ':' . esc_attr( $value );
		}
		return implode( ';', $properties );
	}

	/**
	 * It returns an array of CSS variables that are used in the inline style.
	 *
	 * @return    array An array of CSS variables.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function inline_style_declaration() {

		$image_swatch_width  = $this->plugin->get_option()->get_option( 'image_swatch_width', 40 );
		$image_swatch_height = $this->plugin->get_option()->get_option( 'image_swatch_height', 40 );
		$color_swatch_width  = $this->plugin->get_option()->get_option( 'color_swatch_width', 30 );
		$color_swatch_height = $this->plugin->get_option()->get_option( 'color_swatch_height', 30 );

		$declaration = array(
			'--vsg-image-swatch-width'  => sprintf( '%spx', $image_swatch_width ),
			'--vsg-image-swatch-height' => sprintf( '%spx', $image_swatch_height ),
			'--vsg-color-swatch-width'  => sprintf( '%spx', $color_swatch_width ),
			'--vsg-color-swatch-height' => sprintf( '%spx', $color_swatch_height ),
		);

		return apply_filters( 'vsg_inline_style_declaration', $declaration );
	}

	/**
	 * It adds classes to the body tag
	 *
	 * @param     array $classes An array of class names to add to the class list.
	 *
	 * @return    array The classes array is being returned.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function body_class_action( $classes ) {

		$classes[] = 'vsg-body';
		$classes[] = sprintf( 'vsg-theme-%s', strtolower( basename( get_stylesheet_directory() ) ) );
		$classes[] = ( wp_is_mobile() ? 'vsg-mobile' : '' );

		$disabled_variation_behavior = $this->plugin->get_option()->get_option( 'disabled_variation_behavior', 'blur' );
		$classes[]                   = sprintf( 'vsg-disabled-variation-attribute-%s', $disabled_variation_behavior );

		if ( $this->plugin->get_option()->get_option( 'clickable_disabled_variation_attribute', '' ) ) {
			$classes[] = 'vsg-disabled-variation-attribute-clickable';
		}

		if ( $this->plugin->get_option()->get_option( 'tooltip', 'on' ) ) {
			$classes[] = 'vsg-show-tooltip';
		}

		if ( $this->plugin->get_option()->get_option( 'stockcount', 'on' ) ) {
			$classes[] = 'vsg-show-stockcount';
		}

		if ( $this->plugin->get_option()->get_option( 'selected_variation_attribute_label', '' ) ) {
			$classes[] = 'vsg-selected-variation-attribute-show-label';
		}

		return $classes;
	}

	/**
	 * Function for `woocommerce_dropdown_variation_attribute_options_html` filter-hook.
	 *
	 * Variation attribute options and swatches.
	 *
	 * @param     mixed $html    The HTML output of the dropdown.
	 * @param     array $args    args.
	 *
	 * @return    string The html for the dropdown variation attribute options and swatches.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function woocommerce_dropdown_variation_attribute_options_html_filter( $html, $args ) {

		$attribute              = wc_get_attribute( wc_attribute_taxonomy_id_by_name( $args['attribute'] ) );
		$args['attribute_type'] = ( $attribute ) ? $attribute->type : 'select';
		$button_swatch_default  = $this->plugin->get_option()->get_option( 'button_swatch_default', 'on' );
		$image_swatch_default   = $this->plugin->get_option()->get_option( 'image_swatch_default', 'on' );
		$button_swatch_default  = apply_filters( 'vsg_button_swatch_default', $button_swatch_default, $args );
		$image_swatch_default   = apply_filters( 'vsg_image_swatch_default', $image_swatch_default, $args );

		if ( 'select' === $args['attribute_type'] && ( $image_swatch_default || $button_swatch_default ) ) {

			if ( $image_swatch_default ) {

				$image_swatch_default_attribute = $this->plugin->get_option()->get_option( 'image_swatch_default_attribute', '__first' );
				$image_swatch_default_attribute = apply_filters( 'vsg_image_swatch_default_attribute', $image_swatch_default_attribute, $args );
				$assigned                       = $this->plugin->get_helper()->assigned_image( $args, $image_swatch_default_attribute );
				if ( ! empty( $assigned ) ) {
					$args['assigned']       = $assigned;
					$args['attribute_type'] = 'image';
				}
			}

			if ( $button_swatch_default ) {

				if ( ! isset( $args['assigned'] ) ) {
					$args['attribute_type'] = 'button';
				}
			}

			$args['attribute_type_default'] = true;
		}

		ob_start();

		$this->dropdown_variation_attribute_options( $args );
		$this->dropdown_variation_attribute_swatches( $args );

		$html = ob_get_clean();

		return apply_filters( 'variation_swatches_and_gallery_dropdown_variation_attribute_options_and_swatches_html', $html, $args );
	}

	/**
	 * It's a copy of the original function, but with the line ` = 'display:none';` added
	 *
	 * Long Description.
	 *
	 * @param     array $args    An array of arguments.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function dropdown_variation_attribute_options( $args = array() ) {

		$args = wp_parse_args(
			apply_filters( 'woocommerce_dropdown_variation_attribute_options_args', $args ),
			array(
				'options'          => false,
				'attribute'        => false,
				'product'          => false,
				'selected'         => false,
				'name'             => '',
				'id'               => '',
				'class'            => '',
				'show_option_none' => __( 'Choose an option', 'woocommerce' ),
				'is_archive'       => false,
			)
		);

		// Get selected value.
		if ( false === $args['selected'] && $args['attribute'] && $args['product'] instanceof \WC_Product ) {
			$selected_key = 'attribute_' . sanitize_title( $args['attribute'] );
			// phpcs:disable WordPress.Security.NonceVerification.Recommended
			$args['selected'] = isset( $_REQUEST[ $selected_key ] ) ? wc_clean( wp_unslash( $_REQUEST[ $selected_key ] ) ) /** phpcs:ignore */ : $args['product']->get_variation_default_attribute( $args['attribute'] );
			// phpcs:enable WordPress.Security.NonceVerification.Recommended
		}

		$options               = $args['options'];
		$product               = $args['product'];
		$attribute             = $args['attribute'];
		$name                  = $args['name'] ? $args['name'] : 'attribute_' . sanitize_title( $attribute );
		$id                    = $args['id'] ? $args['id'] : sanitize_title( $attribute );
		$class                 = $args['class'];
		$show_option_none      = (bool) $args['show_option_none'];
		$show_option_none_text = $args['show_option_none'] ? $args['show_option_none'] : __( 'Choose an option', 'woocommerce' ); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options.

		if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
			$attributes = $product->get_variation_attributes();
			$options    = $attributes[ $attribute ];
		}

		$style = '';

		if ( 'select' !== $args['attribute_type'] ) {
			$style = 'display:none';
			$class = ' vsg-raw-select';
		}

		echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" name="' . esc_attr( $name ) . '" data-attribute_name="attribute_' . esc_attr( sanitize_title( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '" style="' . esc_attr( $style ) . '">';
		echo '<option value="">' . esc_html( $show_option_none_text ) . '</option>';

		if ( ! empty( $options ) ) {
			if ( $product && taxonomy_exists( $attribute ) ) {
				// Get terms if this is a taxonomy - ordered. We need the names too.
				$terms = wc_get_product_terms(
					$product->get_id(),
					$attribute,
					array(
						'fields' => 'all',
					)
				);

				foreach ( $terms as $term ) {
					if ( in_array( $term->slug, $options, true ) ) {
						echo '<option value="' . esc_attr( $term->slug ) . '" ' . selected( sanitize_title( $args['selected'] ), $term->slug, false ) . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $term->name, $term, $attribute, $product ) ) . '</option>';
					}
				}
			} else {
				foreach ( $options as $option ) {
					// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
					$selected = sanitize_title( $args['selected'] ) === $args['selected'] ? selected( $args['selected'], sanitize_title( $option ), false ) : selected( $args['selected'], $option, false );
					echo '<option value="' . esc_attr( $option ) . '" ' . esc_attr( $selected ) . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option, null, $attribute, $product ) ) . '</option>';
				}
			}
		}
		echo '</select>';
	}

	/**
	 * A wrapper function that calls the wrapper_start and wrapper_end functions and the items function.
	 *
	 * @param     array $args    args.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function dropdown_variation_attribute_swatches( $args = array() ) {
		if ( 'select' !== $args['attribute_type'] ) {

			$attribute_type         = $args['attribute_type'];
			$attribute_type         = apply_filters( 'vsg_texonomy_attribute_type', $attribute_type, $args );
			$args['attribute_type'] = $attribute_type;

			$this->wrapper_start( $args );
			$this->items( $args );
			$this->wrapper_end();
		}
	}

	/**
	 * It returns a string that contains the opening tag of the wrapper element
	 *
	 * @param     array $args    args.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function wrapper_start( $args ) {
		$attribute_type = $args['attribute_type'];
		$classes        = array();
		$classes[]      = 'vsg-swatch-items-wrapper';
		$classes[]      = sanitize_text_field( sprintf( 'vsg-%s-swatch-items-wrapper', $attribute_type ) );

		$image_swatch_style  = $this->plugin->get_option()->get_option( 'image_swatch_style', 'squared' );
		$image_swatch_style  = apply_filters( 'variation_swatches_and_gallery_options', $image_swatch_style, 'image_swatch_style', $args );
		$color_swatch_style  = $this->plugin->get_option()->get_option( 'color_swatch_style', 'squared' );
		$color_swatch_style  = apply_filters( 'variation_swatches_and_gallery_options', $color_swatch_style, 'color_swatch_style', $args );
		$radio_swatch_style  = $this->plugin->get_option()->get_option( 'radio_swatch_style', 'squared' );
		$radio_swatch_style  = apply_filters( 'variation_swatches_and_gallery_options', $radio_swatch_style, 'radio_swatch_style', $args );
		$button_swatch_style = $this->plugin->get_option()->get_option( 'button_swatch_style', 'squared' );
		$button_swatch_style = apply_filters( 'variation_swatches_and_gallery_options', $button_swatch_style, 'button_swatch_style', $args );

		$image_swatch_display  = $this->plugin->get_option()->get_option( 'image_swatch_display', 'inline' );
		$image_swatch_display  = apply_filters( 'variation_swatches_and_gallery_options', $image_swatch_display, 'image_swatch_display', $args );
		$color_swatch_display  = $this->plugin->get_option()->get_option( 'color_swatch_display', 'inline' );
		$color_swatch_display  = apply_filters( 'variation_swatches_and_gallery_options', $color_swatch_display, 'color_swatch_display', $args );
		$radio_swatch_display  = $this->plugin->get_option()->get_option( 'radio_swatch_display', 'inline' );
		$radio_swatch_display  = apply_filters( 'variation_swatches_and_gallery_options', $radio_swatch_display, 'radio_swatch_display', $args );
		$button_swatch_display = $this->plugin->get_option()->get_option( 'button_swatch_display', 'inline' );
		$button_swatch_display = apply_filters( 'variation_swatches_and_gallery_options', $button_swatch_display, 'button_swatch_display', $args );

		if ( 'image' === $attribute_type ) {
			$classes[] = sprintf( 'vsg-%s-style-swatch-items-wrapper', $image_swatch_style );
			$classes[] = sprintf( 'vsg-%s-display-swatch-items-wrapper', $image_swatch_display );
		}

		if ( 'color' === $attribute_type ) {
			$classes[] = sprintf( 'vsg-%s-style-swatch-items-wrapper', $color_swatch_style );
			$classes[] = sprintf( 'vsg-%s-display-swatch-items-wrapper', $color_swatch_display );
		}

		if ( 'radio' === $attribute_type ) {
			$classes[] = sprintf( 'vsg-%s-style-swatch-items-wrapper', $radio_swatch_style );
			$classes[] = sprintf( 'vsg-%s-display-swatch-items-wrapper', $radio_swatch_display );
		}

		if ( 'button' === $attribute_type ) {
			$classes[] = sprintf( 'vsg-%s-style-swatch-items-wrapper', $button_swatch_style );
			$classes[] = sprintf( 'vsg-%s-display-swatch-items-wrapper', $button_swatch_display );
		}

		$html_attributes                          = array();
		$html_attributes['role']                  = 'radiogroup';
		$html_attributes['aria-label']            = wc_attribute_label( $args['attribute'], $args['product'] );
		$html_attributes['class']                 = implode( ' ', array_unique( array_values( $classes ) ) );
		$html_attributes['data-attribute_name']   = wc_variation_attribute_name( $args['attribute'] );
		$html_attributes['data-attribute_values'] = wc_esc_json( wp_json_encode( array_values( $args['options'] ) ) );

		echo sprintf(
			'<ul role="%1$s" aria-label="%2$s" class="%3$s" data-attribute_name="%4$s" data-attribute_values="%5$s">',
			esc_attr( $html_attributes['role'] ),
			esc_attr( $html_attributes['aria-label'] ),
			esc_attr( $html_attributes['class'] ),
			esc_attr( $html_attributes['data-attribute_name'] ),
			esc_attr( $html_attributes['data-attribute_values'] ),
		);
	}

	/**
	 * If the attribute is a taxonomy, get the terms and loop through them, otherwise loop through the
	 * options
	 *
	 * @param     array $args    An array of arguments that are passed to the function.
	 *
	 * @return    void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function items( $args ) {

		$options            = $args['options'];
		$product            = $args['product'];
		$attribute          = $args['attribute'];
		$attribute_type_old = $args['attribute_type'];

		if ( ! empty( $options ) ) {
			if ( $product && taxonomy_exists( $attribute ) ) {
				$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
				foreach ( $terms as $term ) {
					if ( in_array( $term->slug, $options, true ) ) {
						$option      = esc_html( apply_filters( 'woocommerce_variation_option_name', $term->name, $term, $attribute, $product ) );
						$selected    = selected( sanitize_title( $args['selected'] ), $term->slug, false );
						$option_slug = $term->slug;
						$term_id     = $term->term_id;

						$args['attribute_type'] = $attribute_type_old;
						$attribute_type         = apply_filters( 'vsg_texonomy_trem_attribute_type', $attribute_type_old, $args, $term_id );
						$args['attribute_type'] = $attribute_type;

						$this->item( $args, $option, $option_slug, $selected, $term_id );
					}
				}
			} else {
				foreach ( $options as $option ) {
					$option      = esc_html( apply_filters( 'woocommerce_variation_option_name', $option, null, $attribute, $product ) );
					$selected    = sanitize_title( $args['selected'] ) === $args['selected'] ? selected( $args['selected'], sanitize_title( $option ), false ) : selected( $args['selected'], $option, false );
					$option_slug = $option;
					$term_id     = null;

					$args['attribute_type'] = $attribute_type_old;
					$attribute_type         = apply_filters( 'vsg_option_trem_attribute_type', $attribute_type_old, $args, $option );
					$args['attribute_type'] = $attribute_type;

					$this->item( $args, $option, $option_slug, $selected, $term_id );
				}
			}
		}
	}

	/**
	 * `public function wrapper_end() { return '</ul>'; }`
	 *
	 * @return void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function wrapper_end() {
		?>
		</ul>
		<?php
	}

	/**
	 * It builds the HTML for each swatch item.
	 *
	 * @param     array $args           An array of arguments that are passed to the function.
	 * @param     mixed $option         The name of the attribute option.
	 * @param     mixed $option_slug    The slug of the attribute option.
	 * @param     mixed $selected       Whether the current item is selected or not.
	 * @param     mixed $term_id        The term ID of the attribute.
	 * @param     mixed $html           The HTML string that will be returned.
	 *
	 * @return    string The HTML for the swatch item.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function item( $args, $option, $option_slug, $selected, $term_id, $html = '' ) {

		$product                   = $args['product'];
		$attribute                 = $args['attribute'];
		$name                      = $args['name'] ? $args['name'] : 'attribute_' . sanitize_title( $attribute );
		$managing_stock            = $product->managing_stock();
		$stockcount                = $this->plugin->get_option()->get_option( 'stockcount', 'on' );
		$is_in_stock_any_variation = false;
		$is_in_stock               = false;
		$variation_stock_count     = 0;
		$variations                = $product->get_available_variations();
		$get_variations            = count( $product->get_children() ) <= apply_filters( 'woocommerce_ajax_variation_threshold', 30, $product );
		$available_variations      = $get_variations ? $product->get_available_variations() : array();

		foreach ( $variations as $variation ) {
			if ( $variation['is_in_stock'] ) {
				$is_in_stock_any_variation = true;
			}
			if ( ( $variation['attributes'][ $name ] === $option_slug && $variation['is_in_stock'] ) || ( ! $variation['attributes'][ $name ] && $is_in_stock_any_variation ) ) {
				$variation_obj          = wc_get_product( $variation['variation_id'] );
				$variation_stock_count += $variation_obj->get_stock_quantity();
				$is_in_stock            = true;
			}
		}

		$tooltip_args = $this->tooltip_args( $args, $option, $term_id );

		printf(
			'<li class="vsg-swatch-item vsg-swatch-item-%1$s vsg-swatch-item-%1$s-%2$s %3$s %4$s" title="%5$s" data-title="%5$s" data-value="%2$s" >',
			esc_attr( $args['attribute_type'] ),
			esc_attr( $option_slug ),
			esc_attr( $selected ? 'vsg-swatch-item-selected' : '' ),
			esc_attr( ( ! $is_in_stock ) ? 'vsg-swatch-item-disabled' : '' ),
			esc_attr( $option )
		);

		printf( '<div class="vsg-swatch-item-wrapper">' );

		switch ( $args['attribute_type'] ) {
			case 'image':
				$this->image( $args, $option, $option_slug, $term_id );
				$image_swatch_show_label = $this->plugin->get_option()->get_option( 'image_swatch_show_label', false );
				$image_swatch_show_label = apply_filters( 'vsg_image_swatch_show_label', $image_swatch_show_label, $args );
				$this->swatch_label( $image_swatch_show_label, $option );
				break;
			case 'color':
				$this->color( $args, $term_id, $option );
				$color_swatch_show_label = $this->plugin->get_option()->get_option( 'color_swatch_show_label', false );
				$color_swatch_show_label = apply_filters( 'vsg_color_swatch_show_label', $color_swatch_show_label, $args );
				$this->swatch_label( $color_swatch_show_label, $option );
				break;
			case 'button':
				$this->button( $args, $option );
				break;
			case 'radio':
				$this->radio( $args, $option, $tooltip_args );
				$this->stock_count( $available_variations, $stockcount, $managing_stock, $variation_stock_count );
				break;
			default:
				break;
		}

		printf( '</div>' );

		if ( 'radio' !== $args['attribute_type'] ) {
			$this->stock_count( $available_variations, $stockcount, $managing_stock, $variation_stock_count );
			$this->tooltip_html( $tooltip_args );
		}

		printf( '</li>' );

		return apply_filters( 'variable_product_swatches_build_swatches_items_html', $html, $args, $option, $option_slug, $selected, $term_id );
	}

	/**
	 * If the product has variations, the stock count is enabled, and the product is managing stock, then
	 * display the stock count
	 *
	 * @param mixed $available_variations  The array of available variations for the product.
	 * @param mixed $stockcount            This is the WooCommerce setting that enables stock count display.
	 * @param mixed $managing_stock        Whether or not the product is managing stock.
	 * @param mixed $variation_stock_count The stock count for the variation.

	 * @return    void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function stock_count( $available_variations, $stockcount, $managing_stock, $variation_stock_count ) {
		if ( $available_variations && $stockcount && $managing_stock ) {
			printf(
				'<span class="vsg-swatch-item-stock-count">%1$s left</span>',
				esc_html( $variation_stock_count )
			);
		}
	}

	/**
	 * If the show_label variable is true, then print the option variable in a span tag
	 *
	 * @param     bool   $show_label    true/false.
	 * @param     string $option    The option value.

	 * @return    void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function swatch_label( $show_label, $option ) {
		if ( $show_label ) {
			printf( '<span class="vsg-swatch-item-span-label">%1$s</span>', esc_html( $option ) );
		}
	}

	/**
	 * It outputs a tooltip div with the given placement, html data, and type
	 *
	 * @param     array $tooltip_args    The attribute option name.
	 *
	 * @return    void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function tooltip_html( $tooltip_args ) {
		if ( is_array( $tooltip_args ) && ! empty( $tooltip_args ) && isset( $tooltip_args['type'] ) && ! empty( $tooltip_args['type'] ) ) {
			echo sprintf(
				'<div style="display:none;" class="vsg-swatch-item-tooltip vsg-swatch-item-tooltip-%3$s vsg-swatch-item-tooltip-%1$s">%2$s</div>',
				esc_attr( $tooltip_args['placement'] ),
				wp_kses_post( $tooltip_args['html_data'] ),
				esc_attr( $tooltip_args['type'] ),
			);
		}
	}

	/**
	 * Used to create the tooltip for the attribute.
	 *
	 * @param array  $args An array of arguments that are passed to the function.
	 * @param string $option The option value.
	 * @param int    $term_id The ID of the attribute term.
	 *
	 * @return array.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function tooltip_args( $args, $option, $term_id ) {
		$tooltip      = $this->plugin->get_option()->get_option( 'tooltip', 'on' );
		$tooltip_args = array();

		$tooltip_args['placement'] = $this->plugin->get_option()->get_option( 'tooltip_placement', 'top' );

		if ( $tooltip ) {
			$tooltip_args['type']      = 'text';
			$tooltip_args['html_data'] = $option;
		}

		return apply_filters( 'vsg_tooltip_args', $args, $tooltip_args, $option, $term_id );
	}

	/**
	 * It returns the image for the attribute.
	 *
	 * @param     array  $args    The arguments passed to the function.
	 * @param     string $option    The attribute option name.
	 * @param     string $option_slug    The slug of the attribute option.
	 * @param     int    $term_id    The ID of the term.
	 *
	 * @return    void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function image( $args, $option, $option_slug, $term_id ) {

		if ( isset( $args['attribute_type_default'] ) ) {
			$attachment_id = isset( $args['assigned'][ $option_slug ] ) ? $args['assigned'][ $option_slug ]['image_id'] : null;
		} else {
			$attachment_id = absint( get_term_meta( $term_id, 'pam_image_id', true ) );
		}

		$attachment_id = apply_filters( 'vsg_attachment_id', $attachment_id, $args, $term_id, $option, $option_slug );

		$image_swatch_thumbnail_size = $this->plugin->get_option()->get_option( 'image_swatch_thumbnail_size', 'thumbnail' );
		$image_swatch_thumbnail_size = apply_filters( 'vsg_image_swatch_thumbnail_size', $image_swatch_thumbnail_size, $args );

		$image = $this->swatch_image( $attachment_id, $image_swatch_thumbnail_size );

		echo sprintf(
			'<span class="vsg-swatch-item-span vsg-swatch-item-span-%1$s"><img style="max-width:150px;" class="vsg-swatch-item-image" alt="%2$s" src="%3$s" width="%4$s" height="%5$s" /></span>',
			esc_attr( $args['attribute_type'] ),
			esc_attr( $option ),
			esc_url( $image[0] ),
			esc_attr( $image[1] ),
			esc_attr( $image[2] )
		);
	}

	/**
	 * It returns a span element with a background color
	 *
	 * @param     array  $args    This is an array of arguments that are passed to the function.
	 * @param     mixed  $term_id    The ID of the term.
	 * @param     string $option    Option name.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function color( $args, $term_id, $option ) {

		$color           = sanitize_hex_color( get_term_meta( $term_id, 'pam_color', true ) );
		$color           = apply_filters( 'variation_swatches_and_gallery_color', $args, $color, $term_id, $option );
		$secondary_color = false;
		$secondary_color = apply_filters( 'variation_swatches_and_gallery_secondary_color', $args, $secondary_color, $term_id, $option );

		if ( ! $secondary_color ) {
			printf(
				'<span class="vsg-swatch-item-span vsg-swatch-item-span-%1$s" style="background-color:%2$s;"> </span>',
				esc_attr( $args['attribute_type'] ),
				esc_html( $color )
			);
		} else {
			do_action( 'variation_swatches_and_gallery_secondary_color_preview', $args, $color, $secondary_color );
		}
	}

	/**
	 * It returns a span with a class and the option name
	 *
	 * @param     array  $args    This is an array of arguments that are passed to the function.
	 * @param     string $option    The value of the attribute.
	 *
	 * @return    void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function button( $args, $option ) {
		echo sprintf(
			'<span class="vsg-swatch-item-span vsg-swatch-item-span-%1$s">%2$s</span>',
			esc_attr( $args['attribute_type'] ),
			esc_html( $option )
		);
	}

	/**
	 * It returns a string that contains the HTML for a radio button
	 *
	 * @param     array  $args    The arguments passed to the function.
	 * @param     string $option    The option name.
	 * @param     array  $tooltip_args    The tooltip HTML.
	 *
	 * @return    void.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function radio( $args, $option, $tooltip_args ) {
		echo sprintf(
			'<span class="vsg-swatch-item-span vsg-swatch-item-span-%1$s">',
			esc_attr( $args['attribute_type'] )
		);
		$this->tooltip_html( $tooltip_args );
		echo sprintf( '</span>' );
		echo sprintf(
			'<span class="vsg-swatch-item-span-label"> %1$s </span>',
			esc_html( $option ),
		);
	}

	/**
	 * It returns an HTML image tag for the given attachment ID.
	 *
	 * @param int    $attachment_id    The ID of the image attachment.
	 * @param string $image_swatch_thumbnail_size    The ID of the image attachment.
	 *
	 * @return    array.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function swatch_image( $attachment_id, $image_swatch_thumbnail_size ) {

		$image = wp_get_attachment_image_src( $attachment_id, $image_swatch_thumbnail_size );

		if ( ! $image ) {
			$image = array( wc_placeholder_img_src(), '150', '150' );
		}

		return $image;
	}

	/**
	 * Function for `woocommerce_variation_is_active` filter-hook.
	 *
	 * If the variation is out of stock, then don't show it
	 *
	 * @param     bool   $active    Whether the variation is active or not.
	 * @param     object $variation    The variation object.
	 *
	 * @return    bool value of the  variable
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function woocommerce_variation_is_active_filter( $active, $variation ) {

		if ( ! $variation->is_in_stock() ) {
			return false;
		}

		return $active;
	}

	/**
	 * It adds the stock quantity to the variation data that is sent to the browser when a user selects
	 * a variation
	 *
	 * @param array  $data The variation data.
	 * @param object $product The product object.
	 * @param object $variation The variation object.
	 *
	 * @return array The stock quantity of the variation.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function woocommerce_available_variation_filter( $data, $product, $variation ) {
		$data['stock_quantity'] = $variation->get_stock_quantity();

		$data['variation_add_to_cart_text']        = $variation->add_to_cart_text();
		$data['variation_add_to_cart_url']         = $variation->add_to_cart_url();
		$data['variation_add_to_cart_description'] = $variation->add_to_cart_description();

		$data['product_add_to_cart_text']        = $product->add_to_cart_text();
		$data['product_id']                      = $product->get_id();
		$data['product_add_to_cart_url']         = $product->add_to_cart_url();
		$data['product_add_to_cart_description'] = $product->add_to_cart_description();

		$data['get_current_url'] = $this->get_current_url();

		$product_id              = absint( $variation->get_parent_id() );
		$variation_id            = absint( $variation->get_id() );
		$parent_product          = wc_get_product( $product_id );
		$gallery_image_ids       = (bool) get_post_meta( $variation_id, 'variation_swatches_and_gallery__gallery_image_ids', true );
		$variation_image_id      = absint( $variation->get_image_id() );
		$parent_product_image_id = absint( $parent_product->get_image_id() );

		if ( $gallery_image_ids ) {
			$gallery_image_ids = (array) get_post_meta( $variation_id, 'variation_swatches_and_gallery__gallery_image_ids' );
		} else {
			$gallery_image_ids = $variation->get_gallery_image_ids();
		}

		if ( $variation_image_id ) {
			array_unshift( $gallery_image_ids, $variation_image_id );
		}

		if ( ! empty( $parent_product_image_id ) ) {
			array_unshift( $gallery_image_ids, $parent_product_image_id );
		} else {
			array_unshift( $gallery_image_ids, get_option( 'woocommerce_placeholder_image', 0 ) );
		}

		$data['variation_gallery_images'] = array();

		foreach ( $gallery_image_ids as $i => $variation_gallery_image_id ) {
			if ( wp_get_attachment_image_src( $variation_gallery_image_id ) ) {
				$data['variation_gallery_images'][ $i ] = apply_filters( 'woocommerce_single_product_image_thumbnail_html', wc_get_gallery_image_html( $variation_gallery_image_id ), $variation_gallery_image_id );
			}
		}

		return $data;
	}
	/**
	 * Function for `woocommerce_ajax_variation_threshold` filter-hook.
	 *
	 * If the number of variations is greater than 100, then don't use AJAX to load the variations.
	 *
	 * @return    int The number of variations that are allowed to be displayed before the user is prompted to
	 * narrow their selection.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function woocommerce_ajax_variation_threshold_filter() {
		return 30;
	}

	/**
	 * It returns the current URL with the query string appended
	 *
	 * @param  array $args An array of query string arguments to add to the current URL.
	 *
	 * @return    string The current URL.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function get_current_url( $args = array() ) {
		global $wp;
		return esc_url( trailingslashit( home_url( add_query_arg( $args, $wp->request ) ) ) );
	}
}
