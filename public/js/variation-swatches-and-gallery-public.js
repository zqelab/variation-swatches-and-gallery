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
          if (_VSG.option.advanced.clear_on_reselect && select.val() && select.val() === value) {
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
          $(this).find('.vsg-swatch-item-tooltip').fadeIn();
        });
        $(this).mouseleave(function () {
          $(this).find('.vsg-swatch-item-tooltip').fadeOut();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljL2pzL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsQ0FBQyxVQUFTQSxDQUFDLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQUU7RUFDdEMsWUFBWTs7RUFFWixTQUFTQyxHQUFHLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQzNCLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0UsUUFBUSxHQUFHUCxDQUFDLENBQUNRLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRUYsT0FBTyxDQUFDO0lBQ3pDLElBQUksQ0FBQ0csUUFBUSxHQUFHVCxDQUFDLENBQUNLLE9BQU8sQ0FBQztJQUMxQixJQUFJLENBQUNJLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUNwQyxJQUFJLENBQUNDLGtCQUFrQixHQUFHLElBQUksQ0FBQ0YsUUFBUSxDQUFDRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO0lBQ3hFLElBQUksQ0FBQ0MsaUJBQWlCLEdBQUcsSUFBSSxDQUFDRixrQkFBa0IsQ0FBQ0csTUFBTSxHQUFHLENBQUM7SUFDM0QsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDTixRQUFRLENBQUNPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUMvRCxJQUFJLENBQUNDLElBQUksRUFBRTtJQUNYLElBQUksQ0FBQ0MsTUFBTSxFQUFFO0lBQ2IsSUFBSSxDQUFDQyxPQUFPLEVBQUU7RUFDbEI7RUFDQW5CLENBQUMsQ0FBQ1EsTUFBTSxDQUFDSixHQUFHLENBQUNnQixTQUFTLEVBQUU7SUFDcEJILElBQUksRUFBRSxnQkFBVztNQUNiLElB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Q0FBQyxDQUFDMEIsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFVBQVNDLENBQUMsRUFBRW1FLFNBQVMsRUFBRTtJQUNwRixJQUFJUCx3QkFBd0IsR0FBR08sU0FBUyxDQUFDUCx3QkFBd0I7SUFDakVELHFCQUFxQixDQUFDQyx3QkFBd0IsQ0FBQztFQUNuRCxDQUFDLENBQUM7RUFDRnZGLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDMEIsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVNDLENBQUMsRUFBRTtJQUNwRSxJQUFJb0UsY0FBYyxHQUFHaEUsSUFBSSxDQUFDZ0UsY0FBYztJQUN4Q1QscUJBQXFCLENBQUNTLGNBQWMsQ0FBQztFQUN6QyxDQUFDLENBQUM7QUFDTixDQUFDLEVBQUVWLE1BQU0sQ0FBQyxDOzs7Ozs7Ozs7O0FDdExWIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS8uL3B1YmxpYy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5Ly4vcHVibGljL3NyYy9zdHlsZXMvaW5kZXguc2Nzcz80MzI0Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gVlNHKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB7fSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCd2c2ctbG9hZGVkJyk7XG4gICAgICAgIHRoaXMucHJvZHVjdF92YXJpYXRpb25zID0gdGhpcy4kZWxlbWVudC5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbnMnKSB8fCBbXTtcbiAgICAgICAgdGhpcy5pc19hamF4X3ZhcmlhdGlvbiA9IHRoaXMucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aCA+IDA7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlRmllbGRzID0gdGhpcy4kZWxlbWVudC5maW5kKCcudmFyaWF0aW9ucyBzZWxlY3QnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHRoaXMudG9vbHRpcCgpO1xuICAgIH1cbiAgICAkLmV4dGVuZChWU0cucHJvdG90eXBlLCB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC52c2ctc3dhdGNoLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52c2ctcmF3LXNlbGVjdCcpO1xuICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrLnZzJywgJ2xpLnZzZy1zd2F0Y2gtaXRlbScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfVlNHLm9wdGlvbi5hZHZhbmNlZC5jbGVhcl9vbl9yZXNlbGVjdCAmJiBzZWxlY3QudmFsKCkgJiYgc2VsZWN0LnZhbCgpID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSB0aGlzXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudnMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5zd2F0Y2hTZXR1cCgpO1xuICAgICAgICAgICAgICAgIHBsdWdpbi5zdG9ja0NvdW50KCk7XG4gICAgICAgICAgICAgICAgcGx1Z2luLnNlbGVjdGVkQXR0cmlidXRlKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzd2F0Y2hTZXR1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ3VsLnZzZy1zd2F0Y2gtaXRlbXMtd3JhcHBlcicpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gJCh0aGlzKS5zaWJsaW5ncygnc2VsZWN0LnZzZy1yYXctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNfc2VsZWN0ZWQgPSBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykubGVuZ3RoID09PSAwID8gbnVsbCA6IHNlbGVjdC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0cyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZF9zZWxlY3RzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxlY3QuZmluZCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdHMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zX2Rpc2FibGVkID0gc2VsZWN0LmZpbmQoJ29wdGlvbjpkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnNfZGlzYWJsZWQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZF9zZWxlY3RzLnB1c2goJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgaW5fc3RvY2tzID0gXy5kaWZmZXJlbmNlKHNlbGVjdHMsIGRpc2FibGVkX3NlbGVjdHMpO1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnbGkudnNnLXN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV92YWx1ZSA9ICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd2c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5hZGRDbGFzcygndnNnLXN3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGVzKGluX3N0b2NrcywgYXR0cmlidXRlX3ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndnNnLXN3YXRjaC1pdGVtLXNlbGVjdGVkIHZzZy1zd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZV92YWx1ZSA9PT0gb3B0aW9uc19zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHN0b2NrQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXNcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZF9hdHRyaWJ1dGUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ3VsLnZzZy1zd2F0Y2gtaXRlbXMtd3JhcHBlcicpLmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlcyA9IFtdXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzID0gW11cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0ZWRfYXR0cmlidXRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlcy5wdXNoKCQoc2VsZWN0ZWRfYXR0cmlidXRlW2ldKS5kYXRhKCd2YWx1ZScpKVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lcy5wdXNoKCQoc2VsZWN0ZWRfYXR0cmlidXRlW2ldKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuZGF0YSgndmFsdWUnKTtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX25hbWUgPSAkKHRoaXMpLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJyk7XG4gICAgICAgICAgICAgICAgdmFyIHN0b2NrX3F1YW50aXR5ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsdWdpbi5wcm9kdWN0X3ZhcmlhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBwbHVnaW4ucHJvZHVjdF92YXJpYXRpb25zW2ldLmF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdldF9zdG9ja19xdWFudGl0eSA9IHBsdWdpbi5wcm9kdWN0X3ZhcmlhdGlvbnNbaV0uc3RvY2tfcXVhbnRpdHk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VtcHR5a2V5ID0gcGx1Z2luLmNoZWNrZW1wdHlrZXkoYXR0cmlidXRlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSA9PSB2YWx1ZSB8fCAhYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNWYWx1ZSA9IE9iamVjdC52YWx1ZXMoYXR0cmlidXRlcykuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlc1tqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lc1tqXSAhPT0gYXR0cmlidXRlX25hbWUgJiYgYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gJiYgIWNoZWNrZW1wdHlrZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldF9zdG9ja19xdWFudGl0eSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZW1wdHlrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja2VtcHR5a2V5LmluY2x1ZGVzKHNlbGVjdGVkX2F0dHJpYnV0ZV9uYW1lc1tqXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNWYWx1ZSA9IE9iamVjdC52YWx1ZXMoYXR0cmlidXRlcykuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlX3ZhbHVlc1tqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNWYWx1ZSA9PT0gZmFsc2UgJiYgc2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzW2pdICE9PSBhdHRyaWJ1dGVfbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldF9zdG9ja19xdWFudGl0eSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrX3F1YW50aXR5ICs9IGdldF9zdG9ja19xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy52c2ctc3dhdGNoLWl0ZW0tc3RvY2stY291bnQnKS50ZXh0KHN0b2NrX3F1YW50aXR5ICsgJyBsZWZ0JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZEF0dHJpYnV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIV9WU0cub3B0aW9uLnNpbmdsZS5zZWxlY3RlZF92YXJpYXRpb25fYXR0cmlidXRlX2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ2xpLnZzZy1zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3ZzZy1zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9ICQodGhpcykuZGF0YSgndGl0bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0aC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGgubGFiZWwnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWQtYXR0cmlidXRlXCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0aC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykudGV4dCgnICcgKyBfVlNHLm9wdGlvbi5zaW5nbGUubGFiZWxfc2VwYXJhdG9yICsgJyAnICsgdGl0bGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy52c2ctc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGgubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCdsaS52c2ctc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICQodGhpcykubW91c2VvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy52c2ctc3dhdGNoLWl0ZW0tdG9vbHRpcCcpLmZhZGVJbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy52c2ctc3dhdGNoLWl0ZW0tdG9vbHRpcCcpLmZhZGVPdXQoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY2hlY2tlbXB0eWtleTogZnVuY3Rpb24oYXR0cmlidXRlcykge1xuICAgICAgICAgICAgdmFyIGVtcHR5ID0gW11cbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbXB0eS5wdXNoKGtleSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgJC5mblsnVlNHJ10gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoISQuZGF0YSh0aGlzLCAnVlNHJykpIHtcbiAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ1ZTRycsIG5ldyBWU0codGhpcywgb3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbihmdW5jdGlvbigkKSB7XG4gICAgJChkb2N1bWVudCkub24oJ3djX3ZhcmlhdGlvbl9mb3JtLnZzJywgJy52YXJpYXRpb25zX2Zvcm06bm90KC52c2ctbG9hZGVkKScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICQodGhpcykuVlNHKCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiB2c2dfdXBkYXRlX2ZsZXhzbGlkZXIodmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VzKSB7XG4gICAgICAgIHZhciB2c2dfZmxleHNsaWRlciA9ICQoJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnknKS5kYXRhKCdmbGV4c2xpZGVyJylcbiAgICAgICAgaWYgKHZzZ19mbGV4c2xpZGVyKXtcbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSB2c2dfZmxleHNsaWRlci5zbGlkZXNcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2xpZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdnNnX2ZsZXhzbGlkZXIucmVtb3ZlU2xpZGUoc2xpZGVzW2pdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB2YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZWxlbWVudCA9IHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlc1trXTtcbiAgICAgICAgICAgICAgICB2c2dfZmxleHNsaWRlci5hZGRTbGlkZShuZWxlbWVudCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgJCgnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZzZy1sb2FkZWQpJykub24oJ2ZvdW5kX3ZhcmlhdGlvbi52c2cnLCBmdW5jdGlvbihlLCB2YXJpYXRpb24pIHtcbiAgICAgICAgdmFyIHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcyA9IHZhcmlhdGlvbi52YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXNcbiAgICAgICAgdnNnX3VwZGF0ZV9mbGV4c2xpZGVyKHZhcmlhdGlvbl9nYWxsZXJ5X2ltYWdlcylcbiAgICB9KVxuICAgICQoJy52YXJpYXRpb25zX2Zvcm06bm90KC52c2ctbG9hZGVkKScpLm9uKCdyZXNldF9kYXRhLnZzZycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGdhbGxlcnlfaW1hZ2VzID0gX1ZTRy5nYWxsZXJ5X2ltYWdlc1xuICAgICAgICB2c2dfdXBkYXRlX2ZsZXhzbGlkZXIoZ2FsbGVyeV9pbWFnZXMpXG4gICAgfSk7XG59KShqUXVlcnkpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6WyIkIiwid2luZG93IiwiZG9jdW1lbnQiLCJ1bmRlZmluZWQiLCJWU0ciLCJlbGVtZW50Iiwib3B0aW9ucyIsInNldHRpbmdzIiwiZXh0ZW5kIiwiJGVsZW1lbnQiLCJhZGRDbGFzcyIsInByb2R1Y3RfdmFyaWF0aW9ucyIsImRhdGEiLCJpc19hamF4X3ZhcmlhdGlvbiIsImxlbmd0aCIsImF0dHJpYnV0ZUZpZWxkcyIsImZpbmQiLCJpbml0IiwidXBkYXRlIiwidG9vbHRpcCIsInByb3RvdHlwZSIsImVhY2giLCJpIiwiZWwiLCJzZWxlY3QiLCJzaWJsaW5ncyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwidmFsdWUiLCJfVlNHIiwib3B0aW9uIiwiYWR2YW5jZWQiLCJjbGVhcl9vbl9yZXNlbGVjdCIsInZhbCIsInRyaWdnZXIiLCJwbHVnaW4iLCJldmVudCIsInN3YXRjaFNldHVwIiwic3RvY2tDb3VudCIsInNlbGVjdGVkQXR0cmlidXRlIiwib3B0aW9uc19zZWxlY3RlZCIsInNlbGVjdHMiLCJkaXNhYmxlZF9zZWxlY3RzIiwicHVzaCIsIm9wdGlvbnNfZGlzYWJsZWQiLCJpbl9zdG9ja3MiLCJfIiwiZGlmZmVyZW5jZSIsImluZGV4IiwiYXR0cmlidXRlX3ZhbHVlIiwiYXR0ciIsInJlbW92ZUNsYXNzIiwiaW5jbHVkZXMiLCJzZWxlY3RlZF9hdHRyaWJ1dGUiLCJzZWxlY3RlZF9hdHRyaWJ1dGVfdmFsdWVzIiwic2VsZWN0ZWRfYXR0cmlidXRlX25hbWVzIiwicGFyZW50IiwiYXR0cmlidXRlX25hbWUiLCJzdG9ja19xdWFudGl0eSIsImF0dHJpYnV0ZXMiLCJnZXRfc3RvY2tfcXVhbnRpdHkiLCJjaGVja2VtcHR5a2V5IiwiaiIsImhhc1ZhbHVlIiwiT2JqZWN0IiwidmFsdWVzIiwidGV4dCIsInNpbmdsZSIsInNlbGVjdGVkX3ZhcmlhdGlvbl9hdHRyaWJ1dGVfbGFiZWwiLCJoYXNDbGFzcyIsInRpdGxlIiwicGFyZW50cyIsImFwcGVuZCIsImxhYmVsX3NlcGFyYXRvciIsInJlbW92ZSIsIm1vdXNlb3ZlciIsImZhZGVJbiIsIm1vdXNlbGVhdmUiLCJmYWRlT3V0IiwiZW1wdHkiLCJlbnRyaWVzIiwia2V5IiwiZm4iLCJqUXVlcnkiLCJ2c2dfdXBkYXRlX2ZsZXhzbGlkZXIiLCJ2YXJpYXRpb25fZ2FsbGVyeV9pbWFnZXMiLCJ2c2dfZmxleHNsaWRlciIsInNsaWRlcyIsInJlbW92ZVNsaWRlIiwiayIsIm5lbGVtZW50IiwiYWRkU2xpZGUiLCJ2YXJpYXRpb24iLCJnYWxsZXJ5X2ltYWdlcyJdLCJzb3VyY2VSb290IjoiIn0=