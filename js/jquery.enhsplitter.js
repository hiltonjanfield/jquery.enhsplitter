/*!
 * jQuery Enhanced Splitter Plugin
 * Main ECMAScript File
 * Version 1.0.0
 *
 * https://github.com/hiltonjanfield/jquery.enhsplitter
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function ($, undefined) {
    var splitterCount = 0;
    var handleId = null;
    var splitters = [];
    var currentSplitter = null;
    var splitterSize = 0;
    var splitterHalf = 0;

    $.fn.enhsplitter = function (options) {
        var data = this.data('splitter');
        if (data) {
            return data;
        }
        var settings = $.extend({
            limit: 100,
            orientation: 'vertical',
            position: '50%',
            invisible: false,
            handle: 'default',
            height: null,
            onDragStart: $.noop,
            onDragEnd: $.noop,
            onDrag: $.noop
        }, options || {});

        // Wrap the existing child elements in invisible panels. These prevent unknown CSS from messing with the
        // positioning code - padding, borders, etc. easily break the splitter.
        var panelOne = $('<div class="splitter_panel"/>')
            .append(this.children().first().detach())
            .prependTo(this);
        var panelTwo = $('<div class="splitter_panel"/>')
            .append(panelOne.next().detach())
            .insertAfter(panelOne);

        if (settings.orientation == 'horizontal') {
            this.addClass('splitter_container splitter-horizontal');
        } else {
            this.addClass('splitter_container splitter-vertical');
        }

        var id = splitterCount++;
        var width = this.width();
        var height = this.height();

        // Check for an empty container height (happens when height on the parent has not been set), and fix.
        if (!settings.height && height == 0) {
            settings.height = '10em';
        }

        if (settings.height) {
            if (typeof settings.height === 'integer') {
                settings.height += 'px';
            }
            this.css('height', settings.height);
            height = this.height();
        }

        if (settings.limit < 0) {
            settings.limit = 0;
        }
        if (settings.limit > this.width()) {
            settings.limit = this.width();
        }

        var splitter = $('<div class="splitter splitter-handle-' + settings.handle + '"/>')
            .insertAfter(panelOne);
        var handle = $('<div class="splitter_handle"/>')
            .appendTo(splitter);

        if (settings.invisible) {
            splitter.addClass('splitter-invisible');
        }

        var position;

        function get_position(position) {
            if (typeof position === 'number') {
                return position;
            } else if (typeof position === 'string') {
                var match = position.match(/^([0-9\.]+)(px|%)?$/);
                if (match) {
                    if (match[2] && match[2] == '%') {
                        if (+match[1] > 100) {
                            match[1] = 100;
                        }
                        if (settings.orientation == 'horizontal') {
                            return (height * +match[1]) / 100;
                        } else {
                            return (width * +match[1]) / 100;
                        }
                    } else {
                        if (settings.orientation == 'horizontal') {
                            if (+match[1] > this.height()) {
                                match[1] = this.height();
                            }
                        } else {
                            if (+match[1] > this.width()) {
                                match[1] = this.width();
                            }
                        }
                        return +match[1]; // assume pixels for ANY suffix except '%', or lack thereof.
                    }
                } else {
                    //throw position + ' is invalid value';
                }
            } else {
                //throw 'position have invalid type';
            }
        }

        var self = $.extend(this, {
            refresh: function () {
                var newWidth = this.width();
                var newHeight = this.height();
                if (width != newWidth || height != newHeight) {
                    width = this.width();
                    height = this.height();
                    self.position(position);
                }
            },

            position: (function () {
                if (settings.orientation == 'horizontal') {
                    return function (n, silent) {
                        if (n === undefined) {
                            return position;
                        } else {
                            position = get_position(n);
                            splitterSize = splitter.outerHeight();
                            splitterHalf = splitterSize / 2;
                            if (settings.invisible) {
                                var panelOneHeight = panelOne.outerHeight(position).outerHeight();
                                panelTwo.outerHeight(self.height() - panelOneHeight);
                                splitter.css('top', panelOneHeight - splitterHalf);
                            } else {
                                var panelOneHeight = panelOne.outerHeight(position - splitterHalf).outerHeight();
                                panelTwo.outerHeight(self.height() - panelOneHeight - splitterSize);
                                splitter.css('top', panelOneHeight);
                            }
                        }
                        if (!silent) {
                            self.find('.splitter_container').trigger('splitter.resize');
                        }
                        return self;
                    };
                } else {
                    return function (n, silent) {
                        if (n === undefined) {
                            return position;
                        } else {
                            position = get_position(n);
                            splitterSize = splitter.outerWidth();
                            splitterHalf = splitterSize / 2;
                            if (settings.invisible) {
                                var panelOneWidth = panelOne.outerWidth(position).outerWidth();
                                panelTwo.outerWidth(self.width() - panelOneWidth);
                                splitter.css('left', panelOneWidth - splitterHalf);
                            } else {
                                var panelOneWidth = panelOne.outerWidth(position - splitterHalf).outerWidth();
                                panelTwo.outerWidth(self.width() - panelOneWidth - splitterSize);
                                splitter.css('left', panelOneWidth);
                            }
                        }
                        if (!silent) {
                            self.find('.splitter_container').trigger('splitter.resize');
                        }
                        return self;
                    };
                }
            })(),
            orientation: settings.orientation,
            limit: settings.limit,
            isActive: function () {
                return $(this).hasClass('splitter-active');
            },
            destroy: function () {
                self.removeClass('splitter_container');
                panelOne.removeClass('splitter_panel');
                panelTwo.removeClass('splitter_panel');
                self.unbind('splitter.resize');
                self.find('.splitter_container').trigger('splitter.resize');
                splitters.splice(id, 1);
                splitterCount--;
                splitter.remove();
                var not_null = false;
                for (var i = splitters.length; i--;) {
                    if (splitters[i] !== null) {
                        not_null = true;
                        break;
                    }
                }
                //remove document events when no splitters
                if (!not_null) {
                    $(document.documentElement).off('.splitter');
                    $(window).off('.splitter');
                    self.data('splitter', null);
                    splitters = [];
                    splitterCount = 0;
                }
            }
        });

        self.bind('splitter.resize', function (e) {
            var pos = self.position();
            if (self.orientation == 'horizontal') {
                if (pos > self.height() - limit - splitterHalf) {
                    pos = self.height() - self.limit - 1;
                }
            } else {
                if (pos > self.width() - limit - splitterHalf) {
                    pos = self.width() - self.limit - 1;
                }
            }

            if (pos < self.limit) {
                pos = self.limit + 1;
            }

            self.position(pos, true);
        });

        //initial position of splitter
        var pos = get_position(settings.position);

        if (settings.orientation == 'horizontal') {
            if (pos >= height - settings.limit - splitterHalf) {
                pos = height - settings.limit - splitterHalf;
                //splitter.addClass('splitter-closed-bottom');
            } else if (pos <= settings.limit) {
                pos = settings.limit;
                //splitter.addClass('splitter-closed-top');
            }
        } else {
            if (pos >= width - settings.limit - splitterHalf) {
                pos = width - settings.limit - splitterHalf;
                //splitter.addClass('splitter-closed-right');
            } else if (pos <= settings.limit) {
                pos = settings.limit;
                //splitter.addClass('splitter-closed-left');
            }
        }

        self.position(pos, true);

        if (splitters.length == 0) { // first time bind events to document
            $(window).on('resize.splitter', function () {
                $.each(splitters, function (i, splitter) {
                    splitter.refresh();
                });
            });

            $(document.documentElement)
                .on('click.splitter', '.splitter_handle', function (e) {
                    currentSplitter = $(this).closest('.splitter_container').data('splitter');
                    if (currentSplitter.data('position')) {
                        var newPos = currentSplitter.data('position');
                        currentSplitter.data('position', null);

                    } else {
                        currentSplitter.data('position', currentSplitter.position());
                        var newPos = currentSplitter.limit + 1;
                    }

                    currentSplitter.position(newPos);
                    currentSplitter.find('.splitter_panel').trigger('resize.splitter');
                    e.preventDefault();
                    $('.splitter_mask').remove();
                    currentSplitter.settings.onDrag(e);
                    currentSplitter.removeClass('splitter-active');
                    currentSplitter = null;
                })

                .on('mousedown.splitter touchstart.splitter', '.splitter_container > .splitter', function (e) {
                    e.preventDefault();
                    currentSplitter = $(this).closest('.splitter_container').data('splitter');
                    currentSplitter.addClass('splitter-active');
                    $('<div class="splitter_mask"></div>').css('cursor', currentSplitter.children().eq(1).css('cursor')).insertAfter(currentSplitter);
                    currentSplitter.settings.onDragStart(e);
                })

                // Todo: Explore and test the touch events.
                .on('mouseup.splitter touchend.splitter touchleave.splitter touchcancel.splitter', '.splitter_mask, .splitter_container > .splitter', function (e) {
                    if (currentSplitter) {
                        e.preventDefault();
                        if (currentSplitter.position() == (currentSplitter.limit + 1)) {
                            currentSplitter.data('position', currentSplitter.settings.position);
                        }
                        $('.splitter_mask').remove();
                        currentSplitter.settings.onDragEnd(e);
                        currentSplitter.removeClass('splitter-active');
                        currentSplitter = null;
                    }
                })

                .on('mousemove.splitter touchmove.splitter', '.splitter_mask, .splitter', function (e) {
                    if (currentSplitter !== null) {
                        var limit = currentSplitter.limit;
                        var offset = currentSplitter.offset();
                        currentSplitter.data('position', null);

                        if (currentSplitter.orientation == 'horizontal') {
                            var pageY = e.pageY;
                            if (e.originalEvent && e.originalEvent.changedTouches) {
                                pageY = e.originalEvent.changedTouches[0].pageY;
                            }
                            var y = pageY - offset.top - splitterHalf;
                            if (y <= currentSplitter.limit) {
                                y = currentSplitter.limit + 1;
                            } else if (y >= currentSplitter.height() - limit - splitterHalf) {
                                y = currentSplitter.height() - limit - splitterHalf;
                            }
                            if (y > currentSplitter.limit &&
                                y < currentSplitter.height() - limit) {
                                currentSplitter.position(y, true);
                                //currentSplitter.find('.splitter_container').trigger('splitter.resize');
                                e.preventDefault();
                            }
                        } else {
                            var pageX = e.pageX;
                            if (e.originalEvent && e.originalEvent.changedTouches) {
                                pageX = e.originalEvent.changedTouches[0].pageX;
                            }
                            var x = pageX - offset.left - splitterHalf;
                            if (x <= currentSplitter.limit) {
                                x = currentSplitter.limit + 1;
                            } else if (x >= currentSplitter.width() - limit - splitterHalf) {
                                x = currentSplitter.width() - limit - splitterHalf;
                            }
                            if (x > currentSplitter.limit &&
                                x < currentSplitter.width() - limit) {
                                currentSplitter.position(x, true);
                                //currentSplitter.find('.splitter_container').trigger('splitter.resize');
                                e.preventDefault();
                            }
                        }
                        currentSplitter.settings.onDrag(e);
                    }
                });
        }
        splitters.push(self);
        self.settings = settings;
        self.data('splitter', self);
        return self;
    };
})(jQuery);
