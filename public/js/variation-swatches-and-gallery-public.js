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
    console.log(this.product_variations);
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
        $(this).on('click.vsg', 'li.vsg-swatch-item', function (e) {
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
     * This method is designed to be a response handler for the 'woocommerce_variation_has_changed.vsg' event.
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
      // This listener responds to a custom event ('woocommerce_variation_has_changed.vsg'),
      // which is triggered when there's a change in the product variation.
      this.$element.on('woocommerce_variation_has_changed.vsg', function (event) {
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
  $(document).on('wc_variation_form.vsg', '.variations_form:not(.vsg-loaded)', function (event) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljL2pzL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsQ0FBQyxVQUFTQSxDQUFDLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQUU7RUFDdEMsWUFBWTs7RUFFWjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNJLFNBQVNDLEdBQUdBLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQzNCLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0UsUUFBUSxHQUFHUCxDQUFDLENBQUNRLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRUYsT0FBTyxDQUFDO0lBQ3pDLElBQUksQ0FBQ0csUUFBUSxHQUFHVCxDQUFDLENBQUNLLE9BQU8sQ0FBQztJQUMxQixJQUFJLENBQUNJLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUNwQyxJQUFJLENBQUNDLGtCQUFrQixHQUFHLElBQUksQ0FBQ0YsUUFBUSxDQUFDRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO0lBQ3hFLElBQUksQ0FBQ0MsaUJBQWlCLEdBQUcsSUFBSSxDQUFDRixrQkFBa0IsQ0FBQ0csTUFBTSxHQUFHLENBQUM7SUFDM0QsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDTixRQUFRLENBQUNPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUMvRCxJQUFJLENBQUNDLElBQUksRUFBRTtJQUNYLElBQUksQ0FBQ0MsTUFBTSxFQUFFO0lBQ2IsSUFBSSxDQUFDQyxPQUFPLEVBQUU7SUFDZEMsT0FBTyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDVixrQkFBa0IsQ0FBQztF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SSxNQUFNLEVBQUU7UUFDcEIsSUFBSUEsTUFBTSxDQUFDSSxjQUFjLENBQUNSLEdBQUcsQ0FBQyxFQUFFO1VBQzVCLElBQU1TLFFBQVEsR0FBR0wsTUFBTSxDQUFDSixHQUFHLENBQUM7VUFDNUJLLGNBQWMsQ0FBQ0ssUUFBUSxDQUFDRCxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDO01BQ0o7SUFDSjtFQUNKOztFQUVBO0VBQ0E7RUFDQWpHLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDNEIsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFVBQVNDLENBQUMsRUFBRXNFLFNBQVMsRUFBRTtJQUNwRi9FLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDOztJQUU5QjtJQUNBLElBQUkrRSx3QkFBd0IsR0FBR0QsU0FBUyxDQUFDQyx3QkFBd0I7O0lBRWpFO0lBQ0FULHFCQUFxQixDQUFDUyx3QkFBd0IsQ0FBQztFQUNuRCxDQUFDLENBQUM7O0VBRUY7RUFDQTtFQUNBcEcsQ0FBQyxDQUFDLG1DQUFtQyxDQUFDLENBQUM0QixFQUFFLENBQUMsZ0JBQWdCLEVBQUUsVUFBU0MsQ0FBQyxFQUFFO0lBQ3BFO0lBQ0EsSUFBSXdFLGNBQWMsR0FBR3BFLElBQUksQ0FBQ29FLGNBQWM7O0lBRXhDO0lBQ0FWLHFCQUFxQixDQUFDVSxjQUFjLENBQUM7RUFDekMsQ0FBQyxDQUFDO0FBRU4sQ0FBQyxFQUFFWCxNQUFNLEVBQUV6RixNQUFNLEVBQUVDLFFBQVEsQ0FBQyxDOzs7Ozs7Ozs7O0FDbFg1QiIsInNvdXJjZXMiOlsid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvLi9wdWJsaWMvc3JjL2luZGV4LmpzIiwid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS8uL3B1YmxpYy9zcmMvc3R5bGVzL2luZGV4LnNjc3M/NDMyNCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIFZTRyAoVmFyaWF0aW9uIFN3YXRjaCBHZW5lcmF0b3IpIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgICAqIEluaXRpYWxpemVzIHRoZSB2YXJpYXRpb24gc3dhdGNoZXMgZm9yIFdvb0NvbW1lcmNlIHByb2R1Y3RzLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnQgdGhhdCB3aWxsIGJlIGVuaGFuY2VkIGJ5IFZTRy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgVlNHLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZTRyhlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwge30sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygndnNnLWxvYWRlZCcpO1xuICAgICAgICB0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgncHJvZHVjdF92YXJpYXRpb25zJykgfHwgW107XG4gICAgICAgIHRoaXMuaXNfYWpheF92YXJpYXRpb24gPSB0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucy5sZW5ndGggPiAwO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUZpZWxkcyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnZhcmlhdGlvbnMgc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnRvb2x0aXAoKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnMpXG4gICAgfVxuXG4gICAgLy8gRXh0ZW5kIHRoZSBWU0cgcHJvdG90eXBlIHdpdGggbWV0aG9kcy5cbiAgICAkLmV4dGVuZChWU0cucHJvdG90eXBlLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplcyB0aGUgc3dhdGNoIGl0ZW1zIGFuZCBhdHRhY2hlcyBldmVudCBoYW5kbGVycyBmb3IgdXNlciBpbnRlcmFjdGlvbnMuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHJlc3BvbnNpYmxlIGZvciBzZXR0aW5nIHVwIHRoZSB1c2VyIGludGVyZmFjZSBmb3Igc3dhdGNoIHNlbGVjdGlvbi5cbiAgICAgICAgICogSXQgaW52b2x2ZXMgaXRlcmF0aW5nIG92ZXIgZWFjaCBzd2F0Y2ggaXRlbSBhbmQgYXR0YWNoaW5nIGNsaWNrIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgICAqIHRvIGVuYWJsZSB1c2VycyB0byBzZWxlY3QgcHJvZHVjdCB2YXJpYXRpb25zIChlLmcuLCBjb2xvciwgc2l6ZSkgdGhyb3VnaCBzd2F0Y2hlcy5cbiAgICAgICAgICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggJ3VsLnZzZy1zd2F0Y2gtaXRlbXMtd3JhcHBlcicgZWxlbWVudCB3aXRoaW4gdGhlIG1haW4gcGx1Z2luIGVsZW1lbnQuXG4gICAgICAgICAgICAvLyBUaGVzZSBlbGVtZW50cyBjb250YWluIHRoZSBpbmRpdmlkdWFsIHN3YXRjaCBpdGVtcyBmb3Igc2VsZWN0aW9uLlxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgLy8gRmluZCBhbmQgc3RvcmUgdGhlIHNpYmxpbmcgc2VsZWN0IGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBzZWxlY3QgZWxlbWVudCBpcyB0aGUgb3JpZ2luYWwgZHJvcGRvd24gdGhhdCBpcyBiZWluZyByZXBsYWNlZCBieSBzd2F0Y2ggaXRlbXMuXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52c2ctcmF3LXNlbGVjdCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoIGEgY2xpY2sgZXZlbnQgbGlzdGVuZXIgdG8gZWFjaCAnbGkudnNnLXN3YXRjaC1pdGVtJyB3aXRoaW4gdGhlIHN3YXRjaCB3cmFwcGVyLlxuICAgICAgICAgICAgICAgIC8vIFRoZXNlIGFyZSB0aGUgaW5kaXZpZHVhbCBzd2F0Y2ggb3B0aW9ucyB0aGF0IHVzZXJzIGNhbiBjbGljay5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljay52c2cnLCAnbGkudnNnLXN3YXRjaC1pdGVtJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiAoZS5nLiwgbmF2aWdhdGluZyB0byBhIGxpbmspIGFuZCBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGVuc3VyZSB0aGF0IHRoZSBjbGljayBldmVudCBkb2VzIG5vdCBhZmZlY3Qgb3RoZXIgZWxlbWVudHMuXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZXRyaWV2ZSB0aGUgZGF0YSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIGNsaWNrZWQgc3dhdGNoIGl0ZW0uXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgdmFsdWUgY29ycmVzcG9uZHMgdG8gdGhlIHByb2R1Y3QgdmFyaWF0aW9uIHRoYXQgdGhlIHN3YXRjaCByZXByZXNlbnRzLlxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIG9wdGlvbiB0byBjbGVhciB0aGUgc2VsZWN0aW9uIHVwb24gcmVzZWxlY3Rpb24gaXMgZW5hYmxlZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWxzbywgY2hlY2sgaWYgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNlbGVjdCBib3ggbWF0Y2hlcyB0aGUgc3dhdGNoIGl0ZW0ncyB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF9WU0cub3B0aW9uLnNpbmdsZS5jbGVhcl9vbl9yZXNlbGVjdCAmJiBzZWxlY3QudmFsKCkgJiYgc2VsZWN0LnZhbCgpID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNlbGVjdCBib3gsIGVzc2VudGlhbGx5IGRlc2VsZWN0aW5nIHRoZSBzd2F0Y2guXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgc2VsZWN0IGJveCB0byB0aGUgdmFsdWUgb2YgdGhlIGNsaWNrZWQgc3dhdGNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlcmVieSBzZWxlY3RpbmcgdGhlIHN3YXRjaCBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgcHJvZHVjdCB2YXJpYXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgJ2NoYW5nZScsICdjbGljaycsIGFuZCAnZm9jdXNpbicgZXZlbnRzIG9uIHRoZSBzZWxlY3QgYm94LlxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdCBhbnkgb3RoZXIgZXZlbnQgaGFuZGxlcnMgYXR0YWNoZWQgdG8gdGhlIHNlbGVjdCBib3hcbiAgICAgICAgICAgICAgICAgICAgLy8gYXJlIG5vdGlmaWVkIG9mIHRoZSBjaGFuZ2UgaW4gaXRzIHZhbHVlLCBhbGxvd2luZyBmb3IgVUkgdXBkYXRlcyBvciBvdGhlciBhY3Rpb25zLlxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIHRoZSBzd2F0Y2ggVUkgaW4gcmVzcG9uc2UgdG8gY2hhbmdlcyBpbiBwcm9kdWN0IHZhcmlhdGlvbnMuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIGRlc2lnbmVkIHRvIGJlIGEgcmVzcG9uc2UgaGFuZGxlciBmb3IgdGhlICd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudnNnJyBldmVudC5cbiAgICAgICAgICogSXQgZW5zdXJlcyB0aGF0IHRoZSBzd2F0Y2ggVUkgZWxlbWVudHMgcmVmbGVjdCB0aGUgY3VycmVudCBzdGF0ZSBvZiBwcm9kdWN0IHZhcmlhdGlvbnMuXG4gICAgICAgICAqIFxuICAgICAgICAgKiBXaGVuIGEgcHJvZHVjdCB2YXJpYXRpb24gY2hhbmdlcyAoZS5nLiwgYSBkaWZmZXJlbnQgc2l6ZSBvciBjb2xvciBpcyBzZWxlY3RlZCBieSB0aGUgdXNlciksXG4gICAgICAgICAqIHRoaXMgbWV0aG9kIHRyaWdnZXJzIHNldmVyYWwga2V5IHVwZGF0ZXM6XG4gICAgICAgICAqIDEuIEl0IHJlY29uZmlndXJlcyB0aGUgc3dhdGNoZXMgZGlzcGxheSB0byBtYXRjaCBhdmFpbGFibGUgdmFyaWF0aW9ucyAoYHN3YXRjaFNldHVwYCkuXG4gICAgICAgICAqIDIuIEl0IHVwZGF0ZXMgdGhlIHN0b2NrIGNvdW50IGRpc3BsYXkgZm9yIGVhY2ggc3dhdGNoIChgc3RvY2tDb3VudGApLlxuICAgICAgICAgKiAzLiBJdCB1cGRhdGVzIHRoZSBkaXNwbGF5IG9mIHNlbGVjdGVkIGF0dHJpYnV0ZXMgKGBzZWxlY3RlZEF0dHJpYnV0ZWApLlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBwbHVnaW4gaW5zdGFuY2UuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB0byBtYWludGFpbiB0aGUgY29ycmVjdCBjb250ZXh0ICgndGhpcycpIGluc2lkZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gdGhpcztcblxuICAgICAgICAgICAgLy8gQXR0YWNoIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBtYWluIGVsZW1lbnQuXG4gICAgICAgICAgICAvLyBUaGlzIGxpc3RlbmVyIHJlc3BvbmRzIHRvIGEgY3VzdG9tIGV2ZW50ICgnd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZzZycpLFxuICAgICAgICAgICAgLy8gd2hpY2ggaXMgdHJpZ2dlcmVkIHdoZW4gdGhlcmUncyBhIGNoYW5nZSBpbiB0aGUgcHJvZHVjdCB2YXJpYXRpb24uXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudnNnJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBgc3dhdGNoU2V0dXBgIG1ldGhvZCB0byB1cGRhdGUgdGhlIHN3YXRjaGVzIGRpc3BsYXkuXG4gICAgICAgICAgICAgICAgcGx1Z2luLnN3YXRjaFNldHVwKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBgc3RvY2tDb3VudGAgbWV0aG9kIHRvIHVwZGF0ZSB0aGUgc3RvY2sgY291bnQgZGlzcGxheSBmb3IgZWFjaCBzd2F0Y2guXG4gICAgICAgICAgICAgICAgcGx1Z2luLnN0b2NrQ291bnQoKTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGBzZWxlY3RlZEF0dHJpYnV0ZWAgbWV0aG9kIHRvIHVwZGF0ZSB0aGUgZGlzcGxheSBvZiBzZWxlY3RlZCBhdHRyaWJ1dGVzLlxuICAgICAgICAgICAgICAgIHBsdWdpbi5zZWxlY3RlZEF0dHJpYnV0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdXAgc3dhdGNoZXMgYmFzZWQgb24gdGhlIGF2YWlsYWJsZSBwcm9kdWN0IHZhcmlhdGlvbnMuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHJlc3BvbnNpYmxlIGZvciBjb25maWd1cmluZyB0aGUgc3dhdGNoIGl0ZW1zIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcHJvZHVjdCB2YXJpYXRpb25zLlxuICAgICAgICAgKiBJdCB1cGRhdGVzIHRoZSBVSSB0byByZWZsZWN0IHdoaWNoIHZhcmlhdGlvbnMgYXJlIGF2YWlsYWJsZSBhbmQgd2hpY2ggYXJlIGN1cnJlbnRseSBzZWxlY3RlZC5cbiAgICAgICAgICovXG4gICAgICAgIHN3YXRjaFNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoICd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInIGVsZW1lbnQuIFRoZXNlIGVsZW1lbnRzIGNvbnRhaW4gdGhlIHN3YXRjaCBpdGVtcy5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgndWwudnNnLXN3YXRjaC1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIHNpYmxpbmcgc2VsZWN0IGVsZW1lbnQgdGhhdCByZXByZXNlbnRzIHRoZSByYXcgcHJvZHVjdCB2YXJpYXRpb25zLlxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3QudnNnLXJhdy1zZWxlY3QnKTtcblxuICAgICAgICAgICAgICAgIC8vIERldGVybWluZSB0aGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbiwgaWYgYW55LlxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zX3NlbGVjdGVkID0gc2VsZWN0LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJbml0aWFsaXplIGFycmF5cyB0byBzdG9yZSB0aGUgdmFsdWVzIG9mIHNlbGVjdGFibGUgYW5kIGRpc2FibGVkIG9wdGlvbnMuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzYWJsZWRfc2VsZWN0cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgLy8gUG9wdWxhdGUgdGhlICdzZWxlY3RzJyBhcnJheSB3aXRoIHRoZSB2YWx1ZXMgb2YgYWxsIG5vbi1lbXB0eSBvcHRpb25zLlxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZWN0LmZpbmQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RzLnB1c2goJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFBvcHVsYXRlIHRoZSAnZGlzYWJsZWRfc2VsZWN0cycgYXJyYXkgd2l0aCB2YWx1ZXMgb2YgZGlzYWJsZWQgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc19kaXNhYmxlZCA9IHNlbGVjdC5maW5kKCdvcHRpb246ZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zX2Rpc2FibGVkLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWRfc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBzZWxlY3RhYmxlIGFuZCBkaXNhYmxlZCBvcHRpb25zIHRvIGdldCB0aGUgYXZhaWxhYmxlIChpbi1zdG9jaykgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICB2YXIgaW5fc3RvY2tzID0gXy5kaWZmZXJlbmNlKHNlbGVjdHMsIGRpc2FibGVkX3NlbGVjdHMpO1xuXG4gICAgICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggc3dhdGNoIGl0ZW0gdG8gdXBkYXRlIGl0cyBzdGF0ZSBiYXNlZCBvbiBhdmFpbGFiaWxpdHkgYW5kIHNlbGVjdGlvbiBzdGF0dXMuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzd2F0Y2ggaXRlbS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV92YWx1ZSA9ICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBzdGF0ZSBvZiB0aGUgc3dhdGNoIGl0ZW0sIG1hcmtpbmcgaXQgYXMgZGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkJykuYWRkQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzd2F0Y2ggaXRlbSdzIHZhbHVlIGlzIGluIHRoZSBsaXN0IG9mIGF2YWlsYWJsZSBvcHRpb25zLCB1cGRhdGUgaXRzIHN0YXRlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlcyhpbl9zdG9ja3MsIGF0dHJpYnV0ZV92YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCB2c2ctc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHN3YXRjaCBpdGVtJ3MgdmFsdWUgbWF0Y2hlcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbiwgbWFyayBpdCBhcyBzZWxlY3RlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVfdmFsdWUgPT09IG9wdGlvbnNfc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgdGhlIHN0b2NrIGNvdW50IGRpc3BsYXkgZm9yIGVhY2ggc3dhdGNoIGl0ZW0uXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGNhbGN1bGF0ZXMgYW5kIGRpc3BsYXlzIHRoZSBhdmFpbGFibGUgc3RvY2sgZm9yIGVhY2ggcHJvZHVjdCB2YXJpYXRpb25cbiAgICAgICAgICogcmVwcmVzZW50ZWQgYnkgc3dhdGNoIGl0ZW1zLiBJdCBjb25zaWRlcnMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBhdHRyaWJ1dGVzIGFuZCBcbiAgICAgICAgICogYWRqdXN0cyB0aGUgc3RvY2sgY291bnRzIGJhc2VkIG9uIHByb2R1Y3QgdmFyaWF0aW9ucyBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RvY2tDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBTdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgcGx1Z2luIGluc3RhbmNlIHRvIGFjY2VzcyBpdHMgcHJvcGVydGllcyBhbmQgbWV0aG9kcyB3aXRoaW4gY2FsbGJhY2sgZnVuY3Rpb25zLlxuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIENvbGxlY3QgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBzd2F0Y2ggaXRlbXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlIHZhbHVlcyBhbmQgbmFtZXMuXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRfYXR0cmlidXRlID0gdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzID0gW107IC8vIEFycmF5IHRvIHN0b3JlIHZhbHVlcyBvZiBzZWxlY3RlZCBhdHRyaWJ1dGVzLlxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lcyA9IFtdOyAvLyBBcnJheSB0byBzdG9yZSBuYW1lcyBvZiBhdHRyaWJ1dGVzIGNvcnJlc3BvbmRpbmcgdG8gc2VsZWN0ZWQgdmFsdWVzLlxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RlZF9hdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzLnB1c2goJChzZWxlY3RlZF9hdHRyaWJ1dGVbaV0pLmRhdGEoJ3ZhbHVlJykpOyAvLyBQdXNoIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgYXR0cmlidXRlLlxuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lcy5wdXNoKCQoc2VsZWN0ZWRfYXR0cmlidXRlW2ldKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpKTsgLy8gUHVzaCB0aGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlLlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZWFjaCBzd2F0Y2ggaXRlbSB0byB1cGRhdGUgaXRzIHN0b2NrIGNvdW50IGJhc2VkIG9uIGF2YWlsYWJsZSB2YXJpYXRpb25zLlxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuZGF0YSgndmFsdWUnKTsgLy8gUmV0cmlldmUgdGhlIHZhbHVlIGF0dHJpYnV0ZSBvZiB0aGUgc3dhdGNoIGl0ZW0uXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV9uYW1lID0gJCh0aGlzKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpOyAvLyBSZXRyaWV2ZSB0aGUgYXR0cmlidXRlIG5hbWUgb2YgdGhlIHN3YXRjaCBpdGVtLlxuICAgICAgICAgICAgICAgIHZhciBzdG9ja19xdWFudGl0eSA9IDA7IC8vIEluaXRpYWxpemUgdGhlIHN0b2NrIHF1YW50aXR5IGZvciB0aGUgc3dhdGNoIGl0ZW0uXG5cbiAgICAgICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIHByb2R1Y3QgdmFyaWF0aW9ucyB0byBjYWxjdWxhdGUgc3RvY2sgY291bnRzLlxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2luLnByb2R1Y3RfdmFyaWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHBsdWdpbi5wcm9kdWN0X3ZhcmlhdGlvbnNbaV0uYXR0cmlidXRlczsgLy8gR2V0IHRoZSBhdHRyaWJ1dGVzIGZvciB0aGUgY3VycmVudCB2YXJpYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZXRfc3RvY2tfcXVhbnRpdHkgPSBwbHVnaW4ucHJvZHVjdF92YXJpYXRpb25zW2ldLnN0b2NrX3F1YW50aXR5OyAvLyBHZXQgdGhlIHN0b2NrIHF1YW50aXR5IGZvciB0aGUgY3VycmVudCB2YXJpYXRpb24uXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGF0dHJpYnV0ZXMgdGhhdCBhcmUgbm90IHNldCAoZW1wdHkpIGluIHRoZSB2YXJpYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VtcHR5a2V5ID0gcGx1Z2luLmNoZWNrZW1wdHlrZXkoYXR0cmlidXRlcyk7IC8vIENhbGwgdGhlICdjaGVja2VtcHR5a2V5JyBtZXRob2QgdG8gaWRlbnRpZnkgZW1wdHkgYXR0cmlidXRlcy5cblxuICAgICAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIGN1cnJlbnQgc3dhdGNoIGl0ZW0ncyB2YWx1ZSBtYXRjaGVzIHRoZSB2YXJpYXRpb24ncyBhdHRyaWJ1dGUgdmFsdWUgb3IgaWYgdGhlIGF0dHJpYnV0ZSBpcyBub3Qgc2V0LlxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gPT0gdmFsdWUgfHwgIWF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgc2VsZWN0ZWQgYXR0cmlidXRlcyB0byBhZGp1c3QgdGhlIHN0b2NrIGNvdW50IGJhc2VkIG9uIG90aGVyIHNlbGVjdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXNbal0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgdmFyaWF0aW9uIGRvZXNuJ3QgaGF2ZSB0aGUgc2VsZWN0ZWQgYXR0cmlidXRlIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCB0aGUgYXR0cmlidXRlIGJlaW5nIGNoZWNrZWQgaXMgZGlmZmVyZW50IGZyb20gdGhlIGN1cnJlbnQgYXR0cmlidXRlIChhdm9pZCBzZWxmLXJlZmVyZW5jZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZSBhdHRyaWJ1dGUgZm9yIHRoZSBjdXJyZW50IHZhcmlhdGlvbiBpcyBzZXQsIGFuZCBubyBlbXB0eSBrZXlzIGFyZSBmb3VuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIHNldCB0aGUgc3RvY2sgcXVhbnRpdHkgZm9yIHRoaXMgdmFyaWF0aW9uIHRvIDAgKG5vdCBhdmFpbGFibGUpLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzVmFsdWUgJiYgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzW2pdICE9PSBhdHRyaWJ1dGVfbmFtZSAmJiBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSAmJiAhY2hlY2tlbXB0eWtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGRpdGlvbmFsIGxvZ2ljIHRvIGhhbmRsZSB2YXJpYXRpb25zIHdpdGggZW1wdHkgYXR0cmlidXRlIGtleXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZW1wdHlrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja2VtcHR5a2V5LmluY2x1ZGVzKHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lc1tqXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1ZhbHVlID0gT2JqZWN0LnZhbHVlcyhhdHRyaWJ1dGVzKS5pbmNsdWRlcyhzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzVmFsdWUgJiYgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzW2pdICE9PSBhdHRyaWJ1dGVfbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldF9zdG9ja19xdWFudGl0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9ja19xdWFudGl0eSArPSBnZXRfc3RvY2tfcXVhbnRpdHk7IC8vIEFjY3VtdWxhdGUgdGhlIHN0b2NrIHF1YW50aXRpZXMuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBzd2F0Y2ggaXRlbSBlbGVtZW50IHdpdGggdGhlIGNhbGN1bGF0ZWQgc3RvY2sgcXVhbnRpdHkuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS1zdG9jay1jb3VudCcpLnRleHQoc3RvY2tfcXVhbnRpdHkgKyAnIGxlZnQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyB0aGUgZGlzcGxheSBvZiBzZWxlY3RlZCBhdHRyaWJ1dGVzIG9uIHRoZSBwcm9kdWN0IHBhZ2UuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGVuaGFuY2VzIHRoZSB1c2VyIGludGVyZmFjZSBieSBpbmRpY2F0aW5nIHdoaWNoIGF0dHJpYnV0ZXMgKGUuZy4sIGNvbG9yLCBzaXplKSBcbiAgICAgICAgICogaGF2ZSBiZWVuIHNlbGVjdGVkIGJ5IHRoZSB1c2VyIHRocm91Z2ggc3dhdGNoIGl0ZW1zLiBJdCBkeW5hbWljYWxseSB1cGRhdGVzIHRoZSBhdHRyaWJ1dGUgXG4gICAgICAgICAqIGxhYmVscyB0byByZWZsZWN0IHRoZSBjdXJyZW50IHNlbGVjdGlvbnMuXG4gICAgICAgICAqL1xuICAgICAgICBzZWxlY3RlZEF0dHJpYnV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgZmVhdHVyZSB0byBzaG93IHNlbGVjdGVkIGF0dHJpYnV0ZSBsYWJlbHMgaXMgZW5hYmxlZCBpbiB0aGUgc2V0dGluZ3MuXG4gICAgICAgICAgICAvLyBJZiBub3QsIGV4aXQgdGhlIGZ1bmN0aW9uIGVhcmx5LlxuICAgICAgICAgICAgaWYgKCFfVlNHLm9wdGlvbi5zaW5nbGUuc2VsZWN0ZWRfdmFyaWF0aW9uX2F0dHJpYnV0ZV9sYWJlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggc3dhdGNoIGl0ZW0gd2l0aGluIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgLy8gVGhpcyBsb29wIGhhbmRsZXMgdGhlIGRpc3BsYXkgb2YgbGFiZWxzIGZvciBlYWNoIHNlbGVjdGVkIGF0dHJpYnV0ZS5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnbGkudnNnLXN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgY3VycmVudCBzd2F0Y2ggaXRlbSBpcyBzZWxlY3RlZC5cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygndnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gJCh0aGlzKS5kYXRhKCd0aXRsZScpOyAvLyBSZXRyaWV2ZSB0aGUgdGl0bGUgb2YgdGhlIHNlbGVjdGVkIHN3YXRjaCBpdGVtLCB3aGljaCByZXByZXNlbnRzIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYSBsYWJlbCBmb3IgdGhlIHNlbGVjdGVkIGF0dHJpYnV0ZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgRE9NLlxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpdCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgYW5kIGFwcGVuZCBhIG5ldyAnc3BhbicgZWxlbWVudCBmb3IgaXQuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGgubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RoLmxhYmVsJykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInNlbGVjdGVkLWF0dHJpYnV0ZVwiPjwvc3Bhbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgdGV4dCBvZiB0aGUgc2VsZWN0ZWQgYXR0cmlidXRlIGxhYmVsLlxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbGFiZWwgdGV4dCBpbmNsdWRlcyBhIHNlcGFyYXRvciAoZGVmaW5lZCBpbiB0aGUgcGx1Z2luJ3Mgb3B0aW9ucykgYW5kIHRoZSB0aXRsZSBvZiB0aGUgc2VsZWN0ZWQgc3dhdGNoIGl0ZW0uXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0aC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykudGV4dCgnICcgKyBfVlNHLm9wdGlvbi5zaW5nbGUubGFiZWxfc2VwYXJhdG9yICsgJyAnICsgdGl0bGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBzZWxlY3RlZCBzd2F0Y2ggaXRlbXMgd2l0aGluIHRoZSBjdXJyZW50IHN3YXRjaCdzIHBhcmVudCBlbGVtZW50LFxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgbGFiZWwgZm9yIHRoZSBzZWxlY3RlZCBhdHRyaWJ1dGUsIGFzIG5vIGF0dHJpYnV0ZSBpcyBzZWxlY3RlZCBpbiB0aGlzIGNhdGVnb3J5LlxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy52c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGgubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplcyB0b29sdGlwcyBmb3Igc3dhdGNoIGl0ZW1zLlxuICAgICAgICAgKi9cbiAgICAgICAgdG9vbHRpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5tb3VzZW92ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS10b29sdGlwJykuZmFkZUluKCdzbG93Jyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlbGVhdmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS10b29sdGlwJykuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgZm9yIGVtcHR5IGtleXMgaW4gdGhlIHByb2R1Y3QgYXR0cmlidXRlcy5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBQcm9kdWN0IGF0dHJpYnV0ZXMuXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgZW1wdHkga2V5cy5cbiAgICAgICAgICovXG4gICAgICAgIGNoZWNrZW1wdHlrZXk6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHZhciBlbXB0eSA9IFtdXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZW1wdHkucHVzaChrZXkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogalF1ZXJ5IHBsdWdpbiB3cmFwcGVyIGZvciBWU0cuXG4gICAgICogRW5zdXJlcyB0aGF0IGVhY2ggZWxlbWVudCBpcyBvbmx5IGluaXRpYWxpemVkIG9uY2UuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIFZTRy5cbiAgICAgKi9cbiAgICAkLmZuWydWU0cnXSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsICdWU0cnKSkge1xuICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAnVlNHJywgbmV3IFZTRyh0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnd2NfdmFyaWF0aW9uX2Zvcm0nIGV2ZW50IG9uIHRoZSBkb2N1bWVudC5cbiAgICAvLyBUaGlzIGV2ZW50IGlzIHRyaWdnZXJlZCB3aGVuIGEgV29vQ29tbWVyY2UgdmFyaWF0aW9uIGZvcm0gaXMgaW5pdGlhbGl6ZWQuXG4gICAgJChkb2N1bWVudCkub24oJ3djX3ZhcmlhdGlvbl9mb3JtLnZzZycsICcudmFyaWF0aW9uc19mb3JtOm5vdCgudnNnLWxvYWRlZCknLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBWU0cgKFZhcmlhdGlvbiBTd2F0Y2ggR2VuZXJhdG9yKSBmb3IgdGhlIGZvcm0uXG4gICAgICAgICQodGhpcykuVlNHKCk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gRnVuY3Rpb24gdG8gdXBkYXRlIHRoZSBGbGV4U2xpZGVyIHdpdGggbmV3IGltYWdlcy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHRha2VzIGFuIGFycmF5IG9yIG9iamVjdCBvZiBpbWFnZXMgYXMgaW5wdXQuXG4gICAgZnVuY3Rpb24gdnNnX3VwZGF0ZV9mbGV4c2xpZGVyKGltYWdlcykge1xuICAgICAgICAvLyBGZXRjaCB0aGUgRmxleFNsaWRlciBpbnN0YW5jZSBhdHRhY2hlZCB0byB0aGUgV29vQ29tbWVyY2UgcHJvZHVjdCBnYWxsZXJ5LlxuICAgICAgICB2YXIgdnNnX2ZsZXhzbGlkZXIgPSAkKCcud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5JykuZGF0YSgnZmxleHNsaWRlcicpO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBGbGV4U2xpZGVyIGluc3RhbmNlIGV4aXN0cy5cbiAgICAgICAgaWYgKHZzZ19mbGV4c2xpZGVyKSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgc2xpZGVzIGluIHRoZSBGbGV4U2xpZGVyLlxuICAgICAgICAgICAgdmFyIHNsaWRlcyA9IHZzZ19mbGV4c2xpZGVyLnNsaWRlcztcblxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGFuZCByZW1vdmUgYWxsIGV4aXN0aW5nIHNsaWRlcyBmcm9tIHRoZSBGbGV4U2xpZGVyLlxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzbGlkZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2c2dfZmxleHNsaWRlci5yZW1vdmVTbGlkZShzbGlkZXNbal0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIGltYWdlcyBhbmQgYWRkIGVhY2ggYXMgYSBuZXcgc2xpZGUgdG8gdGhlIEZsZXhTbGlkZXIuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gaW1hZ2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGltYWdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5lbGVtZW50ID0gaW1hZ2VzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIHZzZ19mbGV4c2xpZGVyLmFkZFNsaWRlKG5lbGVtZW50LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZm91bmRfdmFyaWF0aW9uJyBldmVudCBvbiB2YXJpYXRpb24gZm9ybXMgbm90IHlldCBsb2FkZWQgd2l0aCBWU0cuXG4gICAgLy8gVGhpcyBldmVudCBpcyB0cmlnZ2VyZWQgd2hlbiBhIHByb2R1Y3QgdmFyaWF0aW9uIGlzIHNlbGVjdGVkLlxuICAgICQoJy52YXJpYXRpb25zX2Zvcm06bm90KC52c2ctbG9hZGVkKScpLm9uKCdmb3VuZF92YXJpYXRpb24udnNnJywgZnVuY3Rpb24oZSwgdmFyaWF0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmRfdmFyaWF0aW9uXCIpO1xuXG4gICAgICAgIC8vIEZldGNoIHRoZSBnYWxsZXJ5IGltYWdlcyBzcGVjaWZpYyB0byB0aGUgc2VsZWN0ZWQgdmFyaWF0aW9uLlxuICAgICAgICB2YXIgdmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VzID0gdmFyaWF0aW9uLnZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcztcblxuICAgICAgICAvLyBVcGRhdGUgdGhlIEZsZXhTbGlkZXIgd2l0aCB0aGUgdmFyaWF0aW9uLXNwZWNpZmljIGltYWdlcy5cbiAgICAgICAgdnNnX3VwZGF0ZV9mbGV4c2xpZGVyKHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcyk7XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAncmVzZXRfZGF0YScgZXZlbnQgb24gdmFyaWF0aW9uIGZvcm1zIG5vdCB5ZXQgbG9hZGVkIHdpdGggVlNHLlxuICAgIC8vIFRoaXMgZXZlbnQgaXMgdHlwaWNhbGx5IHRyaWdnZXJlZCB3aGVuIHRoZSB2YXJpYXRpb24gZm9ybSBpcyByZXNldCB0byBpdHMgZGVmYXVsdCBzdGF0ZS5cbiAgICAkKCcudmFyaWF0aW9uc19mb3JtOm5vdCgudnNnLWxvYWRlZCknKS5vbigncmVzZXRfZGF0YS52c2cnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIEZldGNoIHRoZSBkZWZhdWx0IGdhbGxlcnkgaW1hZ2VzIHN0b3JlZCBpbiB0aGUgX1ZTRyBvYmplY3QuXG4gICAgICAgIHZhciBnYWxsZXJ5X2ltYWdlcyA9IF9WU0cuZ2FsbGVyeV9pbWFnZXM7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBGbGV4U2xpZGVyIHdpdGggdGhlIGRlZmF1bHQgZ2FsbGVyeSBpbWFnZXMuXG4gICAgICAgIHZzZ191cGRhdGVfZmxleHNsaWRlcihnYWxsZXJ5X2ltYWdlcyk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInVuZGVmaW5lZCIsIlZTRyIsImVsZW1lbnQiLCJvcHRpb25zIiwic2V0dGluZ3MiLCJleHRlbmQiLCIkZWxlbWVudCIsImFkZENsYXNzIiwicHJvZHVjdF92YXJpYXRpb25zIiwiZGF0YSIsImlzX2FqYXhfdmFyaWF0aW9uIiwibGVuZ3RoIiwiYXR0cmlidXRlRmllbGRzIiwiZmluZCIsImluaXQiLCJ1cGRhdGUiLCJ0b29sdGlwIiwiY29uc29sZSIsImxvZyIsInByb3RvdHlwZSIsImVhY2giLCJpIiwiZWwiLCJzZWxlY3QiLCJzaWJsaW5ncyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwidmFsdWUiLCJfVlNHIiwib3B0aW9uIiwic2luZ2xlIiwiY2xlYXJfb25fcmVzZWxlY3QiLCJ2YWwiLCJ0cmlnZ2VyIiwicGx1Z2luIiwiZXZlbnQiLCJzd2F0Y2hTZXR1cCIsInN0b2NrQ291bnQiLCJzZWxlY3RlZEF0dHJpYnV0ZSIsIm9wdGlvbnNfc2VsZWN0ZWQiLCJzZWxlY3RzIiwiZGlzYWJsZWRfc2VsZWN0cyIsInB1c2giLCJvcHRpb25zX2Rpc2FibGVkIiwiaW5fc3RvY2tzIiwiXyIsImRpZmZlcmVuY2UiLCJpbmRleCIsImF0dHJpYnV0ZV92YWx1ZSIsImF0dHIiLCJyZW1vdmVDbGFzcyIsImluY2x1ZGVzIiwic2VsZWN0ZWRfYXR0cmlidXRlIiwic2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlcyIsInNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lcyIsInBhcmVudCIsImF0dHJpYnV0ZV9uYW1lIiwic3RvY2tfcXVhbnRpdHkiLCJhdHRyaWJ1dGVzIiwiZ2V0X3N0b2NrX3F1YW50aXR5IiwiY2hlY2tlbXB0eWtleSIsImoiLCJoYXNWYWx1ZSIsIk9iamVjdCIsInZhbHVlcyIsInRleHQiLCJzZWxlY3RlZF92YXJpYXRpb25fYXR0cmlidXRlX2xhYmVsIiwiaGFzQ2xhc3MiLCJ0aXRsZSIsInBhcmVudHMiLCJhcHBlbmQiLCJsYWJlbF9zZXBhcmF0b3IiLCJyZW1vdmUiLCJtb3VzZW92ZXIiLCJmYWRlSW4iLCJtb3VzZWxlYXZlIiwiZmFkZU91dCIsImVtcHR5IiwiX2kiLCJfT2JqZWN0JGVudHJpZXMiLCJlbnRyaWVzIiwiX09iamVjdCRlbnRyaWVzJF9pIiwiX3NsaWNlZFRvQXJyYXkiLCJrZXkiLCJmbiIsImpRdWVyeSIsInZzZ191cGRhdGVfZmxleHNsaWRlciIsImltYWdlcyIsInZzZ19mbGV4c2xpZGVyIiwic2xpZGVzIiwicmVtb3ZlU2xpZGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm5lbGVtZW50IiwiYWRkU2xpZGUiLCJ2YXJpYXRpb24iLCJ2YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXMiLCJnYWxsZXJ5X2ltYWdlcyJdLCJzb3VyY2VSb290IjoiIn0=