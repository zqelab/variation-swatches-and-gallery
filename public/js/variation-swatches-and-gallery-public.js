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
  function vsg_update_flexslider(images) {
    var vsg_flexslider = $('.woocommerce-product-gallery').data('flexslider');
    if (vsg_flexslider) {
      var slides = vsg_flexslider.slides;
      for (var j = 0; j < slides.length; j++) {
        vsg_flexslider.removeSlide(slides[j]);
      }
      for (var key in images) {
        if (images.hasOwnProperty(key)) {
          var nelement = images[key];
          vsg_flexslider.addSlide(nelement, 0);
        }
      }
    }
  }
  $('.variations_form:not(.vsg-loaded)').on('found_variation.vsg', function (e, variation) {
    console.log("found_variation");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljL2pzL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsQ0FBQyxVQUFTQSxDQUFDLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQUU7RUFDdEMsWUFBWTs7RUFFWixTQUFTQyxHQUFHQSxDQUFDQyxPQUFPLEVBQUVDLE9BQU8sRUFBRTtJQUMzQixJQUFJLENBQUNELE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUNFLFFBQVEsR0FBR1AsQ0FBQyxDQUFDUSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUVGLE9BQU8sQ0FBQztJQUN6QyxJQUFJLENBQUNHLFFBQVEsR0FBR1QsQ0FBQyxDQUFDSyxPQUFPLENBQUM7SUFDMUIsSUFBSSxDQUFDSSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDcEMsSUFBSSxDQUFDQyxrQkFBa0IsR0FBRyxJQUFJLENBQUNGLFFBQVEsQ0FBQ0csSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRTtJQUN4RSxJQUFJLENBQUNDLGlCQUFpQixHQUFHLElBQUksQ0FBQ0Ysa0JBQWtCLENBQUNHLE1BQU0sR0FBRyxDQUFDO0lBQzNELElBQUksQ0FBQ0MsZUFBZSxHQUFHLElBQUksQ0FBQ04sUUFBUSxDQUFDTyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDL0QsSUFBSSxDQUFDQyxJQUFJLEVBQUU7SUFDWCxJQUFJLENBQUNDLE1BQU0sRUFBRTtJQUNiLElBQUksQ0FBQ0MsT0FBTyxFQUFFO0VBQ2xCO0VBQ0FuQixDQUFDLENBQUNRLE1BQU0sQ0FBQ0osR0FBRyxDQUFDZ0IsU0FBUyxFQUFFO0lBQ3BCSCxJQUFJLEVBQUUsU0FBQUEsS0FBQSxF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QUNBLEtBQUssSUFBSXNCLEdBQUcsSUFBSUksTUFBTSxFQUFFO1FBQ3BCLElBQUlBLE1BQU0sQ0FBQ0ksY0FBYyxDQUFDUixHQUFHLENBQUMsRUFBRTtVQUM1QixJQUFNUyxRQUFRLEdBQUdMLE1BQU0sQ0FBQ0osR0FBRyxDQUFDO1VBQzVCSyxjQUFjLENBQUNLLFFBQVEsQ0FBQ0QsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4QztNQUNKO0lBQ0o7RUFDSjtFQUVBL0YsQ0FBQyxDQUFDLG1DQUFtQyxDQUFDLENBQUMwQixFQUFFLENBQUMscUJBQXFCLEVBQUUsVUFBU0MsQ0FBQyxFQUFFc0UsU0FBUyxFQUFFO0lBQ3BGQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztJQUM5QixJQUFJQyx3QkFBd0IsR0FBR0gsU0FBUyxDQUFDRyx3QkFBd0I7SUFDakVYLHFCQUFxQixDQUFDVyx3QkFBd0IsQ0FBQztFQUNuRCxDQUFDLENBQUM7RUFFRnBHLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDMEIsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVNDLENBQUMsRUFBRTtJQUNwRSxJQUFJMEUsY0FBYyxHQUFHdEUsSUFBSSxDQUFDc0UsY0FBYztJQUN4Q1oscUJBQXFCLENBQUNZLGNBQWMsQ0FBQztFQUN6QyxDQUFDLENBQUM7QUFDTixDQUFDLEVBQUViLE1BQU0sQ0FBQyxDOzs7Ozs7Ozs7O0FDNUxWIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS8uL3B1YmxpYy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5Ly4vcHVibGljL3NyYy9zdHlsZXMvaW5kZXguc2Nzcz80MzI0Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gVlNHKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB7fSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCd2c2ctbG9hZGVkJyk7XG4gICAgICAgIHRoaXMucHJvZHVjdF92YXJpYXRpb25zID0gdGhpcy4kZWxlbWVudC5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbnMnKSB8fCBbXTtcbiAgICAgICAgdGhpcy5pc19hamF4X3ZhcmlhdGlvbiA9IHRoaXMucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aCA+IDA7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlRmllbGRzID0gdGhpcy4kZWxlbWVudC5maW5kKCcudmFyaWF0aW9ucyBzZWxlY3QnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHRoaXMudG9vbHRpcCgpO1xuICAgIH1cbiAgICAkLmV4dGVuZChWU0cucHJvdG90eXBlLCB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52c2ctcmF3LXNlbGVjdCcpO1xuICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrLnZzJywgJ2xpLnZzZy1zd2F0Y2gtaXRlbScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfVlNHLm9wdGlvbi5zaW5nbGUuY2xlYXJfb25fcmVzZWxlY3QgJiYgc2VsZWN0LnZhbCgpICYmIHNlbGVjdC52YWwoKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2ZvY3VzaW4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gdGhpc1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW4uc3dhdGNoU2V0dXAoKTtcbiAgICAgICAgICAgICAgICBwbHVnaW4uc3RvY2tDb3VudCgpO1xuICAgICAgICAgICAgICAgIHBsdWdpbi5zZWxlY3RlZEF0dHJpYnV0ZSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc3dhdGNoU2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52c2ctcmF3LXNlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zX3NlbGVjdGVkID0gc2VsZWN0LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzYWJsZWRfc2VsZWN0cyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZWN0LmZpbmQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RzLnB1c2goJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc19kaXNhYmxlZCA9IHNlbGVjdC5maW5kKCdvcHRpb246ZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zX2Rpc2FibGVkLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWRfc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGluX3N0b2NrcyA9IF8uZGlmZmVyZW5jZShzZWxlY3RzLCBkaXNhYmxlZF9zZWxlY3RzKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVfdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkJykuYWRkQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlcyhpbl9zdG9ja3MsIGF0dHJpYnV0ZV92YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCB2c2ctc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVfdmFsdWUgPT09IG9wdGlvbnNfc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzdG9ja0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSB0aGlzXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRfYXR0cmlidXRlID0gdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKVxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXMgPSBbXVxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lcyA9IFtdXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkX2F0dHJpYnV0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXMucHVzaCgkKHNlbGVjdGVkX2F0dHJpYnV0ZVtpXSkuZGF0YSgndmFsdWUnKSlcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9hdHRyaWJ1dGVfbmFtZXMucHVzaCgkKHNlbGVjdGVkX2F0dHJpYnV0ZVtpXSkucGFyZW50KCkuZGF0YSgnYXR0cmlidXRlX25hbWUnKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnbGkudnNnLXN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV9uYW1lID0gJCh0aGlzKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpO1xuICAgICAgICAgICAgICAgIHZhciBzdG9ja19xdWFudGl0eSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW4ucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gcGx1Z2luLnByb2R1Y3RfdmFyaWF0aW9uc1tpXS5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgICAgIHZhciBnZXRfc3RvY2tfcXVhbnRpdHkgPSBwbHVnaW4ucHJvZHVjdF92YXJpYXRpb25zW2ldLnN0b2NrX3F1YW50aXR5O1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlbXB0eWtleSA9IHBsdWdpbi5jaGVja2VtcHR5a2V5KGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gPT0gdmFsdWUgfHwgIWF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXNbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1ZhbHVlID09PSBmYWxzZSAmJiBzZWxlY3RlZF9hdHRyaWJ1dGVfbmFtZXNbal0gIT09IGF0dHJpYnV0ZV9uYW1lICYmIGF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdICYmICFjaGVja2VtcHR5a2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRfc3RvY2tfcXVhbnRpdHkgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VtcHR5a2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tlbXB0eWtleS5pbmNsdWRlcyhzZWxlY3RlZF9hdHRyaWJ1dGVfbmFtZXNbal0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX2F0dHJpYnV0ZV92YWx1ZXNbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lc1tqXSAhPT0gYXR0cmlidXRlX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRfc3RvY2tfcXVhbnRpdHkgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9ja19xdWFudGl0eSArPSBnZXRfc3RvY2tfcXVhbnRpdHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudnNnLXN3YXRjaC1pdGVtLXN0b2NrLWNvdW50JykudGV4dChzdG9ja19xdWFudGl0eSArICcgbGVmdCcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0ZWRBdHRyaWJ1dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFfVlNHLm9wdGlvbi5zaW5nbGUuc2VsZWN0ZWRfdmFyaWF0aW9uX2F0dHJpYnV0ZV9sYWJlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSAkKHRoaXMpLmRhdGEoJ3RpdGxlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGgubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RoLmxhYmVsJykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInNlbGVjdGVkLWF0dHJpYnV0ZVwiPjwvc3Bhbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGgubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnRleHQoJyAnICsgX1ZTRy5vcHRpb24uc2luZ2xlLmxhYmVsX3NlcGFyYXRvciArICcgJyArIHRpdGxlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcudnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RoLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0b29sdGlwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnbGkudnNnLXN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlb3ZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudnNnLXN3YXRjaC1pdGVtLXRvb2x0aXAnKS5mYWRlSW4oJ3Nsb3cnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICQodGhpcykubW91c2VsZWF2ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudnNnLXN3YXRjaC1pdGVtLXRvb2x0aXAnKS5mYWRlT3V0KCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrZW1wdHlrZXk6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHZhciBlbXB0eSA9IFtdXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZW1wdHkucHVzaChrZXkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgICQuZm5bJ1ZTRyddID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgJ1ZTRycpKSB7XG4gICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdWU0cnLCBuZXcgVlNHKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbihmdW5jdGlvbigkKSB7XG4gICAgJChkb2N1bWVudCkub24oJ3djX3ZhcmlhdGlvbl9mb3JtLnZzJywgJy52YXJpYXRpb25zX2Zvcm06bm90KC52c2ctbG9hZGVkKScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICQodGhpcykuVlNHKCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiB2c2dfdXBkYXRlX2ZsZXhzbGlkZXIoaW1hZ2VzKSB7XG4gICAgICAgIHZhciB2c2dfZmxleHNsaWRlciA9ICQoJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnknKS5kYXRhKCdmbGV4c2xpZGVyJylcbiAgICAgICAgaWYgKHZzZ19mbGV4c2xpZGVyKXtcbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSB2c2dfZmxleHNsaWRlci5zbGlkZXNcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2xpZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdnNnX2ZsZXhzbGlkZXIucmVtb3ZlU2xpZGUoc2xpZGVzW2pdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGltYWdlcykge1xuICAgICAgICAgICAgICAgIGlmIChpbWFnZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZWxlbWVudCA9IGltYWdlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICB2c2dfZmxleHNsaWRlci5hZGRTbGlkZShuZWxlbWVudCwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJCgnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZzZy1sb2FkZWQpJykub24oJ2ZvdW5kX3ZhcmlhdGlvbi52c2cnLCBmdW5jdGlvbihlLCB2YXJpYXRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZF92YXJpYXRpb25cIilcbiAgICAgICAgdmFyIHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcyA9IHZhcmlhdGlvbi52YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXNcbiAgICAgICAgdnNnX3VwZGF0ZV9mbGV4c2xpZGVyKHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcylcbiAgICB9KVxuXG4gICAgJCgnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZzZy1sb2FkZWQpJykub24oJ3Jlc2V0X2RhdGEudnNnJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgZ2FsbGVyeV9pbWFnZXMgPSBfVlNHLmdhbGxlcnlfaW1hZ2VzXG4gICAgICAgIHZzZ191cGRhdGVfZmxleHNsaWRlcihnYWxsZXJ5X2ltYWdlcylcbiAgICB9KTtcbn0pKGpRdWVyeSk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInVuZGVmaW5lZCIsIlZTRyIsImVsZW1lbnQiLCJvcHRpb25zIiwic2V0dGluZ3MiLCJleHRlbmQiLCIkZWxlbWVudCIsImFkZENsYXNzIiwicHJvZHVjdF92YXJpYXRpb25zIiwiZGF0YSIsImlzX2FqYXhfdmFyaWF0aW9uIiwibGVuZ3RoIiwiYXR0cmlidXRlRmllbGRzIiwiZmluZCIsImluaXQiLCJ1cGRhdGUiLCJ0b29sdGlwIiwicHJvdG90eXBlIiwiZWFjaCIsImkiLCJlbCIsInNlbGVjdCIsInNpYmxpbmdzIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJ2YWx1ZSIsIl9WU0ciLCJvcHRpb24iLCJzaW5nbGUiLCJjbGVhcl9vbl9yZXNlbGVjdCIsInZhbCIsInRyaWdnZXIiLCJwbHVnaW4iLCJldmVudCIsInN3YXRjaFNldHVwIiwic3RvY2tDb3VudCIsInNlbGVjdGVkQXR0cmlidXRlIiwib3B0aW9uc19zZWxlY3RlZCIsInNlbGVjdHMiLCJkaXNhYmxlZF9zZWxlY3RzIiwicHVzaCIsIm9wdGlvbnNfZGlzYWJsZWQiLCJpbl9zdG9ja3MiLCJfIiwiZGlmZmVyZW5jZSIsImluZGV4IiwiYXR0cmlidXRlX3ZhbHVlIiwiYXR0ciIsInJlbW92ZUNsYXNzIiwiaW5jbHVkZXMiLCJzZWxlY3RlZF9hdHRyaWJ1dGUiLCJzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzIiwic2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzIiwicGFyZW50IiwiYXR0cmlidXRlX25hbWUiLCJzdG9ja19xdWFudGl0eSIsImF0dHJpYnV0ZXMiLCJnZXRfc3RvY2tfcXVhbnRpdHkiLCJjaGVja2VtcHR5a2V5IiwiaiIsImhhc1ZhbHVlIiwiT2JqZWN0IiwidmFsdWVzIiwidGV4dCIsInNlbGVjdGVkX3ZhcmlhdGlvbl9hdHRyaWJ1dGVfbGFiZWwiLCJoYXNDbGFzcyIsInRpdGxlIiwicGFyZW50cyIsImFwcGVuZCIsImxhYmVsX3NlcGFyYXRvciIsInJlbW92ZSIsIm1vdXNlb3ZlciIsImZhZGVJbiIsIm1vdXNlbGVhdmUiLCJmYWRlT3V0IiwiZW1wdHkiLCJfaSIsIl9PYmplY3QkZW50cmllcyIsImVudHJpZXMiLCJfT2JqZWN0JGVudHJpZXMkX2kiLCJfc2xpY2VkVG9BcnJheSIsImtleSIsImZuIiwialF1ZXJ5IiwidnNnX3VwZGF0ZV9mbGV4c2xpZGVyIiwiaW1hZ2VzIiwidnNnX2ZsZXhzbGlkZXIiLCJzbGlkZXMiLCJyZW1vdmVTbGlkZSIsImhhc093blByb3BlcnR5IiwibmVsZW1lbnQiLCJhZGRTbGlkZSIsInZhcmlhdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJ2YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXMiLCJnYWxsZXJ5X2ltYWdlcyJdLCJzb3VyY2VSb290IjoiIn0=