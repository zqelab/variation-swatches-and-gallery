(function($) {
	class VSGAdmin {
		constructor() {
			this.init()
		}
		init() {
			$('.woocommerce_variation').each(function() {
				let gallery_wrapper = $(this).find('.form-row.form-row-full.variation-swatches-and-gallery--gallery-wrapper')
				$(this).find('.form-row.form-row-first.upload_image').append(gallery_wrapper)
			})
			$(document).on('click', '.variation-swatches-and-gallery--remove-galery-image', function(event) {
				let button = this;
				event.preventDefault();
				event.stopPropagation();
				$(button).parent().remove();
				$(button).closest('.woocommerce_variation').addClass('variation-needs-update');
				$('button.cancel-variation-changes, button.save-variation-changes').prop('disabled', false);
			})
			$(document).on('click', '.variation-swatches-and-gallery--add-galery-image', function(event) {
				let button = this;
				event.preventDefault();
				event.stopPropagation();
				let frame;
				let product_variation_id = $(this).data('product_variation_id');
				let loop = $(this).data('product_variation_loop');
				if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {
					if (frame) {
						frame.open();
						return;
					}
					frame = wp.media({
						library: {
							type: ['video', 'image']
						},
						multiple: true
					});
					frame.on('select', function() {
						let images = frame.state().get('selection').toJSON();
						let html = images.map(function(image) {
							if (image.type === 'image') {
								let id = image.id,
									_image$sizes = image.sizes;
								_image$sizes = _image$sizes === void 0 ? {} : _image$sizes;
								let thumbnail = _image$sizes.thumbnail,
									full = _image$sizes.full;
								let url = thumbnail ? thumbnail.url : full.url;
								let template = wp.template('variation-swatches-and-gallery--gallery-image');
								return template({
									id: id,
									url: url,
									product_variation_id: product_variation_id,
									loop: loop
								});
							}
						}).join('');
						$(button).parent().prev().find('.variation-swatches-and-gallery--gallery-images').append(html);
						$(button).closest('.woocommerce_variation').addClass('variation-needs-update');
						$('button.cancel-variation-changes, button.save-variation-changes').prop('disabled', false);
					});
					frame.open();
				}
			});
		}
	}
	$(document).ready(function($) {
		$('#woocommerce-product-data').on('woocommerce_variations_loaded', function() {
			new VSGAdmin();
		});
		$('#variable_product_options').on('woocommerce_variations_added', function() {
			new VSGAdmin();
		});
	});
})(jQuery);