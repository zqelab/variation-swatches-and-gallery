<?php
/**
 * Plugin helper functions.
 *
 * @link       https://zqe.io
 * @since      1.0.0
 *
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/includes
 */

namespace Zqe;

/**
 * Define the all helper function.
 *
 * This class defines all necessary helper functions used on plugin.
 *
 * @since      1.0.0
 * @package    Variation_Swatches_And_Gallery
 * @subpackage Variation_Swatches_And_Gallery/includes
 * @author     ZQE <dev@zqe.io>
 */
class Variation_Swatches_And_Gallery_Helper {

	/**
	 * It returns an array of the attribute types.
	 *
	 * @return    array An array of the attribute types.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function attribute_types() {
		return array(
			'select' => esc_html__( 'Select', 'variation-swatches-and-gallery' ),
			'color'  => esc_html__( 'Color', 'variation-swatches-and-gallery' ),
			'image'  => esc_html__( 'Image', 'variation-swatches-and-gallery' ),
			'button' => esc_html__( 'Button', 'variation-swatches-and-gallery' ),
			'radio'  => esc_html__( 'Radio', 'variation-swatches-and-gallery' ),
		);
	}

	/**
	 * It creates the fields for the attribute meta box.
	 *
	 * @return    array An array of the fields for the attribute meta.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function attribute_meta_fields() {

		$fields = array();

		$fields['color'] = array(
			array(
				'label' => esc_html__( 'Color', 'variation-swatches-and-gallery' ),
				'desc'  => esc_html__( 'Choose a color', 'variation-swatches-and-gallery' ),
				'id'    => 'pam_color',
				'type'  => 'color',
			),
		);

		$fields['image'] = array(
			array(
				'label' => esc_html__( 'Image', 'variation-swatches-and-gallery' ),
				'desc'  => esc_html__( 'Choose an Image', 'variation-swatches-and-gallery' ),
				'id'    => 'pam_image_id',
				'type'  => 'image',
			),
		);

		return apply_filters( 'variation_swatches_and_gallery_attribute_meta_fields', $fields );
	}

	/**
	 * It returns the attribute taxonomy object for a given attribute name
	 *
	 * @param     array $attribute_name    The name of the attribute you want to get the taxonomy for.
	 *
	 * @return    mixed
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function get_attribute_taxonomy( $attribute_name ) {

		$taxonomy_attributes = wc_get_attribute_taxonomies();
		$attribute_name      = str_ireplace( 'pa_', '', wc_sanitize_taxonomy_name( $attribute_name ) );

		foreach ( $taxonomy_attributes as $attribute ) {

			if ( false === stripos( $attribute->attribute_name, $attribute_name ) ) {
				continue;
			}

			return $attribute;
		}

		return false;
	}

	/**
	 * It returns an array of all the images assigned to the variations of a product, grouped by the
	 * attribute that is used to select the variation
	 *
	 * @param     array $args                            An array of arguments passed to the function.
	 * @param     array $default_image_type_attribute    This is the attribute that will be used to determine the default image.
	 *
	 * @return    array
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function assigned_image( $args, $default_image_type_attribute ) {

		$product                = $args['product'];
		$attributes             = $product->get_variation_attributes();
		$current_attribute_key  = $args['attribute'];
		$selected_attribute_key = array_key_first( $attributes );
		$current_attribute_name = wc_variation_attribute_name( $current_attribute_key );
		$attribute_counts       = $this->attribute_counts( $attributes );

		if ( '__last' === $default_image_type_attribute ) {
			$selected_attribute_key = array_key_last( $attributes );
		}
		if ( '__max' === $default_image_type_attribute ) {
			$selected_attribute_key = array_search( max( $attribute_counts ), $attribute_counts, true );
		}
		if ( '__min' === $default_image_type_attribute ) {
			$selected_attribute_key = array_search( min( $attribute_counts ), $attribute_counts, true );
		}

		$selected_attribute_name = wc_variation_attribute_name( $selected_attribute_key );
		$variations              = $product->get_available_variations();
		$assigned                = array();

		foreach ( $variations as $variation_key => $variation ) {
			if ( taxonomy_exists( $args['attribute'] ) ) {
				$attribute_value = esc_html( $variation['attributes'][ $selected_attribute_name ] );
			} else {
				$attribute_value = isset( $args['options'][ $variation_key ] ) ? $args['options'][ $variation_key ] : '';
			}
			$assigned[ $selected_attribute_name ][ $attribute_value ] = array(
				'image_id'     => $variation['image_id'],
				'variation_id' => $variation['variation_id'],
			);

		}

		return ( isset( $assigned[ $current_attribute_name ] ) ? $assigned[ $current_attribute_name ] : array() );
	}

	/**
	 * It takes an array of attributes and returns an array of the number of values for each attribute
	 *
	 * @param     array $attributes    The attributes you want to get the counts for.
	 *
	 * @return    array An array of the number of values for each attribute.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function attribute_counts( $attributes ) {
		$attribute_counts = array();
		foreach ( $attributes as $attr_key => $attr_values ) {
			$attribute_counts[ $attr_key ] = count( $attr_values );
		}
		return $attribute_counts;
	}
}
