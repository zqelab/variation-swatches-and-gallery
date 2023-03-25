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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4vanMvdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5LWFkbWluLmpzIiwibWFwcGluZ3MiOiI7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLENBQUMsVUFBU0EsQ0FBQyxFQUFFO0VBQUEsSUFDTkMsUUFBUTtJQUNiLFNBQUFBLFNBQUEsRUFBYztNQUFBQyxlQUFBLE9BQUFELFFBQUE7TUFDYixJQUFJLENBQUNFLElBQUksRUFBRTtJQUNaO0lBQUNDLFlBQUEsQ0FBQUgsUUFBQTtNQUFBSSxHQUFBO01BQUFDLEtBQUEsRUFDRCxTQUFBSCxLQUFBLEVBQU87UUFDTkgsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUNPLElBQUksQ0FBQyxZQUFXO1VBQzNDLElBQUlDLGVBQWUsR0FBR1IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDUyxJQUFJLENBQUMseUVBQXlFLENBQUM7VUFDN0dULENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ1MsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUNDLE1BQU0sQ0FBQ0YsZUFBZSxDQUFDO1FBQzlFLENBQUMsQ0FBQztRQUNGUixDQUFDLENBQUNXLFFBQVEsQ0FBQyxDQUFDQyxFQUFFLENBQUMsT0FBTyxFQUFFLHNEQUFzRCxFQUFFLFVBQVNDLEtBQUssRUFBRTtVQUMvRixJQUFJQyxNQUFNLEdBQUcsSUFBSTtVQUNqQkQsS0FBSyxDQUFDRSxjQUFjLEVBQUU7VUFDdEJGLEtBQUssQ0FBQ0csZUFBZSxFQUFFO1VBQ3ZCaEIsQ0FBQyxDQUFDYyxNQUFNLENBQUMsQ0FBQ0csTUFBTSxFQUFFLENBQUNDLE1BQU0sRUFBRTtVQUMzQmxCLENBQUMsQ0FBQ2MsTUFBTSxDQUFDLENBQUNLLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDQyxRQUFRLENBQUMsd0JBQXdCLENBQUM7VUFDOUVwQixDQUFDLENB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QTtFQUFBO0VBRUZELENBQUMsQ0FBQ1csUUFBUSxDQUFDLENBQUNzQyxLQUFLLENBQUMsVUFBU2pELENBQUMsRUFBRTtJQUM3QkEsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUNZLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFXO01BQzdFLElBQUlYLFFBQVEsRUFBRTtJQUNmLENBQUMsQ0FBQztJQUNGRCxDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FBQ1ksRUFBRSxDQUFDLDhCQUE4QixFQUFFLFlBQVc7TUFDNUUsSUFBSVgsUUFBUSxFQUFFO0lBQ2YsQ0FBQyxDQUFDO0VBQ0gsQ0FBQyxDQUFDO0FBQ0gsQ0FBQyxFQUFFaUQsTUFBTSxDQUFDLEM7Ozs7Ozs7Ozs7QUN4RVYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5Ly4vYWRtaW4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL3ZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS8uL2FkbWluL3NyYy9zdHlsZXMvaW5kZXguc2Nzcz84NGMyIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIoZnVuY3Rpb24oJCkge1xuXHRjbGFzcyBWU0dBZG1pbiB7XG5cdFx0Y29uc3RydWN0b3IoKSB7XG5cdFx0XHR0aGlzLmluaXQoKVxuXHRcdH1cblx0XHRpbml0KCkge1xuXHRcdFx0JCgnLndvb2NvbW1lcmNlX3ZhcmlhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxldCBnYWxsZXJ5X3dyYXBwZXIgPSAkKHRoaXMpLmZpbmQoJy5mb3JtLXJvdy5mb3JtLXJvdy1mdWxsLnZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS0tZ2FsbGVyeS13cmFwcGVyJylcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuZm9ybS1yb3cuZm9ybS1yb3ctZmlyc3QudXBsb2FkX2ltYWdlJykuYXBwZW5kKGdhbGxlcnlfd3JhcHBlcilcblx0XHRcdH0pXG5cdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnZhcmlhdGlvbi1zd2F0Y2hlcy1hbmQtZ2FsbGVyeS0tcmVtb3ZlLWdhbGVyeS1pbWFnZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGxldCBidXR0b24gPSB0aGlzO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0JChidXR0b24pLnBhcmVudCgpLnJlbW92ZSgpO1xuXHRcdFx0XHQkKGJ1dHRvbikuY2xvc2VzdCgnLndvb2NvbW1lcmNlX3ZhcmlhdGlvbicpLmFkZENsYXNzKCd2YXJpYXRpb24tbmVlZHMtdXBkYXRlJyk7XG5cdFx0XHRcdCQoJ2J1dHRvbi5jYW5jZWwtdmFyaWF0aW9uLWNoYW5nZXMsIGJ1dHRvbi5zYXZlLXZhcmlhdGlvbi1jaGFuZ2VzJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHR9KVxuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy52YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnktLWFkZC1nYWxlcnktaW1hZ2UnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRsZXQgYnV0dG9uID0gdGhpcztcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGxldCBmcmFtZTtcblx0XHRcdFx0bGV0IHByb2R1Y3RfdmFyaWF0aW9uX2lkID0gJCh0aGlzKS5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbl9pZCcpO1xuXHRcdFx0XHRsZXQgbG9vcCA9ICQodGhpcykuZGF0YSgncHJvZHVjdF92YXJpYXRpb25fbG9vcCcpO1xuXHRcdFx0XHRpZiAodHlwZW9mIHdwICE9PSAndW5kZWZpbmVkJyAmJiB3cC5tZWRpYSAmJiB3cC5tZWRpYS5lZGl0b3IpIHtcblx0XHRcdFx0XHRpZiAoZnJhbWUpIHtcblx0XHRcdFx0XHRcdGZyYW1lLm9wZW4oKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZnJhbWUgPSB3cC5tZWRpYSh7XG5cdFx0XHRcdFx0XHRsaWJyYXJ5OiB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFsndmlkZW8nLCAnaW1hZ2UnXVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG11bHRpcGxlOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0ZnJhbWUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0bGV0IGltYWdlcyA9IGZyYW1lLnN0YXRlKCkuZ2V0KCdzZWxlY3Rpb24nKS50b0pTT04oKTtcblx0XHRcdFx0XHRcdGxldCBodG1sID0gaW1hZ2VzLm1hcChmdW5jdGlvbihpbWFnZSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoaW1hZ2UudHlwZSA9PT0gJ2ltYWdlJykge1xuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGltYWdlLmlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0X2ltYWdlJHNpemVzID0gaW1hZ2Uuc2l6ZXM7XG5cdFx0XHRcdFx0XHRcdFx0X2ltYWdlJHNpemVzID0gX2ltYWdlJHNpemVzID09PSB2b2lkIDAgPyB7fSA6IF9pbWFnZSRzaXplcztcblx0XHRcdFx0XHRcdFx0XHRsZXQgdGh1bWJuYWlsID0gX2ltYWdlJHNpemVzLnRodW1ibmFpbCxcblx0XHRcdFx0XHRcdFx0XHRcdGZ1bGwgPSBfaW1hZ2Ukc2l6ZXMuZnVsbDtcblx0XHRcdFx0XHRcdFx0XHRsZXQgdXJsID0gdGh1bWJuYWlsID8gdGh1bWJuYWlsLnVybCA6IGZ1bGwudXJsO1xuXHRcdFx0XHRcdFx0XHRcdGxldCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCd2YXJpYXRpb24tc3dhdGNoZXMtYW5kLWdhbGxlcnktLWdhbGxlcnktaW1hZ2UnKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGVtcGxhdGUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X3ZhcmlhdGlvbl9pZDogcHJvZHVjdF92YXJpYXRpb25faWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRsb29wOiBsb29wXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pLmpvaW4oJycpO1xuXHRcdFx0XHRcdFx0JChidXR0b24pLnBhcmVudCgpLnByZXYoKS5maW5kKCcudmFyaWF0aW9uLXN3YXRjaGVzLWFuZC1nYWxsZXJ5LS1nYWxsZXJ5LWltYWdlcycpLmFwcGVuZChodG1sKTtcblx0XHRcdFx0XHRcdCQoYnV0dG9uKS5jbG9zZXN0KCcud29vY29tbWVyY2VfdmFyaWF0aW9uJykuYWRkQ2xhc3MoJ3ZhcmlhdGlvbi1uZWVkcy11cGRhdGUnKTtcblx0XHRcdFx0XHRcdCQoJ2J1dHRvbi5jYW5jZWwtdmFyaWF0aW9uLWNoYW5nZXMsIGJ1dHRvbi5zYXZlLXZhcmlhdGlvbi1jaGFuZ2VzJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0ZnJhbWUub3BlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oJCkge1xuXHRcdCQoJyN3b29jb21tZXJjZS1wcm9kdWN0LWRhdGEnKS5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uc19sb2FkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdG5ldyBWU0dBZG1pbigpO1xuXHRcdH0pO1xuXHRcdCQoJyN2YXJpYWJsZV9wcm9kdWN0X29wdGlvbnMnKS5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uc19hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bmV3IFZTR0FkbWluKCk7XG5cdFx0fSk7XG5cdH0pO1xufSkoalF1ZXJ5KTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOlsiJCIsIlZTR0FkbWluIiwiX2NsYXNzQ2FsbENoZWNrIiwiaW5pdCIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiZWFjaCIsImdhbGxlcnlfd3JhcHBlciIsImZpbmQiLCJhcHBlbmQiLCJkb2N1bWVudCIsIm9uIiwiZXZlbnQiLCJidXR0b24iLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInBhcmVudCIsInJlbW92ZSIsImNsb3Nlc3QiLCJhZGRDbGFzcyIsInByb3AiLCJmcmFtZSIsInByb2R1Y3RfdmFyaWF0aW9uX2lkIiwiZGF0YSIsImxvb3AiLCJ3cCIsIm1lZGlhIiwiZWRpdG9yIiwib3BlbiIsImxpYnJhcnkiLCJ0eXBlIiwibXVsdGlwbGUiLCJpbWFnZXMiLCJzdGF0ZSIsImdldCIsInRvSlNPTiIsImh0bWwiLCJtYXAiLCJpbWFnZSIsImlkIiwiX2ltYWdlJHNpemVzIiwic2l6ZXMiLCJ0aHVtYm5haWwiLCJmdWxsIiwidXJsIiwidGVtcGxhdGUiLCJqb2luIiwicHJldiIsInJlYWR5IiwialF1ZXJ5Il0sInNvdXJjZVJvb3QiOiIifQ==