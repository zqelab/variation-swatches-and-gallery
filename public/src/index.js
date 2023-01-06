(function($, window, document, undefined) {
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
        init: function() {
            this.$element.find('ul.vsg-swatch-items-wrapper').each(function(i, el) {
                let select = $(this).siblings('select.vsg-raw-select');
                $(this).on('click.vs', 'li.vsg-swatch-item', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let value = $(this).data('value');
                    if (_VSG.option.advanced.clear_on_reselect && select.val() && select.val() === value) {
                        select.val('');
                    } else {
                        select.val(value);
                    }
                    select.trigger('change');
                    select.trigger('click');
                    select.trigger('focusin');
                });
            })
        },
        update: function() {
            var plugin = this
            this.$element.on('woocommerce_variation_has_changed.vs', function(event) {
                plugin.swatchSetup();
                plugin.stockCount();
                plugin.selectedAttribute();
            })
        },
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
        tooltip: function() {
            this.$element.find('li.vsg-swatch-item').each(function(index, el) {
                $(this).mouseover(function() {
                    $(this).find('.vsg-swatch-item-tooltip').fadeIn();
                })
                $(this).mouseleave(function() {
                    $(this).find('.vsg-swatch-item-tooltip').fadeOut();
                })
            })
        },
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
    $.fn['VSG'] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'VSG')) {
                $.data(this, 'VSG', new VSG(this, options));
            }
        });
    };
})(jQuery, window, document);
(function($) {
    $(document).on('wc_variation_form.vs', '.variations_form:not(.vsg-loaded)', function(event) {
        $(this).VSG();
    });

    function vsg_update_flexslider(variation_gallery_images) {
        var vsg_flexslider = $('.woocommerce-product-gallery').data('flexslider')
        if (vsg_flexslider){
            var slides = vsg_flexslider.slides
            for (let j = 0; j < slides.length; j++) {
                vsg_flexslider.removeSlide(slides[j])
            }
            for (let k = 0; k < variation_gallery_images.length; k++) {
                const nelement = variation_gallery_images[k];
                vsg_flexslider.addSlide(nelement, 0);
            }
        }
    }
    $('.variations_form:not(.vsg-loaded)').on('found_variation.vsg', function(e, variation) {
        var variation_gallery_images = variation.variation_gallery_images
        vsg_update_flexslider(variation_gallery_images)
    })
    $('.variations_form:not(.vsg-loaded)').on('reset_data.vsg', function(e) {
        var gallery_images = _VSG.gallery_images
        vsg_update_flexslider(gallery_images)
    });
})(jQuery);