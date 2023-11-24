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
         * Initializes the swatch items and attaches event handlers for user interactions.
         * This method is responsible for setting up the user interface for swatch selection.
         * It involves iterating over each swatch item and attaching click event handlers
         * to enable users to select product variations (e.g., color, size) through swatches.
         */
        init: function() {
            // Iterate over each 'ul.vsg-swatch-items-wrapper' element within the main plugin element.
            // These elements contain the individual swatch items for selection.
            this.$element.find('ul.vsg-swatch-items-wrapper').each(function(i, el) {
                // Find and store the sibling select element.
                // This select element is the original dropdown that is being replaced by swatch items.
                let select = $(this).siblings('select.vsg-raw-select');

                // Attach a click event listener to each 'li.vsg-swatch-item' within the swatch wrapper.
                // These are the individual swatch options that users can click.
                $(this).on('click.vsg', 'li.vsg-swatch-item', function(e) {
                    // Prevent the default action (e.g., navigating to a link) and stop event propagation
                    // to ensure that the click event does not affect other elements.
                    e.preventDefault();
                    e.stopPropagation();

                    // Retrieve the data value associated with the clicked swatch item.
                    // This value corresponds to the product variation that the swatch represents.
                    let value = $(this).data('value');

                    // Check if the option to clear the selection upon reselection is enabled.
                    // Also, check if the current value of the select box matches the swatch item's value.
                    if (_VSG.option.single.clear_on_reselect && select.val() && select.val() === value) {
                        // Clear the current value of the select box, essentially deselecting the swatch.
                        select.val('');
                    } else {
                        // Set the select box to the value of the clicked swatch,
                        // thereby selecting the swatch and the corresponding product variation.
                        select.val(value);
                    }

                    // Trigger 'change', 'click', and 'focusin' events on the select box.
                    // This ensures that any other event handlers attached to the select box
                    // are notified of the change in its value, allowing for UI updates or other actions.
                    select.trigger('change');
                    select.trigger('click');
                    select.trigger('focusin');
                });
            });
        },
 
        /**
         * Updates the swatch UI in response to changes in product variations.
         * This method is designed to be a response handler for the 'woocommerce_variation_has_changed.vsg' event.
         * It ensures that the swatch UI elements reflect the current state of product variations.
         * 
         * When a product variation changes (e.g., a different size or color is selected by the user),
         * this method triggers several key updates:
         * 1. It reconfigures the swatches display to match available variations (`swatchSetup`).
         * 2. It updates the stock count display for each swatch (`stockCount`).
         * 3. It updates the display of selected attributes (`selectedAttribute`).
         */
        update: function() {
            // Store a reference to the plugin instance.
            // This is necessary to maintain the correct context ('this') inside the callback function.
            var plugin = this;

            // Attach an event listener to the main element.
            // This listener responds to a custom event ('woocommerce_variation_has_changed.vsg'),
            // which is triggered when there's a change in the product variation.
            this.$element.on('woocommerce_variation_has_changed.vsg', function(event) {
                // Call the `swatchSetup` method to update the swatches display.
                plugin.swatchSetup();

                // Call the `stockCount` method to update the stock count display for each swatch.
                plugin.stockCount();

                // Call the `selectedAttribute` method to update the display of selected attributes.
                plugin.selectedAttribute();
            });
        },

        /**
         * Sets up swatches based on the available product variations.
         * This method is responsible for configuring the swatch items according to the current state of the product variations.
         * It updates the UI to reflect which variations are available and which are currently selected.
         */
        swatchSetup: function() {
            // Iterate over each 'ul.vsg-swatch-items-wrapper' element. These elements contain the swatch items.
            this.$element.find('ul.vsg-swatch-items-wrapper').each(function(i, el) {
                // Find the sibling select element that represents the raw product variations.
                var select = $(this).siblings('select.vsg-raw-select');

                // Determine the currently selected option, if any.
                var options_selected = select.find('option:selected').length === 0 ? null : select.find('option:selected').val();

                // Initialize arrays to store the values of selectable and disabled options.
                var selects = [];
                var disabled_selects = [];

                // Populate the 'selects' array with the values of all non-empty options.
                var options = select.find('option');
                options.each(function() {
                    if ($(this).val() !== '') {
                        selects.push($(this).val());
                    }
                });

                // Populate the 'disabled_selects' array with values of disabled options.
                var options_disabled = select.find('option:disabled');
                options_disabled.each(function() {
                    if ($(this).val() !== '') {
                        disabled_selects.push($(this).val());
                    }
                });

                // Calculate the difference between selectable and disabled options to get the available (in-stock) options.
                var in_stocks = _.difference(selects, disabled_selects);

                // Iterate over each swatch item to update its state based on availability and selection status.
                $(this).find('li.vsg-swatch-item').each(function(index, el) {
                    // Retrieve the value associated with the swatch item.
                    var attribute_value = $(this).attr('data-value');

                    // Reset the state of the swatch item, marking it as disabled by default.
                    $(this).removeClass('vsg-swatch-item-selected').addClass('vsg-swatch-item-disabled');

                    // If the swatch item's value is in the list of available options, update its state.
                    if (_.includes(in_stocks, attribute_value)) {
                        $(this).removeClass('vsg-swatch-item-selected vsg-swatch-item-disabled');

                        // If the swatch item's value matches the currently selected option, mark it as selected.
                        if (attribute_value === options_selected) {
                            $(this).addClass('vsg-swatch-item-selected');
                        }
                    }
                });
            });
        },

        /**
         * Updates the stock count display for each swatch item.
         * This method calculates and displays the available stock for each product variation
         * represented by swatch items. It considers the currently selected attributes and 
         * adjusts the stock counts based on product variations data.
         */
        stockCount: function() {
            // Store a reference to the plugin instance to access its properties and methods within callback functions.
            var plugin = this;

            // Collect the currently selected swatch items and their corresponding attribute values and names.
            var selected_attribute = this.$element.find('ul.vsg-swatch-items-wrapper').find('li.vsg-swatch-item-selected');
            var selected_attribute_values = []; // Array to store values of selected attributes.
            var selected_attribute_names = []; // Array to store names of attributes corresponding to selected values.
            for (var i = 0; i < selected_attribute.length; i++) {
                selected_attribute_values.push($(selected_attribute[i]).data('value')); // Push the value of the selected attribute.
                selected_attribute_names.push($(selected_attribute[i]).parent().data('attribute_name')); // Push the name of the attribute.
            }

            // Iterate over each swatch item to update its stock count based on available variations.
            this.$element.find('li.vsg-swatch-item').each(function(index, el) {
                var value = $(this).data('value'); // Retrieve the value attribute of the swatch item.
                var attribute_name = $(this).parent().data('attribute_name'); // Retrieve the attribute name of the swatch item.
                var stock_quantity = 0; // Initialize the stock quantity for the swatch item.

                // Loop through the product variations to calculate stock counts.
                for (var i = 0; i < plugin.product_variations.length; i++) {
                    var attributes = plugin.product_variations[i].attributes; // Get the attributes for the current variation.
                    var get_stock_quantity = plugin.product_variations[i].stock_quantity; // Get the stock quantity for the current variation.

                    // Check for attributes that are not set (empty) in the variation.
                    var checkemptykey = plugin.checkemptykey(attributes); // Call the 'checkemptykey' method to identify empty attributes.

                    // Determine if the current swatch item's value matches the variation's attribute value or if the attribute is not set.
                    if (attributes[attribute_name] == value || !attributes[attribute_name]) {
                        // Iterate over selected attributes to adjust the stock count based on other selections.
                        for (var j = 0; j < selected_attribute_values.length; j++) {
                            var hasValue = Object.values(attributes).includes(selected_attribute_values[j]);

                            // If the current variation doesn't have the selected attribute value,
                            // and the attribute being checked is different from the current attribute (avoid self-reference),
                            // and the attribute for the current variation is set, and no empty keys are found,
                            // then set the stock quantity for this variation to 0 (not available).
                            if (!hasValue && selected_attribute_names[j] !== attribute_name && attributes[attribute_name] && !checkemptykey.length) {
                                get_stock_quantity = 0;
                            }

                            // Additional logic to handle variations with empty attribute keys.
                            if (checkemptykey) {
                                if (!checkemptykey.includes(selected_attribute_names[j])) {
                                    hasValue = Object.values(attributes).includes(selected_attribute_values[j]);
                                    if (!hasValue && selected_attribute_names[j] !== attribute_name) {
                                        get_stock_quantity = 0;
                                    }
                                }
                            }
                        }
                        stock_quantity += get_stock_quantity; // Accumulate the stock quantities.
                    }
                    // Update the swatch item element with the calculated stock quantity.
                    $(this).find('.vsg-swatch-item-stock-count').text(stock_quantity + ' left');
                }
            });
        },

        /**
         * Updates the display of selected attributes on the product page.
         * This method enhances the user interface by indicating which attributes (e.g., color, size) 
         * have been selected by the user through swatch items. It dynamically updates the attribute 
         * labels to reflect the current selections.
         */
        selectedAttribute: function() {
            // Check if the feature to show selected attribute labels is enabled in the settings.
            // If not, exit the function early.
            if (!_VSG.option.single.selected_variation_attribute_label) {
                return false;
            }

            // Iterate over each swatch item within the element.
            // This loop handles the display of labels for each selected attribute.
            this.$element.find('li.vsg-swatch-item').each(function(index, el) {
                // Check if the current swatch item is selected.
                if ($(this).hasClass('vsg-swatch-item-selected')) {
                    var title = $(this).data('title'); // Retrieve the title of the selected swatch item, which represents the attribute value.

                    // Check if a label for the selected attribute already exists in the DOM.
                    // If it doesn't exist, create and append a new 'span' element for it.
                    if ($(this).parents('tr').find('th.label .selected-attribute').length === 0) {
                        $(this).parents('tr').find('th.label').append('<span class="selected-attribute"></span>');
                    }

                    // Update the text of the selected attribute label.
                    // The label text includes a separator (defined in the plugin's options) and the title of the selected swatch item.
                    $(this).parents('tr').find('th.label .selected-attribute').text(' ' + _VSG.option.single.label_separator + ' ' + title);
                }

                // If there are no selected swatch items within the current swatch's parent element,
                // remove the label for the selected attribute, as no attribute is selected in this category.
                if ($(this).parent().find('.vsg-swatch-item-selected').length == 0) {
                    $(this).parents('tr').find('th.label .selected-attribute').remove();
                }
            });
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
    $(document).on('wc_variation_form.vsg', '.variations_form:not(.vsg-loaded)', function(event) {
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