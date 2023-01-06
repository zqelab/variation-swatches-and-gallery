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
/*!****************************!*\
  !*** ./admin/src/index.js ***!
  \****************************/
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(function ($) {
  var VSGAdmin = /*#__PURE__*/function () {
    function VSGAdmin() {
      _classCallCheck(this, VSGAdmin);
      this.init();
    }
    _createClass(VSGAdmin, [{
      key: "init",
      value: function init() {
        $('.woocommerce_variation').each(function () {
          var gallery_wrapper = $(this).find('.form-row.form-row-full.variation-swatches-and-gallery--gallery-wrapper');
          $(this).find('.form-row.form-row-first.upload_image').append(gallery_wrapper);
        });
        $(document).on('click', '.variation-swatches-and-gallery--remove-galery-image', function (event) {
          var button = this;
          event.preventDefault();
          event.stopPropagation();
          $(button).parent().remove();
          $(button).closest('.woocommerce_variation').addClass('variation-needs-update');
          $('button.cancel-variation-changes, button.save-variation-changes').prop('disabled', false);
        });
        $(document).on('click', '.variation-swatches-and-gallery--add-galery-image', function (event) {
          var button = this;
          event.preventDefault();
          event.stopPropagation();
          var frame;
          var product_variation_id = $(this).data('product_variation_id');
          var loop = $(this).data('product_variation_loop');
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
            frame.on('select', function () {
              var images = frame.state().get('selection').toJSON();
              var html = images.map(function (image) {
                if (image.type === 'image') {
                  var id = image.id,
                    _image$sizes = image.sizes;
                  _image$sizes = _image$sizes === void 0 ? {} : _image$sizes;
                  var thumbnail = _image$sizes.thumbnail,
                    full = _image$sizes.full;
                  var url = thumbnail ? thumbnail.url : full.url;
                  var template = wp.template('variation-swatches-and-gallery--gallery-image');
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
    }]);
    return VSGAdmin;
  }();
  $(document).ready(function ($) {
    $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
      new VSGAdmin();
    });
    $('#variable_product_options').on('woocommerce_variations_added', function () {
      new VSGAdmin();
    });
  });
})(jQuery);
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************************!*\
  !*** ./admin/src/styles/index.scss ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4vanMvdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5LWFkbWluLmpzIiwibWFwcGluZ3MiOiI7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLENBQUMsVUFBU0EsQ0FBQyxFQUFFO0VBQUEsSUFDTkMsUUFBUTtJQUNiLG9CQUFjO01BQUE7TUFDYixJQUFJLENBQUNDLElBQUksRUFBRTtJQUNaO0lBQUM7TUFBQTtNQUFBLE9BQ0QsZ0JBQU87UUFDTkYsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUNHLElBQUksQ0FBQyxZQUFXO1VBQzNDLElBQUlDLGVBQWUsR0FBR0osQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSyxJQUFJLENBQUMseUVBQXlFLENBQUM7VUFDN0dMLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0ssSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUNDLE1BQU0sQ0FBQ0YsZUFBZSxDQUFDO1FBQzlFLENBQUMsQ0FBQztRQUNGSixDQUFDLENBQUNPLFFBQVEsQ0FBQyxDQUFDQyxFQUFFLENBQUMsT0FBTyxFQUFFLHNEQUFzRCxFQUFFLFVBQVNDLEtBQUssRUFBRTtVQUMvRixJQUFJQyxNQUFNLEdBQUcsSUFBSTtVQUNqQkQsS0FBSyxDQUFDRSxjQUFjLEVBQUU7VUFDdEJGLEtBQUssQ0FBQ0csZUFBZSxFQUFFO1VBQ3ZCWixDQUFDLENBQUNVLE1BQU0sQ0FBQyxDQUFDRyxNQUFNLEVBQUUsQ0FBQ0MsTUFBTSxFQUFFO1VBQzNCZCxDQUFDLENBQUNVLE1BQU0sQ0FBQyxDQUFDSyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQ0MsUUFBUSxDQUFDLHdCQUF3QixDQUFDO1VBQzlFaEIsQ0FBQyxDQUFDLGdFQUFnRSxDQUFDLENBQUNpQixJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztRQUM1RixDQUFDLENBQUM7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LENBQUMsMkJBQTJCLENBQUMsQ0FBQ1EsRUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQVc7TUFDN0UsSUFBSVAsUUFBUSxFQUFFO0lBQ2YsQ0FBQyxDQUFDO0lBQ0ZELENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDUSxFQUFFLENBQUMsOEJBQThCLEVBQUUsWUFBVztNQUM1RSxJQUFJUCxRQUFRLEVBQUU7SUFDZixDQUFDLENBQUM7RUFDSCxDQUFDLENBQUM7QUFDSCxDQUFDLEVBQUU2QyxNQUFNLENBQUMsQzs7Ozs7Ozs7OztBQ3hFViIsInNvdXJjZXMiOlsid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvLi9hZG1pbi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5Ly4vYWRtaW4vc3JjL3N0eWxlcy9pbmRleC5zY3NzPzg0YzIiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIihmdW5jdGlvbigkKSB7XG5cdGNsYXNzIFZTR0FkbWluIHtcblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdHRoaXMuaW5pdCgpXG5cdFx0fVxuXHRcdGluaXQoKSB7XG5cdFx0XHQkKCcud29vY29tbWVyY2VfdmFyaWF0aW9uJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0bGV0IGdhbGxlcnlfd3JhcHBlciA9ICQodGhpcykuZmluZCgnLmZvcm0tcm93LmZvcm0tcm93LWZ1bGwudmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5LS1nYWxsZXJ5LXdyYXBwZXInKVxuXHRcdFx0XHQkKHRoaXMpLmZpbmQoJy5mb3JtLXJvdy5mb3JtLXJvdy1maXJzdC51cGxvYWRfaW1hZ2UnKS5hcHBlbmQoZ2FsbGVyeV93cmFwcGVyKVxuXHRcdFx0fSlcblx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcudmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5LS1yZW1vdmUtZ2FsZXJ5LWltYWdlJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0bGV0IGJ1dHRvbiA9IHRoaXM7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHQkKGJ1dHRvbikucGFyZW50KCkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoYnV0dG9uKS5jbG9zZXN0KCcud29vY29tbWVyY2VfdmFyaWF0aW9uJykuYWRkQ2xhc3MoJ3ZhcmlhdGlvbi1uZWVkcy11cGRhdGUnKTtcblx0XHRcdFx0JCgnYnV0dG9uLmNhbmNlbC12YXJpYXRpb24tY2hhbmdlcywgYnV0dG9uLnNhdmUtdmFyaWF0aW9uLWNoYW5nZXMnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdH0pXG5cdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS0tYWRkLWdhbGVyeS1pbWFnZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGxldCBidXR0b24gPSB0aGlzO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0bGV0IGZyYW1lO1xuXHRcdFx0XHRsZXQgcHJvZHVjdF92YXJpYXRpb25faWQgPSAkKHRoaXMpLmRhdGEoJ3Byb2R1Y3RfdmFyaWF0aW9uX2lkJyk7XG5cdFx0XHRcdGxldCBsb29wID0gJCh0aGlzKS5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbl9sb29wJyk7XG5cdFx0XHRcdGlmICh0eXBlb2Ygd3AgIT09ICd1bmRlZmluZWQnICYmIHdwLm1lZGlhICYmIHdwLm1lZGlhLmVkaXRvcikge1xuXHRcdFx0XHRcdGlmIChmcmFtZSkge1xuXHRcdFx0XHRcdFx0ZnJhbWUub3BlbigpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmcmFtZSA9IHdwLm1lZGlhKHtcblx0XHRcdFx0XHRcdGxpYnJhcnk6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogWyd2aWRlbycsICdpbWFnZSddXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bXVsdGlwbGU6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRmcmFtZS5vbignc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRsZXQgaW1hZ2VzID0gZnJhbWUuc3RhdGUoKS5nZXQoJ3NlbGVjdGlvbicpLnRvSlNPTigpO1xuXHRcdFx0XHRcdFx0bGV0IGh0bWwgPSBpbWFnZXMubWFwKGZ1bmN0aW9uKGltYWdlKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChpbWFnZS50eXBlID09PSAnaW1hZ2UnKSB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGlkID0gaW1hZ2UuaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRfaW1hZ2Ukc2l6ZXMgPSBpbWFnZS5zaXplcztcblx0XHRcdFx0XHRcdFx0XHRfaW1hZ2Ukc2l6ZXMgPSBfaW1hZ2Ukc2l6ZXMgPT09IHZvaWQgMCA/IHt9IDogX2ltYWdlJHNpemVzO1xuXHRcdFx0XHRcdFx0XHRcdGxldCB0aHVtYm5haWwgPSBfaW1hZ2Ukc2l6ZXMudGh1bWJuYWlsLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnVsbCA9IF9pbWFnZSRzaXplcy5mdWxsO1xuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0aHVtYm5haWwgPyB0aHVtYm5haWwudXJsIDogZnVsbC51cmw7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoJ3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS0tZ2FsbGVyeS1pbWFnZScpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0ZW1wbGF0ZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfdmFyaWF0aW9uX2lkOiBwcm9kdWN0X3ZhcmlhdGlvbl9pZCxcblx0XHRcdFx0XHRcdFx0XHRcdGxvb3A6IGxvb3Bcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSkuam9pbignJyk7XG5cdFx0XHRcdFx0XHQkKGJ1dHRvbikucGFyZW50KCkucHJldigpLmZpbmQoJy52YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnktLWdhbGxlcnktaW1hZ2VzJykuYXBwZW5kKGh0bWwpO1xuXHRcdFx0XHRcdFx0JChidXR0b24pLmNsb3Nlc3QoJy53b29jb21tZXJjZV92YXJpYXRpb24nKS5hZGRDbGFzcygndmFyaWF0aW9uLW5lZWRzLXVwZGF0ZScpO1xuXHRcdFx0XHRcdFx0JCgnYnV0dG9uLmNhbmNlbC12YXJpYXRpb24tY2hhbmdlcywgYnV0dG9uLnNhdmUtdmFyaWF0aW9uLWNoYW5nZXMnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRmcmFtZS5vcGVuKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKSB7XG5cdFx0JCgnI3dvb2NvbW1lcmNlLXByb2R1Y3QtZGF0YScpLm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25zX2xvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bmV3IFZTR0FkbWluKCk7XG5cdFx0fSk7XG5cdFx0JCgnI3ZhcmlhYmxlX3Byb2R1Y3Rfb3B0aW9ucycpLm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25zX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRuZXcgVlNHQWRtaW4oKTtcblx0XHR9KTtcblx0fSk7XG59KShqUXVlcnkpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6WyIkIiwiVlNHQWRtaW4iLCJpbml0IiwiZWFjaCIsImdhbGxlcnlfd3JhcHBlciIsImZpbmQiLCJhcHBlbmQiLCJkb2N1bWVudCIsIm9uIiwiZXZlbnQiLCJidXR0b24iLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInBhcmVudCIsInJlbW92ZSIsImNsb3Nlc3QiLCJhZGRDbGFzcyIsInByb3AiLCJmcmFtZSIsInByb2R1Y3RfdmFyaWF0aW9uX2lkIiwiZGF0YSIsImxvb3AiLCJ3cCIsIm1lZGlhIiwiZWRpdG9yIiwib3BlbiIsImxpYnJhcnkiLCJ0eXBlIiwibXVsdGlwbGUiLCJpbWFnZXMiLCJzdGF0ZSIsImdldCIsInRvSlNPTiIsImh0bWwiLCJtYXAiLCJpbWFnZSIsImlkIiwiX2ltYWdlJHNpemVzIiwic2l6ZXMiLCJ0aHVtYm5haWwiLCJmdWxsIiwidXJsIiwidGVtcGxhdGUiLCJqb2luIiwicHJldiIsInJlYWR5IiwialF1ZXJ5Il0sInNvdXJjZVJvb3QiOiIifQ==