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
class Variation_Swatches_And_Gallery_Widget {

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
	 * @param    \Zqe\Variation_Swatches_And_Gallery $plugin       The name of this plugin.
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
	}

	/**
	 * It adds a widget to the dashboard.
	 *
	 * @since    1.0.0
	 */
	public function dashboard_add_widgets() {
		wp_add_dashboard_widget(
			'variation_swatches_and_gallery_dashboard_widget_news',
			__( 'Variation Swatches and Gallery News', 'variation-swatches-and-gallery' ),
			array( $this, 'dashboard_widget_news_handler' ),
			array( $this, 'dashboard_widget_news_config_handler' )
		);

		global $wp_meta_boxes;

		$dashboard = $wp_meta_boxes['dashboard']['normal']['core'];

		$variation_swatches_and_gallery_dashboard_widget_news = array(
			'variation_swatches_and_gallery_dashboard_widget_news' => $dashboard['variation_swatches_and_gallery_dashboard_widget_news']
		);

		$wp_meta_boxes['dashboard']['normal']['core'] = array_merge( $variation_swatches_and_gallery_dashboard_widget_news, $dashboard ); 
	}

	/**
	 * It's a function that outputs the content of the dashboard widget.
	 *
	 * @since    1.0.0
	 */
	public function dashboard_widget_news_handler() {

		$options = wp_parse_args(
			get_option( 'variation_swatches_and_gallery_dashboard_widget_news' ),
			$this->dashboard_widget_news_config_defaults()
		);

		$feeds = array(
			array(
				'url'          => 'https://zqe.io/feed/',
				'items'        => $options['items'],
				'show_summary' => 1,
				'show_author'  => 0,
				'show_date'    => 1,
			),
		);

		wp_dashboard_primary_output( 'variation_swatches_and_gallery_dashboard_widget_news', $feeds );

		echo '
		<p class="variation-swatches-and-gallery-community-events-footer">
			<a style="text-decoration:none;" href="https://zqe.io/blog/" target="_blank">
				Blog <span class="screen-reader-text">(opens in a new tab)</span><span aria-hidden="true" class="dashicons dashicons-external"></span>
			</a>
			|
			<a style="text-decoration:none;" href="https://zqe.io/contact-us/" target="_blank">
				Help <span class="screen-reader-text">(opens in a new tab)</span><span aria-hidden="true" class="dashicons dashicons-external"></span>
			</a>
			|
			<a style="text-decoration:none;" href="https://zqe.io/whats-new/" target="_blank">
				What\'s New <span class="screen-reader-text">(opens in a new tab)</span><span aria-hidden="true" class="dashicons dashicons-external"></span>
			</a>	
		</p>';
	}

	/**
	 * If the user hasn't saved any settings for this widget, use these defaults.
	 *
	 * @return array An array with the key 'items' and the value 5.
	 *
	 * @since    1.0.0
	 */
	public function dashboard_widget_news_config_defaults() {
		return array(
			'items' => 5,
		);
	}

	/**
	 * It's a callback function for the dashboard widget's configuration form.
	 *
	 * @since    1.0.0
	 */
	public function dashboard_widget_news_config_handler() {

		$options = wp_parse_args(
			get_option( 'variation_swatches_and_gallery_dashboard_widget_news' ),
			$this->dashboard_widget_news_config_defaults()
		);

		if ( isset( $_POST['submit'] ) ) {

			// Return if nonce field not exist.
			if ( ! isset( $_POST['_vsag_widget_nonce'] ) ) {
				return;
			}

			$nonce = sanitize_text_field( wp_unslash( $_POST['_vsag_widget_nonce'] ) );

			// Return if verify not success.
			if ( ! wp_verify_nonce( $nonce, 'vsag_widget_nonce' ) ) {
				return;
			}

			if ( isset( $_POST['vsag_rss_items'] ) && intval( $_POST['vsag_rss_items'] ) > 0 ) {
				$options['items'] = intval( $_POST['vsag_rss_items'] );
			}
			update_option( 'variation_swatches_and_gallery_dashboard_widget_news', $options );
		}
		?>
		<p>
			<?php wp_nonce_field( 'vsag_widget_nonce', '_vsag_widget_nonce' ); ?>
			<label><?php esc_html_e( 'Number of RSS articles:', 'variation-swatches-and-gallery' ); ?>
				<input type="text" name="vsag_rss_items" value="<?php echo esc_attr( $options['items'] ); ?>" />
			</label>
		</p>
		<?php
	}
}
