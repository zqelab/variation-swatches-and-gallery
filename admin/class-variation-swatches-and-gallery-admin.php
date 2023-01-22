<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://zqe.io
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
class Variation_Swatches_And_Gallery_Admin {

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
	 * @param    object $plugin The name of this plugin.
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
	 * Register the stylesheets for the admin area.
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
			plugin_dir_url( __FILE__ ) . "css/variation-swatches-and-gallery-admin{$suffix}.css",
			array(),
			$this->plugin->get_version(),
			'all'
		);
	}

	/**
	 * Register the JavaScript for the admin area.
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

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_script(
			$this->plugin->get_plugin_name(),
			plugin_dir_url( __FILE__ ) . "js/variation-swatches-and-gallery-admin{$suffix}.js",
			array( 'jquery' ),
			$this->plugin->get_version(),
			false
		);
	}

	/**
	 * This function is called when the admin page is loaded.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function settings_init() {
		$this->plugin->get_option()->core->admin_init();
	}

	/**
	 * It adds a menu page to the admin menu.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function settings_menu() {
		add_menu_page(
			'Swatches Settings',
			'Swatches',
			'manage_categories',
			'variation-swatches-and-gallery',
			array( $this, 'settings_page' ),
			plugin_dir_url( __FILE__ ) . 'imgs/icon.svg',
			'58'
		);
	}

	/**
	 * It's a function that outputs a div with a class of wrap, an h1 tag with the title of the admin
	 * page, a navigation menu, a form, and a link to reset the settings
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function settings_page() {
		echo '<div class="wrap">';
			echo '<h1>' . esc_html( get_admin_page_title() ) . '</h1>';
			$this->show_navigation();
			$this->plugin->get_option()->core->show_forms();
			$this->plugin->get_option()->reset_option();
			$url = wp_nonce_url( admin_url() . 'admin.php?page=variation-swatches-and-gallery&action=reset', 'reset_vsg_option' );
			echo '<a onclick="return confirm(\'Are you sure to reset current settings?\')" href="' . esc_attr( $url ) . '">';
				echo esc_html__( 'Reset all', 'variation-swatches-and-gallery' );
			echo '</a>';
		echo '</div>';

		if ( defined( 'VARIATION_SWATCHES_AND_GALLERY_DEBUG' ) && true === VARIATION_SWATCHES_AND_GALLERY_DEBUG ) {
			echo '<pre>';
			print_r( get_option( 'vsg_option' ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r 
			echo '</pre>';
		}
	}

	/**
	 * It shows the navigation tabs.
	 *
	 * @return    void|bool
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function show_navigation() {
		if ( count( $this->plugin->get_option()->get_pages() ) === 1 ) {
			return;
		}
		echo '<h2 class="nav-tab-wrapper">';
		foreach ( $this->plugin->get_option()->get_pages() as $page ) {
			echo sprintf(
				'<a href="admin.php?page=variation-swatches-and-gallery&tab=%1$s" class="nav-tab %3$s" id="%1$s-tab">%2$s</a>',
				esc_attr( $page['id'] ),
				esc_attr( $page['title'] ),
				esc_attr( ( ( ( isset( $_GET['tab'] ) ) ? sanitize_title( wp_unslash( $_GET['tab'] ) ) : current( $this->plugin->get_option()->get_pages() )['id'] ) === $page['id'] ) ? 'nav-tab-active' : '' ) //phpcs:ignore
			);
		}
		echo '</h2>';
	}

	/**
	 * Function for `product_attributes_type_selector` filter-hook.
	 *
	 * It adds the attribute types to the dropdown in the product attributes section of the product edit
	 * screen
	 *
	 * @param array $types The array of attribute types.
	 *
	 * @return array The array of attribute types.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function product_attributes_type_selector_filter( $types ) {

		$attribute_types = $this->plugin->get_helper()->attribute_types();

		foreach ( $attribute_types as $key => $attribute_type ) {
			$types[ $key ] = $attribute_type;
		}

		return $types;
	}

	/**
	 * Function for `admin_init` action-hook to add attribute meta.
	 *
	 * It creates a new instance of the `Zqe\Wp_Term_Meta` class for each attribute taxonomy that has a
	 * type that matches one of the keys in the `` array
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function add_attribute_meta() {

		$fields               = $this->plugin->get_helper()->attribute_meta_fields();
		$attribute_taxonomies = array();

		if ( function_exists( 'wc_get_attribute_taxonomies' ) ) {
			$attribute_taxonomies = wc_get_attribute_taxonomies();
		}

		if ( ! empty( $attribute_taxonomies ) && is_array( $attribute_taxonomies ) ) {
			foreach ( $attribute_taxonomies as $attribute_taxonomy ) {
				if ( in_array( $attribute_taxonomy->attribute_type, array_keys( $fields ), true ) ) {

					$attribute_name = wc_attribute_taxonomy_name( $attribute_taxonomy->attribute_name );
					$attribute_type = $fields[ $attribute_taxonomy->attribute_type ];

					new \Zqe\Wp_Term_Meta(
						$attribute_name,
						'product',
						$attribute_type
					);
				}
			}
		}
	}

	/**
	 * Function for `woocommerce_product_option_terms` action-hook.
	 *
	 * It replaces the default WooCommerce attribute term selection with a multi-select dropdown
	 *
	 * @param     object $attribute_taxonomy The attribute taxonomy object.
	 * @param     mixed  $i The attribute ID.
	 * @param     object $attribute The attribute object.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function woocommerce_product_option_terms_action( $attribute_taxonomy, $i, $attribute ) {

		if ( 'select' !== $attribute_taxonomy->attribute_type && in_array( $attribute_taxonomy->attribute_type, array_keys( $this->plugin->get_helper()->attribute_types() ), true ) ) {
			?>
			<select multiple="multiple" data-placeholder="<?php esc_attr_e( 'Select terms', 'woocommerce' ); ?>" class="multiselect attribute_values wc-enhanced-select" name="attribute_values[<?php echo esc_attr( $i ); ?>][]">
				<?php
				$args      = array(
					'orderby'    => ! empty( $attribute_taxonomy->attribute_orderby ) ? $attribute_taxonomy->attribute_orderby : 'name',
					'hide_empty' => 0,
				);
				$all_terms = get_terms( $attribute->get_taxonomy(), apply_filters( 'woocommerce_product_attribute_terms', $args ) );
				if ( $all_terms ) {
					foreach ( $all_terms as $term ) {
						$options = $attribute->get_options();
						$options = ! empty( $options ) ? $options : array();
						echo '<option value="' . esc_attr( $term->term_id ) . '"' . wc_selected( $term->term_id, $options ) /** phpcs:ignore */ . '>' . esc_html( apply_filters( 'woocommerce_product_attribute_term_name', $term->name, $term ) ) . '</option>';
					}
				}
				?>
			</select>
			<button class="button plus select_all_attributes"><?php esc_html_e( 'Select all', 'woocommerce' ); ?></button>
			<button class="button minus select_no_attributes"><?php esc_html_e( 'Select none', 'woocommerce' ); ?></button>
			<button class="button fr plus add_new_attribute"><?php esc_html_e( 'Add new', 'woocommerce' ); ?></button>
			<?php
		}
	}

	/**
	 * Function for `zqe_manage_edit_taxonomy_columns` filter-hook.
	 *
	 * It adds a new column to the taxonomy list table, and then removes the checkbox column from the
	 * taxonomy list table
	 *
	 * @param     mixed $columns    The columns that are currently being displayed.
	 *
	 * @return    array An array of columns.
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function zqe_manage_edit_taxonomy_columns_filter( $columns ) {

		$new = array();

		if ( isset( $columns['cb'] ) ) {
			$new['cb'] = $columns['cb'];
		}

		$new['vsg-meta-preview'] = '';

		if ( isset( $columns['cb'] ) ) {
			unset( $columns['cb'] );
		}

		return array_merge( $new, $columns );
	}

	/**
	 * Function for `zqe_manage_taxonomy_custom_column` filter-hook.
	 *
	 * It's a filter that adds a column to the taxonomy term list table.
	 *
	 * @param     array  $columns    The columns array.
	 * @param     string $column     The name of the column.
	 * @param     int    $term_id    The ID of the term.
	 *
	 * @return    array
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function zqe_manage_taxonomy_custom_column_filter( $columns, $column, $term_id ) {

		if ( 'vsg-meta-preview' !== $column ) {
			return $columns;
		}

		$term           = get_term( $term_id );
		$attribute      = (object) $this->plugin->get_helper()->get_attribute_taxonomy( $term->taxonomy );
		$attribute_type = $attribute->attribute_type;
		$fields         = $this->plugin->get_helper()->attribute_meta_fields();

		$this->preview( $attribute_type, $term_id, $fields );

		return $columns;
	}

	/**
	 * If the attribute type is color, then call the color_preview function. If the attribute type is
	 * image, then call the image_preview function
	 *
	 * @param     mixed $attribute_type    The type of attribute you're previewing.
	 * @param     mixed $term_id           The ID of the term you're editing.
	 * @param     array $fields            The fields array that was passed to the function.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function preview( $attribute_type, $term_id, $fields ) {

		$meta_key = $fields[ $attribute_type ][0]['id'];

		if ( 'color' === $attribute_type ) {
			$this->color_preview( $term_id, $meta_key );
		}

		if ( 'image' === $attribute_type ) {
			$this->image_preview( $term_id, $meta_key );
		}
	}

	/**
	 * A function that is used to display the color preview of the color attribute.
	 *
	 * @param     int    $term_id    The term ID of the attribute.
	 * @param     string $key        The key of the attribute.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function color_preview( $term_id, $key ) {

		$primary_color   = sanitize_hex_color( get_term_meta( $term_id, $key, true ) );
		$secondary_color = apply_filters( 'vsg_attribute_secondary_color', false, $term_id );

		if ( ! $secondary_color ) {
			printf(
				'<div class="vsg-preview vsg-color-preview" style="background-color:%s;"></div>',
				esc_attr( $primary_color )
			);
		} else {
			do_action( 'vsg_attribute_secondary_color_preview', $primary_color, $secondary_color );
		}
	}

	/**
	 * It displays an image preview for a term meta field.
	 *
	 * @param     int    $term_id    The ID of the term.
	 * @param     string $key        The meta key to save the data to.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function image_preview( $term_id, $key ) {

		$attachment_id = absint( get_term_meta( $term_id, $key, true ) );
		$image         = wp_get_attachment_image_src( $attachment_id, 'thumbnail' );

		if ( is_array( $image ) ) {
			printf(
				'<img src="%s" alt="" width="%d" height="%d" class="vsg-preview vsg-image-preview" />',
				esc_url( $image[0] ),
				esc_attr( $image[1] ),
				esc_attr( $image[2] )
			);
		}
	}

	/**
	 * Function for 'gallery_admin_html'.
	 *
	 * Long Description.
	 *
	 * @param     mixed $loop    loop.
	 * @param     mixed $variation_data        variation_data.
	 * @param     mixed $variation        variation.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function woocommerce_product_after_variable_attributes_action( $loop, $variation_data, $variation ) {

		$variation_id      = absint( $variation->ID );
		$gallery_image_ids = get_post_meta( $variation_id, 'variation_swatches_and_gallery__gallery_image_ids' );
		?>
		<div data-product_variation_id="<?php echo esc_attr( $variation_id ); ?>" class="form-row form-row-full variation-swatches-and-gallery--gallery-wrapper">
			<div class="variation-swatches-and-gallery--gallery-postbox">
				<div class="variation-swatches-and-gallery--gallery-inside">
					<div class="variation-swatches-and-gallery--gallery-image-container">
						<h4><?php esc_html_e( 'Variation Gallery Images', 'variation-swatches-and-gallery' ); ?></h4>
						<ul class="variation-swatches-and-gallery--gallery-images">
						<?php
						if ( is_array( $gallery_image_ids ) && ! empty( $gallery_image_ids ) ) {
							foreach ( $gallery_image_ids as $image_id ) {
								$image = wp_get_attachment_image_src( $image_id );
								?>
								<li class="image">
									<input class="variation_swatches_and_gallery__gallery_image_ids" type="hidden" name="variation_swatches_and_gallery__gallery_image_ids[<?php echo esc_attr( $variation_id ); ?>][]" value="<?php echo esc_attr( $image_id ); ?>">
									<img src="<?php echo esc_url( $image[0] ); ?>">
									<a href="#" class="delete variation-swatches-and-gallery--remove-galery-image">
										<span class="dashicons dashicons-no-alt"></span>
									</a>
								</li>
								<?php
							}
						}
						?>
						</ul>
					</div>
					<div class="variation-swatches-and-gallery--add-galery-image-wrapper hide-if-no-js">
						<a href="#" data-product_variation_loop="<?php echo absint( $loop ); ?>" data-product_variation_id="<?php echo esc_attr( $variation_id ); ?>" class="button-primary variation-swatches-and-gallery--add-galery-image">
							<?php esc_html_e( 'Add Variation Gallery Images', 'variation-swatches-and-gallery' ); ?>
						</a>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
	/**
	 * Function for 'admin_footer_action'.
	 *
	 * Long Description.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function admin_footer_action() {
		?>
		<script type="text/html" id="tmpl-variation-swatches-and-gallery--gallery-image">
			<li class="image">
				<input class="variation_swatches_and_gallery__gallery_image_ids" type="hidden" name="variation_swatches_and_gallery__gallery_image_ids[{{data.product_variation_id}}][]" value="{{data.id}}">
				<img src="{{data.url}}">
				<a href="#" class="delete variation-swatches-and-gallery--remove-galery-image">
					<span class="dashicons dashicons-dismiss"></span>
				</a>
			</li>
		</script>
		<?php
	}

	/**
	 * Function for 'save_product_variation'.
	 *
	 * It saves the variation gallery images to the database.
	 *
	 * @param     int   $variation_id    The ID of the variation being saved.
	 * @param     mixed $loop        The loop count for the variation.
	 *
	 * @return    void
	 *
	 * @since     1.0.0
	 * @access    public
	 */
	public function woocommerce_save_product_variation_action( $variation_id, $loop ) {

		delete_post_meta( $variation_id, 'variation_swatches_and_gallery__gallery_image_ids' );

		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if ( isset( $_POST['variation_swatches_and_gallery__gallery_image_ids'] ) ) {
			$gallery_image_ids = map_deep( wp_unslash( $_POST['variation_swatches_and_gallery__gallery_image_ids'] ), 'absint' );
		} else {
			$gallery_image_ids = array();
		}

		// phpcs:enable WordPress.Security.NonceVerification.Missing
		if (
			! empty( $gallery_image_ids ) &&
			is_array( $gallery_image_ids )
		) {

			if ( isset( $gallery_image_ids[ $variation_id ] ) ) {

				$variation_gallery_image_ids = array_map(
					'absint',
					$gallery_image_ids[ $variation_id ]
				);

				foreach ( $variation_gallery_image_ids as $key => $variation_gallery_image_id ) {
					add_post_meta(
						$variation_id,
						'variation_swatches_and_gallery__gallery_image_ids',
						$variation_gallery_image_id
					);
				}
			}
		}
	}

	/**
	 * Function for `woocommerce_after_edit_attribute_fields` action-hook.
	 *
	 * @return void
	 */
	public function woocommerce_after_edit_attribute_fields_action() {

		// action...
	}

}
