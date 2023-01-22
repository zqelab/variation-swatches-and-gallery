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
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
(function ($, window, document, undefined) {
  'use strict';

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
  $.extend(VSG.prototype, {
    init: function init() {
      this.$element.find('ul.vsg-swatch-items-wrapper').each(function (i, el) {
        var select = $(this).siblings('select.vsg-raw-select');
        $(this).on('click.vs', 'li.vsg-swatch-item', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var value = $(this).data('value');
          if (_VSG.option.single.clear_on_reselect && select.val() && select.val() === value) {
            select.val('');
          } else {
            select.val(value);
          }
          select.trigger('change');
          select.trigger('click');
          select.trigger('focusin');
        });
      });
    },
    update: function update() {
      var plugin = this;
      this.$element.on('woocommerce_variation_has_changed.vs', function (event) {
        plugin.swatchSetup();
        plugin.stockCount();
        plugin.selectedAttribute();
      });
    },
    swatchSetup: function swatchSetup() {
      this.$element.find('ul.vsg-swatch-items-wrapper').each(function (i, el) {
        var select = $(this).siblings('select.vsg-raw-select');
        var options_selected = select.find('option:selected').length === 0 ? null : select.find('option:selected').val();
        var selects = [];
        var disabled_selects = [];
        var options = select.find('option');
        options.each(function () {
          if ($(this).val() !== '') {
            selects.push($(this).val());
          }
        });
        var options_disabled = select.find('option:disabled');
        options_disabled.each(function () {
          if ($(this).val() !== '') {
            disabled_selects.push($(this).val());
          }
        });
        var in_stocks = _.difference(selects, disabled_selects);
        $(this).find('li.vsg-swatch-item').each(function (index, el) {
          var attribute_value = $(this).attr('data-value');
          $(this).removeClass('vsg-swatch-item-selected').addClass('vsg-swatch-item-disabled');
          if (_.includes(in_stocks, attribute_value)) {
            $(this).removeClass('vsg-swatch-item-selected vsg-swatch-item-disabled');
            if (attribute_value === options_selected) {
              $(this).addClass('vsg-swatch-item-selected');
            }
          }
        });
      });
    },
    stockCount: function stockCount() {
      var plugin = this;
      var selected_attribute = this.$element.find('ul.vsg-swatch-items-wrapper').find('li.vsg-swatch-item-selected');
      var selected_attribute_values = [];
      var selected_attribute_names = [];
      for (var i = 0; i < selected_attribute.length; i++) {
        selected_attribute_values.push($(selected_attribute[i]).data('value'));
        selected_attribute_names.push($(selected_attribute[i]).parent().data('attribute_name'));
      }
      this.$element.find('li.vsg-swatch-item').each(function (index, el) {
        var value = $(this).data('value');
        var attribute_name = $(this).parent().data('attribute_name');
        var stock_quantity = 0;
        for (var i = 0; i < plugin.product_variations.length; i++) {
          var attributes = plugin.product_variations[i].attributes;
          var get_stock_quantity = plugin.product_variations[i].stock_quantity;
          var checkemptykey = plugin.checkemptykey(attributes);
          if (attributes[attribute_name] == value || !attributes[attribute_name]) {
            for (var j = 0; j < selected_attribute_values.length; j++) {
              var hasValue = Object.values(attributes).includes(selected_attribute_values[j]);
              if (hasValue === false && selected_attribute_names[j] !== attribute_name && attributes[attribute_name] && !checkemptykey.length) {
                get_stock_quantity = 0;
              }
              if (checkemptykey) {
                if (!checkemptykey.includes(selected_attribute_names[j])) {
                  var hasValue = Object.values(attributes).includes(selected_attribute_values[j]);
                  if (hasValue === false && selected_attribute_names[j] !== attribute_name) {
                    get_stock_quantity = 0;
                  }
                }
              }
            }
            stock_quantity += get_stock_quantity;
          }
          $(this).find('.vsg-swatch-item-stock-count').text(stock_quantity + ' left');
        }
      });
    },
    selectedAttribute: function selectedAttribute() {
      if (!_VSG.option.single.selected_variation_attribute_label) {
        return false;
      }
      this.$element.find('li.vsg-swatch-item').each(function (index, el) {
        if ($(this).hasClass('vsg-swatch-item-selected')) {
          var title = $(this).data('title');
          if ($(this).parents('tr').find('th.label .selected-attribute').length === 0) {
            $(this).parents('tr').find('th.label').append('<span class="selected-attribute"></span>');
          }
          $(this).parents('tr').find('th.label .selected-attribute').text(' ' + _VSG.option.single.label_separator + ' ' + title);
        }
        if ($(this).parent().find('.vsg-swatch-item-selected').length == 0) {
          $(this).parents('tr').find('th.label .selected-attribute').remove();
        }
      });
    },
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
  $.fn['VSG'] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'VSG')) {
        $.data(this, 'VSG', new VSG(this, options));
      }
    });
  };
})(jQuery, window, document);
(function ($) {
  $(document).on('wc_variation_form.vs', '.variations_form:not(.vsg-loaded)', function (event) {
    $(this).VSG();
  });
  function vsg_update_flexslider(variation_gallery_images) {
    var vsg_flexslider = $('.woocommerce-product-gallery').data('flexslider');
    if (vsg_flexslider) {
      var slides = vsg_flexslider.slides;
      for (var j = 0; j < slides.length; j++) {
        vsg_flexslider.removeSlide(slides[j]);
      }
      for (var k = 0; k < variation_gallery_images.length; k++) {
        var nelement = variation_gallery_images[k];
        vsg_flexslider.addSlide(nelement, 0);
      }
    }
  }
  $('.variations_form:not(.vsg-loaded)').on('found_variation.vsg', function (e, variation) {
    var variation_gallery_images = variation.variation_gallery_images;
    vsg_update_flexslider(variation_gallery_images);
  });
  $('.variations_form:not(.vsg-loaded)').on('reset_data.vsg', function (e) {
    var gallery_images = _VSG.gallery_images;
    vsg_update_flexslider(gallery_images);
  });
})(jQuery);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljL2pzL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsQ0FBQyxVQUFTQSxDQUFDLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQUU7RUFDdEMsWUFBWTs7RUFFWixTQUFTQyxHQUFHLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQzNCLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0UsUUFBUSxHQUFHUCxDQUFDLENBQUNRLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRUYsT0FBTyxDQUFDO0lBQ3pDLElBQUksQ0FBQ0csUUFBUSxHQUFHVCxDQUFDLENBQUNLLE9BQU8sQ0FBQztJQUMxQixJQUFJLENBQUNJLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUNwQyxJQUFJLENBQUNDLGtCQUFrQixHQUFHLElBQUksQ0FBQ0YsUUFBUSxDQUFDRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO0lBQ3hFLElBQUksQ0FBQ0MsaUJBQWlCLEdBQUcsSUFBSSxDQUFDRixrQkFBa0IsQ0FBQ0csTUFBTSxHQUFHLENBQUM7SUFDM0QsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDTixRQUFRLENBQUNPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUMvRCxJQUFJLENBQUNDLElBQUksRUFBRTtJQUNYLElBQUksQ0FBQ0MsTUFBTSxFQUFFO0lBQ2IsSUFBSSxDQUFDQyxPQUFPLEVBQUU7RUFDbEI7RUFDQW5CLENBQUMsQ0FBQ1EsTUFBTSxDQUFDSixHQUFHLENBQUNnQixTQUFTLEVBQUU7SUFDcEJILElBQUksRUFBRSxnQkFBVztNQUNiLElB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RixDQUFDLENBQUMsbUNBQW1DLENBQUMsQ0FBQzBCLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxVQUFTQyxDQUFDLEVBQUVrRSxTQUFTLEVBQUU7SUFDcEYsSUFBSVAsd0JBQXdCLEdBQUdPLFNBQVMsQ0FBQ1Asd0JBQXdCO0lBQ2pFRCxxQkFBcUIsQ0FBQ0Msd0JBQXdCLENBQUM7RUFDbkQsQ0FBQyxDQUFDO0VBQ0Z0RixDQUFDLENBQUMsbUNBQW1DLENBQUMsQ0FBQzBCLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTQyxDQUFDLEVBQUU7SUFDcEUsSUFBSW1FLGNBQWMsR0FBRy9ELElBQUksQ0FBQytELGNBQWM7SUFDeENULHFCQUFxQixDQUFDUyxjQUFjLENBQUM7RUFDekMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxFQUFFVixNQUFNLENBQUMsQzs7Ozs7Ozs7OztBQ3RMViIsInNvdXJjZXMiOlsid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvLi9wdWJsaWMvc3JjL2luZGV4LmpzIiwid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS8uL3B1YmxpYy9zcmMvc3R5bGVzL2luZGV4LnNjc3M/NDMyNCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFZTRyhlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwge30sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygndnNnLWxvYWRlZCcpO1xuICAgICAgICB0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgncHJvZHVjdF92YXJpYXRpb25zJykgfHwgW107XG4gICAgICAgIHRoaXMuaXNfYWpheF92YXJpYXRpb24gPSB0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucy5sZW5ndGggPiAwO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUZpZWxkcyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnZhcmlhdGlvbnMgc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnRvb2x0aXAoKTtcbiAgICB9XG4gICAgJC5leHRlbmQoVlNHLnByb3RvdHlwZSwge1xuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgndWwudnNnLXN3YXRjaC1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3QgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3QudnNnLXJhdy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljay52cycsICdsaS52c2ctc3dhdGNoLWl0ZW0nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX1ZTRy5vcHRpb24uc2luZ2xlLmNsZWFyX29uX3Jlc2VsZWN0ICYmIHNlbGVjdC52YWwoKSAmJiBzZWxlY3QudmFsKCkgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdmb2N1c2luJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXNcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52cycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcGx1Z2luLnN3YXRjaFNldHVwKCk7XG4gICAgICAgICAgICAgICAgcGx1Z2luLnN0b2NrQ291bnQoKTtcbiAgICAgICAgICAgICAgICBwbHVnaW4uc2VsZWN0ZWRBdHRyaWJ1dGUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHN3YXRjaFNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgndWwudnNnLXN3YXRjaC1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3QudnNnLXJhdy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc19zZWxlY3RlZCA9IHNlbGVjdC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5sZW5ndGggPT09IDAgPyBudWxsIDogc2VsZWN0LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGRpc2FibGVkX3NlbGVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGVjdC5maW5kKCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNfZGlzYWJsZWQgPSBzZWxlY3QuZmluZCgnb3B0aW9uOmRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgb3B0aW9uc19kaXNhYmxlZC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkX3NlbGVjdHMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBpbl9zdG9ja3MgPSBfLmRpZmZlcmVuY2Uoc2VsZWN0cywgZGlzYWJsZWRfc2VsZWN0cyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX3ZhbHVlID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmFkZENsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZXMoaW5fc3RvY2tzLCBhdHRyaWJ1dGVfdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQgdnNnLXN3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlX3ZhbHVlID09PSBvcHRpb25zX3NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygndnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc3RvY2tDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gdGhpc1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkX2F0dHJpYnV0ZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgndWwudnNnLXN3YXRjaC1pdGVtcy13cmFwcGVyJykuZmluZCgnbGkudnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkJylcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzID0gW11cbiAgICAgICAgICAgIHZhciBzZWxlY3RlZF9hdHRyaWJ1dGVfbmFtZXMgPSBbXVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RlZF9hdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzLnB1c2goJChzZWxlY3RlZF9hdHRyaWJ1dGVbaV0pLmRhdGEoJ3ZhbHVlJykpXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzLnB1c2goJChzZWxlY3RlZF9hdHRyaWJ1dGVbaV0pLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJykpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVfbmFtZSA9ICQodGhpcykucGFyZW50KCkuZGF0YSgnYXR0cmlidXRlX25hbWUnKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RvY2tfcXVhbnRpdHkgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2luLnByb2R1Y3RfdmFyaWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHBsdWdpbi5wcm9kdWN0X3ZhcmlhdGlvbnNbaV0uYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2V0X3N0b2NrX3F1YW50aXR5ID0gcGx1Z2luLnByb2R1Y3RfdmFyaWF0aW9uc1tpXS5zdG9ja19xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrZW1wdHlrZXkgPSBwbHVnaW4uY2hlY2tlbXB0eWtleShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdID09IHZhbHVlIHx8ICFhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1ZhbHVlID0gT2JqZWN0LnZhbHVlcyhhdHRyaWJ1dGVzKS5pbmNsdWRlcyhzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNWYWx1ZSA9PT0gZmFsc2UgJiYgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzW2pdICE9PSBhdHRyaWJ1dGVfbmFtZSAmJiBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSAmJiAhY2hlY2tlbXB0eWtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlbXB0eWtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrZW1wdHlrZXkuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1ZhbHVlID0gT2JqZWN0LnZhbHVlcyhhdHRyaWJ1dGVzKS5pbmNsdWRlcyhzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1ZhbHVlID09PSBmYWxzZSAmJiBzZWxlY3RlZF9hdHRyaWJ1dGVfbmFtZXNbal0gIT09IGF0dHJpYnV0ZV9uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2tfcXVhbnRpdHkgKz0gZ2V0X3N0b2NrX3F1YW50aXR5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS1zdG9jay1jb3VudCcpLnRleHQoc3RvY2tfcXVhbnRpdHkgKyAnIGxlZnQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdGVkQXR0cmlidXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghX1ZTRy5vcHRpb24uc2luZ2xlLnNlbGVjdGVkX3ZhcmlhdGlvbl9hdHRyaWJ1dGVfbGFiZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnbGkudnNnLXN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygndnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gJCh0aGlzKS5kYXRhKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RoLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0aC5sYWJlbCcpLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJzZWxlY3RlZC1hdHRyaWJ1dGVcIj48L3NwYW4+Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RoLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS50ZXh0KCcgJyArIF9WU0cub3B0aW9uLnNpbmdsZS5sYWJlbF9zZXBhcmF0b3IgKyAnICcgKyB0aXRsZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50KCkuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0aC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbHRpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5tb3VzZW92ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS10b29sdGlwJykuZmFkZUluKCdzbG93Jyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlbGVhdmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZzZy1zd2F0Y2gtaXRlbS10b29sdGlwJykuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBjaGVja2VtcHR5a2V5OiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICB2YXIgZW1wdHkgPSBbXVxuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVtcHR5LnB1c2goa2V5KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICAkLmZuWydWU0cnXSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsICdWU0cnKSkge1xuICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAnVlNHJywgbmV3IFZTRyh0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuKGZ1bmN0aW9uKCQpIHtcbiAgICAkKGRvY3VtZW50KS5vbignd2NfdmFyaWF0aW9uX2Zvcm0udnMnLCAnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZzZy1sb2FkZWQpJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgJCh0aGlzKS5WU0coKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHZzZ191cGRhdGVfZmxleHNsaWRlcih2YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXMpIHtcbiAgICAgICAgdmFyIHZzZ19mbGV4c2xpZGVyID0gJCgnLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeScpLmRhdGEoJ2ZsZXhzbGlkZXInKVxuICAgICAgICBpZiAodnNnX2ZsZXhzbGlkZXIpe1xuICAgICAgICAgICAgdmFyIHNsaWRlcyA9IHZzZ19mbGV4c2xpZGVyLnNsaWRlc1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzbGlkZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2c2dfZmxleHNsaWRlci5yZW1vdmVTbGlkZShzbGlkZXNbal0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5lbGVtZW50ID0gdmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VzW2tdO1xuICAgICAgICAgICAgICAgIHZzZ19mbGV4c2xpZGVyLmFkZFNsaWRlKG5lbGVtZW50LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAkKCcudmFyaWF0aW9uc19mb3JtOm5vdCgudnNnLWxvYWRlZCknKS5vbignZm91bmRfdmFyaWF0aW9uLnZzZycsIGZ1bmN0aW9uKGUsIHZhcmlhdGlvbikge1xuICAgICAgICB2YXIgdmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VzID0gdmFyaWF0aW9uLnZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlc1xuICAgICAgICB2c2dfdXBkYXRlX2ZsZXhzbGlkZXIodmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VzKVxuICAgIH0pXG4gICAgJCgnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZzZy1sb2FkZWQpJykub24oJ3Jlc2V0X2RhdGEudnNnJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgZ2FsbGVyeV9pbWFnZXMgPSBfVlNHLmdhbGxlcnlfaW1hZ2VzXG4gICAgICAgIHZzZ191cGRhdGVfZmxleHNsaWRlcihnYWxsZXJ5X2ltYWdlcylcbiAgICB9KTtcbn0pKGpRdWVyeSk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInVuZGVmaW5lZCIsIlZTRyIsImVsZW1lbnQiLCJvcHRpb25zIiwic2V0dGluZ3MiLCJleHRlbmQiLCIkZWxlbWVudCIsImFkZENsYXNzIiwicHJvZHVjdF92YXJpYXRpb25zIiwiZGF0YSIsImlzX2FqYXhfdmFyaWF0aW9uIiwibGVuZ3RoIiwiYXR0cmlidXRlRmllbGRzIiwiZmluZCIsImluaXQiLCJ1cGRhdGUiLCJ0b29sdGlwIiwicHJvdG90eXBlIiwiZWFjaCIsImkiLCJlbCIsInNlbGVjdCIsInNpYmxpbmdzIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJ2YWx1ZSIsIl9WU0ciLCJvcHRpb24iLCJzaW5nbGUiLCJjbGVhcl9vbl9yZXNlbGVjdCIsInZhbCIsInRyaWdnZXIiLCJwbHVnaW4iLCJldmVudCIsInN3YXRjaFNldHVwIiwic3RvY2tDb3VudCIsInNlbGVjdGVkQXR0cmlidXRlIiwib3B0aW9uc19zZWxlY3RlZCIsInNlbGVjdHMiLCJkaXNhYmxlZF9zZWxlY3RzIiwicHVzaCIsIm9wdGlvbnNfZGlzYWJsZWQiLCJpbl9zdG9ja3MiLCJfIiwiZGlmZmVyZW5jZSIsImluZGV4IiwiYXR0cmlidXRlX3ZhbHVlIiwiYXR0ciIsInJlbW92ZUNsYXNzIiwiaW5jbHVkZXMiLCJzZWxlY3RlZF9hdHRyaWJ1dGUiLCJzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzIiwic2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzIiwicGFyZW50IiwiYXR0cmlidXRlX25hbWUiLCJzdG9ja19xdWFudGl0eSIsImF0dHJpYnV0ZXMiLCJnZXRfc3RvY2tfcXVhbnRpdHkiLCJjaGVja2VtcHR5a2V5IiwiaiIsImhhc1ZhbHVlIiwiT2JqZWN0IiwidmFsdWVzIiwidGV4dCIsInNlbGVjdGVkX3ZhcmlhdGlvbl9hdHRyaWJ1dGVfbGFiZWwiLCJoYXNDbGFzcyIsInRpdGxlIiwicGFyZW50cyIsImFwcGVuZCIsImxhYmVsX3NlcGFyYXRvciIsInJlbW92ZSIsIm1vdXNlb3ZlciIsImZhZGVJbiIsIm1vdXNlbGVhdmUiLCJmYWRlT3V0IiwiZW1wdHkiLCJlbnRyaWVzIiwia2V5IiwiZm4iLCJqUXVlcnkiLCJ2c2dfdXBkYXRlX2ZsZXhzbGlkZXIiLCJ2YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXMiLCJ2c2dfZmxleHNsaWRlciIsInNsaWRlcyIsInJlbW92ZVNsaWRlIiwiayIsIm5lbGVtZW50IiwiYWRkU2xpZGUiLCJ2YXJpYXRpb24iLCJnYWxsZXJ5X2ltYWdlcyJdLCJzb3VyY2VSb290IjoiIn0=