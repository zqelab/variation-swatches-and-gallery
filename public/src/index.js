(function($, window, document, undefined) {
    'use strict';

    /**
     * VSG (Variation Swatch Generator) constructor function.
     * Initializes the variation swatches for WooCommerce products.
     * 
     * @param {HTMLElement} element - The DOM element that will be enhanced by VSG.
     * @param {Object} options - Configuration options for VSG.
     */
    function VSG(element, options) {
        this.element = element;
        this.settings = $.extend({}, {}, options);
        this.$element = $(element);
        this.$element.addClass('vsg-loaded');
        this.product_variations = this.$element.data('product_variations') || [];
        this.is_ajax_variation = this.product_variations.length > 0;
        this.attributeFields = this.$element.find('.variations select');
        this.init();
        this.update();
        this.tooltip();
    }

    // Extend the VSG prototype with methods.
    $.extend(VSG.prototype, {
        /**
         * Initializes the swatch items and attaches event handlers.
         */
        init: function() {
            // Iterate over each 'ul.vsg-swatch-items-wrapper' element found within the main element.
            this.$element.find('ul.vsg-swatch-items-wrapper').each(function(i, el) {
                // Find and store the sibling select element with class 'vsg-raw-select'.
                let select = $(this).siblings('select.vsg-raw-select');

                // Attach an event listener for the 'click' event on 'li.vsg-swatch-item' elements.
                $(this).on('click.vs', 'li.vsg-swatch-item', function(e) {
                    // Prevent the default action and stop the event from propagating up the DOM tree.
                    e.preventDefault();
                    e.stopPropagation();

                    // Get the value associated with the clicked swatch item.
                    let value = $(this).data('value');

                    // Check if the option to clear the selection on reselect is enabled 
                    // and if the current value of the select box matches the swatch value.
                    if (_VSG.option.single.clear_on_reselect && select.val() && select.val() === value) {
                        // Clear the select box value.
                        select.val('');
                    } else {
                        // Set the select box to the value of the clicked swatch.
                        select.val(value);
                    }

                    // Trigger change, click, and focusin events on the select box.
                    // This ensures that any other attached event handlers or UI updates are executed.
                    select.trigger('change');
                    select.trigger('click');
                    select.trigger('focusin');
                });
            });
        },


        /**
         * Updates the swatch UI in response to changes in variations.
         */
        update: function() {
            var plugin = this
            this.$element.on('woocommerce_variation_has_changed.vs', function(event) {
                plugin.swatchSetup();
                plugin.stockCount();
                plugin.selectedAttribute();
            })
        },

        /**
         * Sets up swatches based on available product variations.
         */
        swatchSetup: function() {
            this.$element.find('ul.vsg-swatch-items-wrapper').each(function(i, el) {
                var select = $(this).siblings('select.vsg-raw-select');
                var options_selected = select.find('option:selected').length === 0 ? null : select.find('option:selected').val();
                var selects = [];
                var disabled_selects = [];
                var options = select.find('option');
                options.each(function() {
                    if ($(this).val() !== '') {
                        selects.push($(this).val());
                    }
                });
                var options_disabled = select.find('option:disabled');
                options_disabled.each(function() {
                    if ($(this).val() !== '') {
                        disabled_selects.push($(this).val());
                    }
                });
                var in_stocks = _.difference(selects, disabled_selects);
                $(this).find('li.vsg-swatch-item').each(function(index, el) {
                    var attribute_value = $(this).attr('data-value');
                    $(this).removeClass('vsg-swatch-item-selected').addClass('vsg-swatch-item-disabled');
                    if (_.includes(in_stocks, attribute_value)) {
                        $(this).removeClass('vsg-swatch-item-selected vsg-swatch-item-disabled');
                        if (attribute_value === options_selected) {
                            $(this).addClass('vsg-swatch-item-selected');
                        }
                    }
                })
            })
        },

        /**
         * Updates the stock count display for each swatch item.
         */
        stockCount: function() {
            var plugin = this
            var selected_attribute = this.$element.find('ul.vsg-swatch-items-wrapper').find('li.vsg-swatch-item-selected')
            var selected_attribute_values = []
            var selected_attribute_names = []
            for (var i = 0; i < selected_attribute.length; i++) {
                selected_attribute_values.push($(selected_attribute[i]).data('value'))
                selected_attribute_names.push($(selected_attribute[i]).parent().data('attribute_name'))
            }
            this.$element.find('li.vsg-swatch-item').each(function(index, el) {
                var value = $(this).data('value');
                var attribute_name = $(this).parent().data('attribute_name');
                var stock_quantity = 0;
                for (var i = 0; i < plugin.product_variations.length; i++) {
                    var attributes = plugin.product_variations[i].attributes
                    var get_stock_quantity = plugin.product_variations[i].stock_quantity;
                    var checkemptykey = plugin.checkemptykey(attributes);
                    if (attributes[attribute_name] == value || !attributes[attribute_name]) {
                        for (var j = 0; j < selected_attribute_values.length; j++) {
                            var hasValue = Object.values(attributes).includes(selected_attribute_values[j])
                            if (hasValue === false && selected_attribute_names[j] !== attribute_name && attributes[attribute_name] && !checkemptykey.length) {
                                get_stock_quantity = 0
                            }
                            if (checkemptykey) {
                                if (!checkemptykey.includes(selected_attribute_names[j])) {
                                    var hasValue = Object.values(attributes).includes(selected_attribute_values[j])
                                    if (hasValue === false && selected_attribute_names[j] !== attribute_name) {
                                        get_stock_quantity = 0
                                    }
                                }
                            }
                        }
                        stock_quantity += get_stock_quantity;
                    }
                    $(this).find('.vsg-swatch-item-stock-count').text(stock_quantity + ' left')
                }
            })
        },

        /**
         * Updates the display of selected attributes.
         */
        selectedAttribute: function() {
            if (!_VSG.option.single.selected_variation_attribute_label) {
                return false
            }
            this.$element.find('li.vsg-swatch-item').each(function(index, el) {
                if ($(this).hasClass('vsg-swatch-item-selected')) {
                    var title = $(this).data('title');
                    if ($(this).parents('tr').find('th.label .selected-attribute').length === 0) {
                        $(this).parents('tr').find('th.label').append('<span class="selected-attribute"></span>');
                    }
                    $(this).parents('tr').find('th.label .selected-attribute').text(' ' + _VSG.option.single.label_separator + ' ' + title)
                }
                if ($(this).parent().find('.vsg-swatch-item-selected').length == 0) {
                    $(this).parents('tr').find('th.label .selected-attribute').remove();
                }
            })
        },

        /**
         * Initializes tooltips for swatch items.
         */
        tooltip: function() {
            this.$element.find('li.vsg-swatch-item').each(function(index, el) {
                $(this).mouseover(function() {
                    $(this).find('.vsg-swatch-item-tooltip').fadeIn('slow');
                })
                $(this).mouseleave(function() {
                    $(this).find('.vsg-swatch-item-tooltip').fadeOut('fast');
                })
            })
        },

        /**
         * Checks for empty keys in the product attributes.
         * @param {Object} attributes - Product attributes.
         * @returns {Array} Array of empty keys.
         */
        checkemptykey: function(attributes) {
            var empty = []
            for (const [key, value] of Object.entries(attributes)) {
                if (!value) {
                    empty.push(key)
                }
            }
            return empty;
        },
    });

    /**
     * jQuery plugin wrapper for VSG.
     * Ensures that each element is only initialized once.
     * 
     * @param {Object} options - Configuration options for VSG.
     */
    $.fn['VSG'] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'VSG')) {
                $.data(this, 'VSG', new VSG(this, options));
            }
        });
    };

})(jQuery, window, document);

(function($, window, document, undefined) {
    'use strict';

    // Listen for the 'wc_variation_form' event on the document.
    // This event is triggered when a WooCommerce variation form is initialized.
    $(document).on('wc_variation_form.vs', '.variations_form:not(.vsg-loaded)', function(event) {
        // Initialize the VSG (Variation Swatch Generator) for the form.
        $(this).VSG();
    });

    // Function to update the FlexSlider with new images.
    // This function takes an array or object of images as input.
    function vsg_update_flexslider(images) {
        // Fetch the FlexSlider instance attached to the WooCommerce product gallery.
        var vsg_flexslider = $('.woocommerce-product-gallery').data('flexslider');

        // Check if the FlexSlider instance exists.
        if (vsg_flexslider) {
            // Get the current slides in the FlexSlider.
            var slides = vsg_flexslider.slides;

            // Loop through and remove all existing slides from the FlexSlider.
            for (let j = 0; j < slides.length; j++) {
                vsg_flexslider.removeSlide(slides[j]);
            }

            // Loop through the images and add each as a new slide to the FlexSlider.
            for (var key in images) {
                if (images.hasOwnProperty(key)) {
                    const nelement = images[key];
                    vsg_flexslider.addSlide(nelement, 0);
                }
            }
        }
    }

    // Listen for the 'found_variation' event on variation forms not yet loaded with VSG.
    // This event is triggered when a product variation is selected.
    $('.variations_form:not(.vsg-loaded)').on('found_variation.vsg', function(e, variation) {
        console.log("found_variation");

        // Fetch the gallery images specific to the selected variation.
        var variation_gallery_images = variation.variation_gallery_images;

        // Update the FlexSlider with the variation-specific images.
        vsg_update_flexslider(variation_gallery_images);
    });

    // Listen for the 'reset_data' event on variation forms not yet loaded with VSG.
    // This event is typically triggered when the variation form is reset to its default state.
    $('.variations_form:not(.vsg-loaded)').on('reset_data.vsg', function(e) {
        // Fetch the default gallery images stored in the _VSG object.
        var gallery_images = _VSG.gallery_images;

        // Update the FlexSlider with the default gallery images.
        vsg_update_flexslider(gallery_images);
    });

})(jQuery, window, document);