/******/ (() => { // webpackBootstrap
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************!*\
  !*** ./public/src/index.js ***!
  \*****************************/
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
(function ($, window, document, undefined) {
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
    init: function init() {
      // Iterate over each 'ul.vsg-swatch-items-wrapper' element within the main plugin element.
      // These elements contain the individual swatch items for selection.
      this.$element.find('ul.vsg-swatch-items-wrapper').each(function (i, el) {
        // Find and store the sibling select element.
        // This select element is the original dropdown that is being replaced by swatch items.
        var select = $(this).siblings('select.vsg-raw-select');

        // Attach a click event listener to each 'li.vsg-swatch-item' within the swatch wrapper.
        // These are the individual swatch options that users can click.
        $(this).on('click.vs', 'li.vsg-swatch-item', function (e) {
          // Prevent the default action (e.g., navigating to a link) and stop event propagation
          // to ensure that the click event does not affect other elements.
          e.preventDefault();
          e.stopPropagation();

          // Retrieve the data value associated with the clicked swatch item.
          // This value corresponds to the product variation that the swatch represents.
          var value = $(this).data('value');

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
     * This method is designed to be a response handler for the 'woocommerce_variation_has_changed.vs' event.
     * It ensures that the swatch UI elements reflect the current state of product variations.
     * 
     * When a product variation changes (e.g., a different size or color is selected by the user),
     * this method triggers several key updates:
     * 1. It reconfigures the swatches display to match available variations (`swatchSetup`).
     * 2. It updates the stock count display for each swatch (`stockCount`).
     * 3. It updates the display of selected attributes (`selectedAttribute`).
     */
    update: function update() {
      // Store a reference to the plugin instance.
      // This is necessary to maintain the correct context ('this') inside the callback function.
      var plugin = this;

      // Attach an event listener to the main element.
      // This listener responds to a custom event ('woocommerce_variation_has_changed.vs'),
      // which is triggered when there's a change in the product variation.
      this.$element.on('woocommerce_variation_has_changed.vs', function (event) {
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
    swatchSetup: function swatchSetup() {
      // Iterate over each 'ul.vsg-swatch-items-wrapper' element. These elements contain the swatch items.
      this.$element.find('ul.vsg-swatch-items-wrapper').each(function (i, el) {
        // Find the sibling select element that represents the raw product variations.
        var select = $(this).siblings('select.vsg-raw-select');

        // Determine the currently selected option, if any.
        var options_selected = select.find('option:selected').length === 0 ? null : select.find('option:selected').val();

        // Initialize arrays to store the values of selectable and disabled options.
        var selects = [];
        var disabled_selects = [];

        // Populate the 'selects' array with the values of all non-empty options.
        var options = select.find('option');
        options.each(function () {
          if ($(this).val() !== '') {
            selects.push($(this).val());
          }
        });

        // Populate the 'disabled_selects' array with values of disabled options.
        var options_disabled = select.find('option:disabled');
        options_disabled.each(function () {
          if ($(this).val() !== '') {
            disabled_selects.push($(this).val());
          }
        });

        // Calculate the difference between selectable and disabled options to get the available (in-stock) options.
        var in_stocks = _.difference(selects, disabled_selects);

        // Iterate over each swatch item to update its state based on availability and selection status.
        $(this).find('li.vsg-swatch-item').each(function (index, el) {
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
    stockCount: function stockCount() {
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
      this.$element.find('li.vsg-swatch-item').each(function (index, el) {
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
    selectedAttribute: function selectedAttribute() {
      // Check if the feature to show selected attribute labels is enabled in the settings.
      // If not, exit the function early.
      if (!_VSG.option.single.selected_variation_attribute_label) {
        return false;
      }

      // Iterate over each swatch item within the element.
      // This loop handles the display of labels for each selected attribute.
      this.$element.find('li.vsg-swatch-item').each(function (index, el) {
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
    tooltip: function tooltip() {
      this.$element.find('li.vsg-swatch-item').each(function (index, el) {
        $(this).mouseover(function () {
          $(this).find('.vsg-swatch-item-tooltip').fadeIn('slow');
        });
        $(this).mouseleave(function () {
          $(this).find('.vsg-swatch-item-tooltip').fadeOut('fast');
        });
      });
    },
    /**
     * Checks for empty keys in the product attributes.
     * @param {Object} attributes - Product attributes.
     * @returns {Array} Array of empty keys.
     */
    checkemptykey: function checkemptykey(attributes) {
      var empty = [];
      for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        if (!value) {
          empty.push(key);
        }
      }
      return empty;
    }
  });

  /**
   * jQuery plugin wrapper for VSG.
   * Ensures that each element is only initialized once.
   * 
   * @param {Object} options - Configuration options for VSG.
   */
  $.fn['VSG'] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'VSG')) {
        $.data(this, 'VSG', new VSG(this, options));
      }
    });
  };
})(jQuery, window, document);
(function ($, window, document, undefined) {
  'use strict';

  // Listen for the 'wc_variation_form' event on the document.
  // This event is triggered when a WooCommerce variation form is initialized.
  $(document).on('wc_variation_form.vs', '.variations_form:not(.vsg-loaded)', function (event) {
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
      for (var j = 0; j < slides.length; j++) {
        vsg_flexslider.removeSlide(slides[j]);
      }

      // Loop through the images and add each as a new slide to the FlexSlider.
      for (var key in images) {
        if (images.hasOwnProperty(key)) {
          var nelement = images[key];
          vsg_flexslider.addSlide(nelement, 0);
        }
      }
    }
  }

  // Listen for the 'found_variation' event on variation forms not yet loaded with VSG.
  // This event is triggered when a product variation is selected.
  $('.variations_form:not(.vsg-loaded)').on('found_variation.vsg', function (e, variation) {
    console.log("found_variation");

    // Fetch the gallery images specific to the selected variation.
    var variation_gallery_images = variation.variation_gallery_images;

    // Update the FlexSlider with the variation-specific images.
    vsg_update_flexslider(variation_gallery_images);
  });

  // Listen for the 'reset_data' event on variation forms not yet loaded with VSG.
  // This event is typically triggered when the variation form is reset to its default state.
  $('.variations_form:not(.vsg-loaded)').on('reset_data.vsg', function (e) {
    // Fetch the default gallery images stored in the _VSG object.
    var gallery_images = _VSG.gallery_images;

    // Update the FlexSlider with the default gallery images.
    vsg_update_flexslider(gallery_images);
  });
})(jQuery, window, document);
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************!*\
  !*** ./public/src/styles/index.scss ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljL2pzL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsQ0FBQyxVQUFTQSxDQUFDLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQUU7RUFDdEMsWUFBWTs7RUFFWjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNJLFNBQVNDLEdBQUdBLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQzNCLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0UsUUFBUSxHQUFHUCxDQUFDLENBQUNRLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRUYsT0FBTyxDQUFDO0lBQ3pDLElBQUksQ0FBQ0csUUFBUSxHQUFHVCxDQUFDLENBQUNLLE9BQU8sQ0FBQztJQUMxQixJQUFJLENBQUNJLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUNwQyxJQUFJLENBQUNDLGtCQUFrQixHQUFHLElBQUksQ0FBQ0YsUUFBUSxDQUFDRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO0lBQ3hFLElBQUksQ0FBQ0MsaUJBQWlCLEdBQUcsSUFBSSxDQUFDRixrQkFBa0IsQ0FBQ0csTUFBTSxHQUFHLENBQUM7SUFDM0QsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDTixRQUFRLENBQUNPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUMvRCxJQUFJLENBQUNDLElBQUksRUFBRTtJQUNYLElBQUksQ0FBQ0MsTUFBTSxFQUFFO0lBQ2IsSUFBSSxDQUFDQyxPQUFPLEVBQUU7RUFDbEI7O0VBRUE7RUFDQW5CLENBQUMsQ0FBQ1EsTUFBTSxDQUFDSixHQUFHLENBQUNn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Q0FBQyxFQUFFO1VBQzVCLElBQU1TLFFBQVEsR0FBR0wsTUFBTSxDQUFDSixHQUFHLENBQUM7VUFDNUJLLGNBQWMsQ0FBQ0ssUUFBUSxDQUFDRCxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDO01BQ0o7SUFDSjtFQUNKOztFQUVBO0VBQ0E7RUFDQS9GLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDMEIsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFVBQVNDLENBQUMsRUFBRXNFLFNBQVMsRUFBRTtJQUNwRkMsT0FBTyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7O0lBRTlCO0lBQ0EsSUFBSUMsd0JBQXdCLEdBQUdILFNBQVMsQ0FBQ0csd0JBQXdCOztJQUVqRTtJQUNBWCxxQkFBcUIsQ0FBQ1csd0JBQXdCLENBQUM7RUFDbkQsQ0FBQyxDQUFDOztFQUVGO0VBQ0E7RUFDQXBHLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDMEIsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVNDLENBQUMsRUFBRTtJQUNwRTtJQUNBLElBQUkwRSxjQUFjLEdBQUd0RSxJQUFJLENBQUNzRSxjQUFjOztJQUV4QztJQUNBWixxQkFBcUIsQ0FBQ1ksY0FBYyxDQUFDO0VBQ3pDLENBQUMsQ0FBQztBQUVOLENBQUMsRUFBRWIsTUFBTSxFQUFFdkYsTUFBTSxFQUFFQyxRQUFRLENBQUMsQzs7Ozs7Ozs7OztBQ2pYNUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5Ly4vcHVibGljL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvLi9wdWJsaWMvc3JjL3N0eWxlcy9pbmRleC5zY3NzPzQzMjQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKipcbiAgICAgKiBWU0cgKFZhcmlhdGlvbiBTd2F0Y2ggR2VuZXJhdG9yKSBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICAgKiBJbml0aWFsaXplcyB0aGUgdmFyaWF0aW9uIHN3YXRjaGVzIGZvciBXb29Db21tZXJjZSBwcm9kdWN0cy5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50IHRoYXQgd2lsbCBiZSBlbmhhbmNlZCBieSBWU0cuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIFZTRy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBWU0coZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIHt9LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3ZzZy1sb2FkZWQnKTtcbiAgICAgICAgdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnMgPSB0aGlzLiRlbGVtZW50LmRhdGEoJ3Byb2R1Y3RfdmFyaWF0aW9ucycpIHx8IFtdO1xuICAgICAgICB0aGlzLmlzX2FqYXhfdmFyaWF0aW9uID0gdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnMubGVuZ3RoID4gMDtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVGaWVsZHMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy52YXJpYXRpb25zIHNlbGVjdCcpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgdGhpcy50b29sdGlwKCk7XG4gICAgfVxuXG4gICAgLy8gRXh0ZW5kIHRoZSBWU0cgcHJvdG90eXBlIHdpdGggbWV0aG9kcy5cbiAgICAkLmV4dGVuZChWU0cucHJvdG90eXBlLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplcyB0aGUgc3dhdGNoIGl0ZW1zIGFuZCBhdHRhY2hlcyBldmVudCBoYW5kbGVycyBmb3IgdXNlciBpbnRlcmFjdGlvbnMuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHJlc3BvbnNpYmxlIGZvciBzZXR0aW5nIHVwIHRoZSB1c2VyIGludGVyZmFjZSBmb3Igc3dhdGNoIHNlbGVjdGlvbi5cbiAgICAgICAgICogSXQgaW52b2x2ZXMgaXRlcmF0aW5nIG92ZXIgZWFjaCBzd2F0Y2ggaXRlbSBhbmQgYXR0YWNoaW5nIGNsaWNrIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgICAqIHRvIGVuYWJsZSB1c2VycyB0byBzZWxlY3QgcHJvZHVjdCB2YXJpYXRpb25zIChlLmcuLCBjb2xvciwgc2l6ZSkgdGhyb3VnaCBzd2F0Y2hlcy5cbiAgICAgICAgICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggJ3VsLnZzZy1zd2F0Y2gtaXRlbXMtd3JhcHBlcicgZWxlbWVudCB3aXRoaW4gdGhlIG1haW4gcGx1Z2luIGVsZW1lbnQuXG4gICAgICAgICAgICAvLyBUaGVzZSBlbGVtZW50cyBjb250YWluIHRoZSBpbmRpdmlkdWFsIHN3YXRjaCBpdGVtcyBmb3Igc2VsZWN0aW9uLlxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgLy8gRmluZCBhbmQgc3RvcmUgdGhlIHNpYmxpbmcgc2VsZWN0IGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBzZWxlY3QgZWxlbWVudCBpcyB0aGUgb3JpZ2luYWwgZHJvcGRvd24gdGhhdCBpcyBiZWluZyByZXBsYWNlZCBieSBzd2F0Y2ggaXRlbXMuXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52c2ctcmF3LXNlbGVjdCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoIGEgY2xpY2sgZXZlbnQgbGlzdGVuZXIgdG8gZWFjaCAnbGkudnNnLXN3YXRjaC1pdGVtJyB3aXRoaW4gdGhlIHN3YXRjaCB3cmFwcGVyLlxuICAgICAgICAgICAgICAgIC8vIFRoZXNlIGFyZSB0aGUgaW5kaXZpZHVhbCBzd2F0Y2ggb3B0aW9ucyB0aGF0IHVzZXJzIGNhbiBjbGljay5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljay52cycsICdsaS52c2ctc3dhdGNoLWl0ZW0nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIChlLmcuLCBuYXZpZ2F0aW5nIHRvIGEgbGluaykgYW5kIHN0b3AgZXZlbnQgcHJvcGFnYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gZW5zdXJlIHRoYXQgdGhlIGNsaWNrIGV2ZW50IGRvZXMgbm90IGFmZmVjdCBvdGhlciBlbGVtZW50cy5cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJldHJpZXZlIHRoZSBkYXRhIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xpY2tlZCBzd2F0Y2ggaXRlbS5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyB2YWx1ZSBjb3JyZXNwb25kcyB0byB0aGUgcHJvZHVjdCB2YXJpYXRpb24gdGhhdCB0aGUgc3dhdGNoIHJlcHJlc2VudHMuXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9ICQodGhpcykuZGF0YSgndmFsdWUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgb3B0aW9uIHRvIGNsZWFyIHRoZSBzZWxlY3Rpb24gdXBvbiByZXNlbGVjdGlvbiBpcyBlbmFibGVkLlxuICAgICAgICAgICAgICAgICAgICAvLyBBbHNvLCBjaGVjayBpZiB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgc2VsZWN0IGJveCBtYXRjaGVzIHRoZSBzd2F0Y2ggaXRlbSdzIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoX1ZTRy5vcHRpb24uc2luZ2xlLmNsZWFyX29uX3Jlc2VsZWN0ICYmIHNlbGVjdC52YWwoKSAmJiBzZWxlY3QudmFsKCkgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgc2VsZWN0IGJveCwgZXNzZW50aWFsbHkgZGVzZWxlY3RpbmcgdGhlIHN3YXRjaC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBzZWxlY3QgYm94IHRvIHRoZSB2YWx1ZSBvZiB0aGUgY2xpY2tlZCBzd2F0Y2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVyZWJ5IHNlbGVjdGluZyB0aGUgc3dhdGNoIGFuZCB0aGUgY29ycmVzcG9uZGluZyBwcm9kdWN0IHZhcmlhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVHJpZ2dlciAnY2hhbmdlJywgJ2NsaWNrJywgYW5kICdmb2N1c2luJyBldmVudHMgb24gdGhlIHNlbGVjdCBib3guXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IGFueSBvdGhlciBldmVudCBoYW5kbGVycyBhdHRhY2hlZCB0byB0aGUgc2VsZWN0IGJveFxuICAgICAgICAgICAgICAgICAgICAvLyBhcmUgbm90aWZpZWQgb2YgdGhlIGNoYW5nZSBpbiBpdHMgdmFsdWUsIGFsbG93aW5nIGZvciBVSSB1cGRhdGVzIG9yIG90aGVyIGFjdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdmb2N1c2luJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgdGhlIHN3YXRjaCBVSSBpbiByZXNwb25zZSB0byBjaGFuZ2VzIGluIHByb2R1Y3QgdmFyaWF0aW9ucy5cbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgZGVzaWduZWQgdG8gYmUgYSByZXNwb25zZSBoYW5kbGVyIGZvciB0aGUgJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52cycgZXZlbnQuXG4gICAgICAgICAqIEl0IGVuc3VyZXMgdGhhdCB0aGUgc3dhdGNoIFVJIGVsZW1lbnRzIHJlZmxlY3QgdGhlIGN1cnJlbnQgc3RhdGUgb2YgcHJvZHVjdCB2YXJpYXRpb25zLlxuICAgICAgICAgKiBcbiAgICAgICAgICogV2hlbiBhIHByb2R1Y3QgdmFyaWF0aW9uIGNoYW5nZXMgKGUuZy4sIGEgZGlmZmVyZW50IHNpemUgb3IgY29sb3IgaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIpLFxuICAgICAgICAgKiB0aGlzIG1ldGhvZCB0cmlnZ2VycyBzZXZlcmFsIGtleSB1cGRhdGVzOlxuICAgICAgICAgKiAxLiBJdCByZWNvbmZpZ3VyZXMgdGhlIHN3YXRjaGVzIGRpc3BsYXkgdG8gbWF0Y2ggYXZhaWxhYmxlIHZhcmlhdGlvbnMgKGBzd2F0Y2hTZXR1cGApLlxuICAgICAgICAgKiAyLiBJdCB1cGRhdGVzIHRoZSBzdG9jayBjb3VudCBkaXNwbGF5IGZvciBlYWNoIHN3YXRjaCAoYHN0b2NrQ291bnRgKS5cbiAgICAgICAgICogMy4gSXQgdXBkYXRlcyB0aGUgZGlzcGxheSBvZiBzZWxlY3RlZCBhdHRyaWJ1dGVzIChgc2VsZWN0ZWRBdHRyaWJ1dGVgKS5cbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBTdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgcGx1Z2luIGluc3RhbmNlLlxuICAgICAgICAgICAgLy8gVGhpcyBpcyBuZWNlc3NhcnkgdG8gbWFpbnRhaW4gdGhlIGNvcnJlY3QgY29udGV4dCAoJ3RoaXMnKSBpbnNpZGUgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWFpbiBlbGVtZW50LlxuICAgICAgICAgICAgLy8gVGhpcyBsaXN0ZW5lciByZXNwb25kcyB0byBhIGN1c3RvbSBldmVudCAoJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52cycpLFxuICAgICAgICAgICAgLy8gd2hpY2ggaXMgdHJpZ2dlcmVkIHdoZW4gdGhlcmUncyBhIGNoYW5nZSBpbiB0aGUgcHJvZHVjdCB2YXJpYXRpb24uXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudnMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGBzd2F0Y2hTZXR1cGAgbWV0aG9kIHRvIHVwZGF0ZSB0aGUgc3dhdGNoZXMgZGlzcGxheS5cbiAgICAgICAgICAgICAgICBwbHVnaW4uc3dhdGNoU2V0dXAoKTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGBzdG9ja0NvdW50YCBtZXRob2QgdG8gdXBkYXRlIHRoZSBzdG9jayBjb3VudCBkaXNwbGF5IGZvciBlYWNoIHN3YXRjaC5cbiAgICAgICAgICAgICAgICBwbHVnaW4uc3RvY2tDb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgYHNlbGVjdGVkQXR0cmlidXRlYCBtZXRob2QgdG8gdXBkYXRlIHRoZSBkaXNwbGF5IG9mIHNlbGVjdGVkIGF0dHJpYnV0ZXMuXG4gICAgICAgICAgICAgICAgcGx1Z2luLnNlbGVjdGVkQXR0cmlidXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB1cCBzd2F0Y2hlcyBiYXNlZCBvbiB0aGUgYXZhaWxhYmxlIHByb2R1Y3QgdmFyaWF0aW9ucy5cbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgcmVzcG9uc2libGUgZm9yIGNvbmZpZ3VyaW5nIHRoZSBzd2F0Y2ggaXRlbXMgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcm9kdWN0IHZhcmlhdGlvbnMuXG4gICAgICAgICAqIEl0IHVwZGF0ZXMgdGhlIFVJIHRvIHJlZmxlY3Qgd2hpY2ggdmFyaWF0aW9ucyBhcmUgYXZhaWxhYmxlIGFuZCB3aGljaCBhcmUgY3VycmVudGx5IHNlbGVjdGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgc3dhdGNoU2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggJ3VsLnZzZy1zd2F0Y2gtaXRlbXMtd3JhcHBlcicgZWxlbWVudC4gVGhlc2UgZWxlbWVudHMgY29udGFpbiB0aGUgc3dhdGNoIGl0ZW1zLlxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgLy8gRmluZCB0aGUgc2libGluZyBzZWxlY3QgZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHJhdyBwcm9kdWN0IHZhcmlhdGlvbnMuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52c2ctcmF3LXNlbGVjdCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9uLCBpZiBhbnkuXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNfc2VsZWN0ZWQgPSBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykubGVuZ3RoID09PSAwID8gbnVsbCA6IHNlbGVjdC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcblxuICAgICAgICAgICAgICAgIC8vIEluaXRpYWxpemUgYXJyYXlzIHRvIHN0b3JlIHRoZSB2YWx1ZXMgb2Ygc2VsZWN0YWJsZSBhbmQgZGlzYWJsZWQgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0cyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZF9zZWxlY3RzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgJ3NlbGVjdHMnIGFycmF5IHdpdGggdGhlIHZhbHVlcyBvZiBhbGwgbm9uLWVtcHR5IG9wdGlvbnMuXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxlY3QuZmluZCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdHMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gUG9wdWxhdGUgdGhlICdkaXNhYmxlZF9zZWxlY3RzJyBhcnJheSB3aXRoIHZhbHVlcyBvZiBkaXNhYmxlZCBvcHRpb25zLlxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zX2Rpc2FibGVkID0gc2VsZWN0LmZpbmQoJ29wdGlvbjpkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnNfZGlzYWJsZWQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZF9zZWxlY3RzLnB1c2goJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHNlbGVjdGFibGUgYW5kIGRpc2FibGVkIG9wdGlvbnMgdG8gZ2V0IHRoZSBhdmFpbGFibGUgKGluLXN0b2NrKSBvcHRpb25zLlxuICAgICAgICAgICAgICAgIHZhciBpbl9zdG9ja3MgPSBfLmRpZmZlcmVuY2Uoc2VsZWN0cywgZGlzYWJsZWRfc2VsZWN0cyk7XG5cbiAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZWFjaCBzd2F0Y2ggaXRlbSB0byB1cGRhdGUgaXRzIHN0YXRlIGJhc2VkIG9uIGF2YWlsYWJpbGl0eSBhbmQgc2VsZWN0aW9uIHN0YXR1cy5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJldHJpZXZlIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIHN3YXRjaCBpdGVtLlxuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX3ZhbHVlID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHN0YXRlIG9mIHRoZSBzd2F0Y2ggaXRlbSwgbWFya2luZyBpdCBhcyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5hZGRDbGFzcygndnNnLXN3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHN3YXRjaCBpdGVtJ3MgdmFsdWUgaXMgaW4gdGhlIGxpc3Qgb2YgYXZhaWxhYmxlIG9wdGlvbnMsIHVwZGF0ZSBpdHMgc3RhdGUuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGVzKGluX3N0b2NrcywgYXR0cmlidXRlX3ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkIHZzZy1zd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgc3dhdGNoIGl0ZW0ncyB2YWx1ZSBtYXRjaGVzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9uLCBtYXJrIGl0IGFzIHNlbGVjdGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZV92YWx1ZSA9PT0gb3B0aW9uc19zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyB0aGUgc3RvY2sgY291bnQgZGlzcGxheSBmb3IgZWFjaCBzd2F0Y2ggaXRlbS5cbiAgICAgICAgICogVGhpcyBtZXRob2QgY2FsY3VsYXRlcyBhbmQgZGlzcGxheXMgdGhlIGF2YWlsYWJsZSBzdG9jayBmb3IgZWFjaCBwcm9kdWN0IHZhcmlhdGlvblxuICAgICAgICAgKiByZXByZXNlbnRlZCBieSBzd2F0Y2ggaXRlbXMuIEl0IGNvbnNpZGVycyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGF0dHJpYnV0ZXMgYW5kIFxuICAgICAgICAgKiBhZGp1c3RzIHRoZSBzdG9jayBjb3VudHMgYmFzZWQgb24gcHJvZHVjdCB2YXJpYXRpb25zIGRhdGEuXG4gICAgICAgICAqL1xuICAgICAgICBzdG9ja0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBwbHVnaW4gaW5zdGFuY2UgdG8gYWNjZXNzIGl0cyBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIHdpdGhpbiBjYWxsYmFjayBmdW5jdGlvbnMuXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gdGhpcztcblxuICAgICAgICAgICAgLy8gQ29sbGVjdCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHN3YXRjaCBpdGVtcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGUgdmFsdWVzIGFuZCBuYW1lcy5cbiAgICAgICAgICAgIHZhciBzZWxlY3RlZF9hdHRyaWJ1dGUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ3VsLnZzZy1zd2F0Y2gtaXRlbXMtd3JhcHBlcicpLmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXMgPSBbXTsgLy8gQXJyYXkgdG8gc3RvcmUgdmFsdWVzIG9mIHNlbGVjdGVkIGF0dHJpYnV0ZXMuXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzID0gW107IC8vIEFycmF5IHRvIHN0b3JlIG5hbWVzIG9mIGF0dHJpYnV0ZXMgY29ycmVzcG9uZGluZyB0byBzZWxlY3RlZCB2YWx1ZXMuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkX2F0dHJpYnV0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXMucHVzaCgkKHNlbGVjdGVkX2F0dHJpYnV0ZVtpXSkuZGF0YSgndmFsdWUnKSk7IC8vIFB1c2ggdGhlIHZhbHVlIG9mIHRoZSBzZWxlY3RlZCBhdHRyaWJ1dGUuXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzLnB1c2goJChzZWxlY3RlZF9hdHRyaWJ1dGVbaV0pLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJykpOyAvLyBQdXNoIHRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIHN3YXRjaCBpdGVtIHRvIHVwZGF0ZSBpdHMgc3RvY2sgY291bnQgYmFzZWQgb24gYXZhaWxhYmxlIHZhcmlhdGlvbnMuXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpOyAvLyBSZXRyaWV2ZSB0aGUgdmFsdWUgYXR0cmlidXRlIG9mIHRoZSBzd2F0Y2ggaXRlbS5cbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX25hbWUgPSAkKHRoaXMpLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJyk7IC8vIFJldHJpZXZlIHRoZSBhdHRyaWJ1dGUgbmFtZSBvZiB0aGUgc3dhdGNoIGl0ZW0uXG4gICAgICAgICAgICAgICAgdmFyIHN0b2NrX3F1YW50aXR5ID0gMDsgLy8gSW5pdGlhbGl6ZSB0aGUgc3RvY2sgcXVhbnRpdHkgZm9yIHRoZSBzd2F0Y2ggaXRlbS5cblxuICAgICAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgcHJvZHVjdCB2YXJpYXRpb25zIHRvIGNhbGN1bGF0ZSBzdG9jayBjb3VudHMuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW4ucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gcGx1Z2luLnByb2R1Y3RfdmFyaWF0aW9uc1tpXS5hdHRyaWJ1dGVzOyAvLyBHZXQgdGhlIGF0dHJpYnV0ZXMgZm9yIHRoZSBjdXJyZW50IHZhcmlhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGdldF9zdG9ja19xdWFudGl0eSA9IHBsdWdpbi5wcm9kdWN0X3ZhcmlhdGlvbnNbaV0uc3RvY2tfcXVhbnRpdHk7IC8vIEdldCB0aGUgc3RvY2sgcXVhbnRpdHkgZm9yIHRoZSBjdXJyZW50IHZhcmlhdGlvbi5cblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgYXR0cmlidXRlcyB0aGF0IGFyZSBub3Qgc2V0IChlbXB0eSkgaW4gdGhlIHZhcmlhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrZW1wdHlrZXkgPSBwbHVnaW4uY2hlY2tlbXB0eWtleShhdHRyaWJ1dGVzKTsgLy8gQ2FsbCB0aGUgJ2NoZWNrZW1wdHlrZXknIG1ldGhvZCB0byBpZGVudGlmeSBlbXB0eSBhdHRyaWJ1dGVzLlxuXG4gICAgICAgICAgICAgICAgICAgIC8vIERldGVybWluZSBpZiB0aGUgY3VycmVudCBzd2F0Y2ggaXRlbSdzIHZhbHVlIG1hdGNoZXMgdGhlIHZhcmlhdGlvbidzIGF0dHJpYnV0ZSB2YWx1ZSBvciBpZiB0aGUgYXR0cmlidXRlIGlzIG5vdCBzZXQuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSA9PSB2YWx1ZSB8fCAhYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBzZWxlY3RlZCBhdHRyaWJ1dGVzIHRvIGFkanVzdCB0aGUgc3RvY2sgY291bnQgYmFzZWQgb24gb3RoZXIgc2VsZWN0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNWYWx1ZSA9IE9iamVjdC52YWx1ZXMoYXR0cmlidXRlcykuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlc1tqXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCB2YXJpYXRpb24gZG9lc24ndCBoYXZlIHRoZSBzZWxlY3RlZCBhdHRyaWJ1dGUgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZSBhdHRyaWJ1dGUgYmVpbmcgY2hlY2tlZCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBhdHRyaWJ1dGUgKGF2b2lkIHNlbGYtcmVmZXJlbmNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlIGF0dHJpYnV0ZSBmb3IgdGhlIGN1cnJlbnQgdmFyaWF0aW9uIGlzIHNldCwgYW5kIG5vIGVtcHR5IGtleXMgYXJlIGZvdW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gc2V0IHRoZSBzdG9jayBxdWFudGl0eSBmb3IgdGhpcyB2YXJpYXRpb24gdG8gMCAobm90IGF2YWlsYWJsZSkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNWYWx1ZSAmJiBzZWxlY3RlZF9hdHRyaWJ1dGVfbmFtZXNbal0gIT09IGF0dHJpYnV0ZV9uYW1lICYmIGF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdICYmICFjaGVja2VtcHR5a2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRfc3RvY2tfcXVhbnRpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZGl0aW9uYWwgbG9naWMgdG8gaGFuZGxlIHZhcmlhdGlvbnMgd2l0aCBlbXB0eSBhdHRyaWJ1dGUga2V5cy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlbXB0eWtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrZW1wdHlrZXkuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNWYWx1ZSAmJiBzZWxlY3RlZF9hdHRyaWJ1dGVfbmFtZXNbal0gIT09IGF0dHJpYnV0ZV9uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrX3F1YW50aXR5ICs9IGdldF9zdG9ja19xdWFudGl0eTsgLy8gQWNjdW11bGF0ZSB0aGUgc3RvY2sgcXVhbnRpdGllcy5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHN3YXRjaCBpdGVtIGVsZW1lbnQgd2l0aCB0aGUgY2FsY3VsYXRlZCBzdG9jayBxdWFudGl0eS5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudnNnLXN3YXRjaC1pdGVtLXN0b2NrLWNvdW50JykudGV4dChzdG9ja19xdWFudGl0eSArICcgbGVmdCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIHRoZSBkaXNwbGF5IG9mIHNlbGVjdGVkIGF0dHJpYnV0ZXMgb24gdGhlIHByb2R1Y3QgcGFnZS5cbiAgICAgICAgICogVGhpcyBtZXRob2QgZW5oYW5jZXMgdGhlIHVzZXIgaW50ZXJmYWNlIGJ5IGluZGljYXRpbmcgd2hpY2ggYXR0cmlidXRlcyAoZS5nLiwgY29sb3IsIHNpemUpIFxuICAgICAgICAgKiBoYXZlIGJlZW4gc2VsZWN0ZWQgYnkgdGhlIHVzZXIgdGhyb3VnaCBzd2F0Y2ggaXRlbXMuIEl0IGR5bmFtaWNhbGx5IHVwZGF0ZXMgdGhlIGF0dHJpYnV0ZSBcbiAgICAgICAgICogbGFiZWxzIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc2VsZWN0aW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIHNlbGVjdGVkQXR0cmlidXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBmZWF0dXJlIHRvIHNob3cgc2VsZWN0ZWQgYXR0cmlidXRlIGxhYmVscyBpcyBlbmFibGVkIGluIHRoZSBzZXR0aW5ncy5cbiAgICAgICAgICAgIC8vIElmIG5vdCwgZXhpdCB0aGUgZnVuY3Rpb24gZWFybHkuXG4gICAgICAgICAgICBpZiAoIV9WU0cub3B0aW9uLnNpbmdsZS5zZWxlY3RlZF92YXJpYXRpb25fYXR0cmlidXRlX2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZWFjaCBzd2F0Y2ggaXRlbSB3aXRoaW4gdGhlIGVsZW1lbnQuXG4gICAgICAgICAgICAvLyBUaGlzIGxvb3AgaGFuZGxlcyB0aGUgZGlzcGxheSBvZiBsYWJlbHMgZm9yIGVhY2ggc2VsZWN0ZWQgYXR0cmlidXRlLlxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IHN3YXRjaCBpdGVtIGlzIHNlbGVjdGVkLlxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSAkKHRoaXMpLmRhdGEoJ3RpdGxlJyk7IC8vIFJldHJpZXZlIHRoZSB0aXRsZSBvZiB0aGUgc2VsZWN0ZWQgc3dhdGNoIGl0ZW0sIHdoaWNoIHJlcHJlc2VudHMgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhIGxhYmVsIGZvciB0aGUgc2VsZWN0ZWQgYXR0cmlidXRlIGFscmVhZHkgZXhpc3RzIGluIHRoZSBET00uXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGl0IGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBhbmQgYXBwZW5kIGEgbmV3ICdzcGFuJyBlbGVtZW50IGZvciBpdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0aC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGgubGFiZWwnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWQtYXR0cmlidXRlXCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSB0ZXh0IG9mIHRoZSBzZWxlY3RlZCBhdHRyaWJ1dGUgbGFiZWwuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBsYWJlbCB0ZXh0IGluY2x1ZGVzIGEgc2VwYXJhdG9yIChkZWZpbmVkIGluIHRoZSBwbHVnaW4ncyBvcHRpb25zKSBhbmQgdGhlIHRpdGxlIG9mIHRoZSBzZWxlY3RlZCBzd2F0Y2ggaXRlbS5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RoLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS50ZXh0KCcgJyArIF9WU0cub3B0aW9uLnNpbmdsZS5sYWJlbF9zZXBhcmF0b3IgKyAnICcgKyB0aXRsZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHNlbGVjdGVkIHN3YXRjaCBpdGVtcyB3aXRoaW4gdGhlIGN1cnJlbnQgc3dhdGNoJ3MgcGFyZW50IGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBsYWJlbCBmb3IgdGhlIHNlbGVjdGVkIGF0dHJpYnV0ZSwgYXMgbm8gYXR0cmlidXRlIGlzIHNlbGVjdGVkIGluIHRoaXMgY2F0ZWdvcnkuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50KCkuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0aC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemVzIHRvb2x0aXBzIGZvciBzd2F0Y2ggaXRlbXMuXG4gICAgICAgICAqL1xuICAgICAgICB0b29sdGlwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnbGkudnNnLXN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlb3ZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudnNnLXN3YXRjaC1pdGVtLXRvb2x0aXAnKS5mYWRlSW4oJ3Nsb3cnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICQodGhpcykubW91c2VsZWF2ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudnNnLXN3YXRjaC1pdGVtLXRvb2x0aXAnKS5mYWRlT3V0KCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBmb3IgZW1wdHkga2V5cyBpbiB0aGUgcHJvZHVjdCBhdHRyaWJ1dGVzLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFByb2R1Y3QgYXR0cmlidXRlcy5cbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBlbXB0eSBrZXlzLlxuICAgICAgICAgKi9cbiAgICAgICAgY2hlY2tlbXB0eWtleTogZnVuY3Rpb24oYXR0cmlidXRlcykge1xuICAgICAgICAgICAgdmFyIGVtcHR5ID0gW11cbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbXB0eS5wdXNoKGtleSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBqUXVlcnkgcGx1Z2luIHdyYXBwZXIgZm9yIFZTRy5cbiAgICAgKiBFbnN1cmVzIHRoYXQgZWFjaCBlbGVtZW50IGlzIG9ubHkgaW5pdGlhbGl6ZWQgb25jZS5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgVlNHLlxuICAgICAqL1xuICAgICQuZm5bJ1ZTRyddID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgJ1ZTRycpKSB7XG4gICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdWU0cnLCBuZXcgVlNHKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlICd3Y192YXJpYXRpb25fZm9ybScgZXZlbnQgb24gdGhlIGRvY3VtZW50LlxuICAgIC8vIFRoaXMgZXZlbnQgaXMgdHJpZ2dlcmVkIHdoZW4gYSBXb29Db21tZXJjZSB2YXJpYXRpb24gZm9ybSBpcyBpbml0aWFsaXplZC5cbiAgICAkKGRvY3VtZW50KS5vbignd2NfdmFyaWF0aW9uX2Zvcm0udnMnLCAnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZzZy1sb2FkZWQpJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgVlNHIChWYXJpYXRpb24gU3dhdGNoIEdlbmVyYXRvcikgZm9yIHRoZSBmb3JtLlxuICAgICAgICAkKHRoaXMpLlZTRygpO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSB0aGUgRmxleFNsaWRlciB3aXRoIG5ldyBpbWFnZXMuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB0YWtlcyBhbiBhcnJheSBvciBvYmplY3Qgb2YgaW1hZ2VzIGFzIGlucHV0LlxuICAgIGZ1bmN0aW9uIHZzZ191cGRhdGVfZmxleHNsaWRlcihpbWFnZXMpIHtcbiAgICAgICAgLy8gRmV0Y2ggdGhlIEZsZXhTbGlkZXIgaW5zdGFuY2UgYXR0YWNoZWQgdG8gdGhlIFdvb0NvbW1lcmNlIHByb2R1Y3QgZ2FsbGVyeS5cbiAgICAgICAgdmFyIHZzZ19mbGV4c2xpZGVyID0gJCgnLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeScpLmRhdGEoJ2ZsZXhzbGlkZXInKTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgRmxleFNsaWRlciBpbnN0YW5jZSBleGlzdHMuXG4gICAgICAgIGlmICh2c2dfZmxleHNsaWRlcikge1xuICAgICAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IHNsaWRlcyBpbiB0aGUgRmxleFNsaWRlci5cbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSB2c2dfZmxleHNsaWRlci5zbGlkZXM7XG5cbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbmQgcmVtb3ZlIGFsbCBleGlzdGluZyBzbGlkZXMgZnJvbSB0aGUgRmxleFNsaWRlci5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2xpZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdnNnX2ZsZXhzbGlkZXIucmVtb3ZlU2xpZGUoc2xpZGVzW2pdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBpbWFnZXMgYW5kIGFkZCBlYWNoIGFzIGEgbmV3IHNsaWRlIHRvIHRoZSBGbGV4U2xpZGVyLlxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGltYWdlcykge1xuICAgICAgICAgICAgICAgIGlmIChpbWFnZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZWxlbWVudCA9IGltYWdlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICB2c2dfZmxleHNsaWRlci5hZGRTbGlkZShuZWxlbWVudCwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ2ZvdW5kX3ZhcmlhdGlvbicgZXZlbnQgb24gdmFyaWF0aW9uIGZvcm1zIG5vdCB5ZXQgbG9hZGVkIHdpdGggVlNHLlxuICAgIC8vIFRoaXMgZXZlbnQgaXMgdHJpZ2dlcmVkIHdoZW4gYSBwcm9kdWN0IHZhcmlhdGlvbiBpcyBzZWxlY3RlZC5cbiAgICAkKCcudmFyaWF0aW9uc19mb3JtOm5vdCgudnNnLWxvYWRlZCknKS5vbignZm91bmRfdmFyaWF0aW9uLnZzZycsIGZ1bmN0aW9uKGUsIHZhcmlhdGlvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kX3ZhcmlhdGlvblwiKTtcblxuICAgICAgICAvLyBGZXRjaCB0aGUgZ2FsbGVyeSBpbWFnZXMgc3BlY2lmaWMgdG8gdGhlIHNlbGVjdGVkIHZhcmlhdGlvbi5cbiAgICAgICAgdmFyIHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcyA9IHZhcmlhdGlvbi52YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXM7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBGbGV4U2xpZGVyIHdpdGggdGhlIHZhcmlhdGlvbi1zcGVjaWZpYyBpbWFnZXMuXG4gICAgICAgIHZzZ191cGRhdGVfZmxleHNsaWRlcih2YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXMpO1xuICAgIH0pO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ3Jlc2V0X2RhdGEnIGV2ZW50IG9uIHZhcmlhdGlvbiBmb3JtcyBub3QgeWV0IGxvYWRlZCB3aXRoIFZTRy5cbiAgICAvLyBUaGlzIGV2ZW50IGlzIHR5cGljYWxseSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFyaWF0aW9uIGZvcm0gaXMgcmVzZXQgdG8gaXRzIGRlZmF1bHQgc3RhdGUuXG4gICAgJCgnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZzZy1sb2FkZWQpJykub24oJ3Jlc2V0X2RhdGEudnNnJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBGZXRjaCB0aGUgZGVmYXVsdCBnYWxsZXJ5IGltYWdlcyBzdG9yZWQgaW4gdGhlIF9WU0cgb2JqZWN0LlxuICAgICAgICB2YXIgZ2FsbGVyeV9pbWFnZXMgPSBfVlNHLmdhbGxlcnlfaW1hZ2VzO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgRmxleFNsaWRlciB3aXRoIHRoZSBkZWZhdWx0IGdhbGxlcnkgaW1hZ2VzLlxuICAgICAgICB2c2dfdXBkYXRlX2ZsZXhzbGlkZXIoZ2FsbGVyeV9pbWFnZXMpO1xuICAgIH0pO1xuXG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6WyIkIiwid2luZG93IiwiZG9jdW1lbnQiLCJ1bmRlZmluZWQiLCJWU0ciLCJlbGVtZW50Iiwib3B0aW9ucyIsInNldHRpbmdzIiwiZXh0ZW5kIiwiJGVsZW1lbnQiLCJhZGRDbGFzcyIsInByb2R1Y3RfdmFyaWF0aW9ucyIsImRhdGEiLCJpc19hamF4X3ZhcmlhdGlvbiIsImxlbmd0aCIsImF0dHJpYnV0ZUZpZWxkcyIsImZpbmQiLCJpbml0IiwidXBkYXRlIiwidG9vbHRpcCIsInByb3RvdHlwZSIsImVhY2giLCJpIiwiZWwiLCJzZWxlY3QiLCJzaWJsaW5ncyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwidmFsdWUiLCJfVlNHIiwib3B0aW9uIiwic2luZ2xlIiwiY2xlYXJfb25fcmVzZWxlY3QiLCJ2YWwiLCJ0cmlnZ2VyIiwicGx1Z2luIiwiZXZlbnQiLCJzd2F0Y2hTZXR1cCIsInN0b2NrQ291bnQiLCJzZWxlY3RlZEF0dHJpYnV0ZSIsIm9wdGlvbnNfc2VsZWN0ZWQiLCJzZWxlY3RzIiwiZGlzYWJsZWRfc2VsZWN0cyIsInB1c2giLCJvcHRpb25zX2Rpc2FibGVkIiwiaW5fc3RvY2tzIiwiXyIsImRpZmZlcmVuY2UiLCJpbmRleCIsImF0dHJpYnV0ZV92YWx1ZSIsImF0dHIiLCJyZW1vdmVDbGFzcyIsImluY2x1ZGVzIiwic2VsZWN0ZWRfYXR0cmlidXRlIiwic2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlcyIsInNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lcyIsInBhcmVudCIsImF0dHJpYnV0ZV9uYW1lIiwic3RvY2tfcXVhbnRpdHkiLCJhdHRyaWJ1dGVzIiwiZ2V0X3N0b2NrX3F1YW50aXR5IiwiY2hlY2tlbXB0eWtleSIsImoiLCJoYXNWYWx1ZSIsIk9iamVjdCIsInZhbHVlcyIsInRleHQiLCJzZWxlY3RlZF92YXJpYXRpb25fYXR0cmlidXRlX2xhYmVsIiwiaGFzQ2xhc3MiLCJ0aXRsZSIsInBhcmVudHMiLCJhcHBlbmQiLCJsYWJlbF9zZXBhcmF0b3IiLCJyZW1vdmUiLCJtb3VzZW92ZXIiLCJmYWRlSW4iLCJtb3VzZWxlYXZlIiwiZmFkZU91dCIsImVtcHR5IiwiX2kiLCJfT2JqZWN0JGVudHJpZXMiLCJlbnRyaWVzIiwiX09iamVjdCRlbnRyaWVzJF9pIiwiX3NsaWNlZFRvQXJyYXkiLCJrZXkiLCJmbiIsImpRdWVyeSIsInZzZ191cGRhdGVfZmxleHNsaWRlciIsImltYWdlcyIsInZzZ19mbGV4c2xpZGVyIiwic2xpZGVzIiwicmVtb3ZlU2xpZGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm5lbGVtZW50IiwiYWRkU2xpZGUiLCJ2YXJpYXRpb24iLCJjb25zb2xlIiwibG9nIiwidmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VzIiwiZ2FsbGVyeV9pbWFnZXMiXSwic291cmNlUm9vdCI6IiJ9