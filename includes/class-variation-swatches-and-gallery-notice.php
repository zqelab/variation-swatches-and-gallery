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
class Variation_Swatches_And_Gallery_Notice {
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
	 * Display prominent admin notice to offer help before deactivation.
	 */
	function vsg_offer_help_notice() {
		if (!current_user_can('manage_options')) {
			return;
		}

		// Check if the plugin is activated and the user hasn't dismissed the notice.
		if (!get_user_meta(get_current_user_id(), 'vsg_help_notice_dismissed')) {
			$contact_url = admin_url('admin.php?page=variation-swatches-and-gallery-contact');
			?>
			<div class="notice notice-error is-dismissible vsg-help-notice">
				<h2 style="font-size: 1.5em; font-weight: 800; color: #d32f2f;">
					⚠️ Need Help with Variation Swatches and Gallery? — Free Assistance Within 24 Hours!
				</h2>
				<p style="font-size: 1.2em; color: #444;">
					We are a new and growing team, currently developing documentation for <strong>Variation Swatches and Gallery</strong>. If you're unsure how it works or facing any issues, please reach out. We’ll help you set up everything smoothly <strong>free of charge</strong> within 24 hours.
					<br><br>
					👉 <a href="<?php echo esc_url($contact_url); ?>" style="font-size: 1.1em; font-weight: 700; color: #0073aa; text-decoration: underline;">Click here for immediate support</a>.
				</p>
			</div>
			<script>
				// Handle the notice dismissal
				(function($) {
					$(document).on('click', '.vsg-help-notice .notice-dismiss', function() {
						$.post(ajaxurl, {
							action: 'vsg_dismiss_help_notice'
						});
					});
				})(jQuery);
			</script>
			<?php
		}
	}

	/**
	 * AJAX handler to dismiss the admin notice.
	 */
	function vsg_dismiss_help_notice() {
		update_user_meta(get_current_user_id(), 'vsg_help_notice_dismissed', true);
		wp_send_json_success();
	}

}
