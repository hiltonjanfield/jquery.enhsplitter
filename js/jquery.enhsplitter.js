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
    var splitterId = null;
    var handleId = null;
    var splitters = [];
    var currentSplitter = null;
    var splitterSize = 6;
    var splitterHalf = 3;

    $.fn.enhsplitter = function (options) {
        var data = this.data('splitter');
        if (data) {
            return data;
        }
        var panelOne;
        var panelTwo;
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
        this.settings = settings;
        var className;

        panelOne = $('<div class="splitter_panel"/>');
        panelOne.append(this.children().first().detach()).prependTo(this);

        panelTwo = $('<div class="splitter_panel"/>');
        panelTwo.append(panelOne.next().detach()).insertAfter(panelOne);

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
        }

        var splitter = $('<div class="splitter splitter-handle-' + settings.handle + '"/>')
            .bind('mouseenter touchstart', function () {
                splitterId = id;
            })
            .bind('mouseleave touchend', function () {
                splitterId = null;
            })
            .insertAfter(panelOne);

        if (settings.invisible) {
            splitter.addClass('splitter-invisible');
        }

        var handle = $('<div class="splitter_handle"/>')
            .bind('mouseenter touchstart', function() {
                handleId = splitterId;
                splitterId = null;
            })
            .bind('mouseleave touchend', function() {
                splitterId = handleId;
                handleId = null;
            })
            .appendTo(splitter);
        var position;

        function get_position(position) {
            if (typeof position === 'number') {
                return position;
            } else if (typeof position === 'string') {
                var match = position.match(/^([0-9\.]+)(px|%)?$/);
                if (match) {
                    if (match[2] && match[2] == '%') {
                        if (settings.orientation == 'horizontal') {
                            return (height * +match[1]) / 100;
                        } else {
                            return (width * +match[1]) / 100;
                        }
                    } else {
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
                return splitterId === id;
            },
            destroy: function () {
                self.removeClass('splitter_panel');
                splitter.unbind('mouseenter');
                splitter.unbind('mouseleave');
                splitter.unbind('touchstart');
                splitter.unbind('touchmove');
                splitter.unbind('touchend');
                splitter.unbind('touchleave');
                splitter.unbind('touchcancel');
                handle.unbind('mouseup');
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
                    $(document.documentElement).unbind('.splitter');
                    $(window).unbind('resize.splitter');
                    self.data('splitter', null);
                    splitters = [];
                    splitterCount = 0;
                }
            }
        });

        self.bind('splitter.resize', function (e) {
            var pos = self.position();
            if (self.orientation == 'vertical' &&
                pos > self.width()) {
                pos = self.width() - self.limit - 1;
            } else if (self.orientation == 'horizontal' &&
                pos > self.height()) {
                pos = self.height() - self.limit - 1;
            }
            if (pos < self.limit) {
                pos = self.limit + 1;
            }
            self.position(pos, true);
        });

        //initial position of splitter
        var pos;
        if (settings.orientation == 'horizontal') {
            if (pos > height - settings.limit) {
                pos = height - settings.limit;
            } else {
                pos = get_position(settings.position);
            }
        } else {
            if (pos > width - settings.limit) {
                pos = width - settings.limit;
            } else {
                pos = get_position(settings.position);
            }
        }
        if (pos < settings.limit) {
            pos = settings.limit;
        }
        self.position(pos, true);
        if (splitters.length == 0) { // first time bind events to document
            $(window).bind('resize.splitter', function () {
                $.each(splitters, function (i, splitter) {
                    splitter.refresh();
                });
            });

            $(document.documentElement)
                .bind('mouseup.splitter_handle', function (e) {
                    if (handleId !== null) {
                        currentSplitter = splitters[handleId];
                        if (currentSplitter.data('position')) {
                            var newPos = currentSplitter.data('position');
                            currentSplitter.data('position', null);
                        } else {
                            if (currentSplitter.orientation == 'horizontal') {
                                var pageY = e.pageY;
                                var offset = currentSplitter.offset();
                                if (e.originalEvent && e.originalEvent.changedTouches) {
                                    pageY = e.originalEvent.changedTouches[0].pageY;
                                }
                                var y = pageY - offset.left;
                                currentSplitter.data('position', y);

                            } else {
                                var pageX = e.pageX;
                                var offset = currentSplitter.offset();
                                if (e.originalEvent && e.originalEvent.changedTouches) {
                                    pageX = e.originalEvent.changedTouches[0].pageX;
                                }
                                var x = pageX - offset.left;
                                currentSplitter.data('position', x);
                            }
                            var newPos = currentSplitter.limit + 1;
                        }

                        currentSplitter.position(newPos, true);
                        //currentSplitter.find('.splitter_panel').trigger('resize.splitter');
                        e.preventDefault();
                        currentSplitter.settings.onDrag(e);
                    }
                })

                .bind('mousedown.splitter touchstart.splitter', function (e) {
                    if (splitterId !== null) {
                        currentSplitter = splitters[splitterId];
                        currentSplitter.addClass('splitter-active');
                        $('<div class="splitterMask"></div>').css('cursor', currentSplitter.children().eq(1).css('cursor')).insertAfter(currentSplitter);
                        currentSplitter.settings.onDragStart(e);
                        return false;
                    }
                })

                .bind('mouseup.splitter touchend.splitter touchleave.splitter touchcancel.splitter', function (e) {
                    if (currentSplitter) {
                        $('.splitterMask').remove();
                        currentSplitter.removeClass('splitter-active');
                        currentSplitter.settings.onDragEnd(e);
                        currentSplitter = null;
                    }
                })

                .bind('mousemove.splitter touchmove.splitter', function (e) {
                    if (currentSplitter !== null) {
                        var limit = currentSplitter.limit;
                        var offset = currentSplitter.offset();
                        if (currentSplitter.orientation == 'horizontal') {
                            var pageY = e.pageY;
                            if (e.originalEvent && e.originalEvent.changedTouches) {
                                pageY = e.originalEvent.changedTouches[0].pageY;
                            }
                            var y = pageY - offset.top - splitterHalf;
                            if (y <= currentSplitter.limit) {
                                y = currentSplitter.limit + 1;
                            } else if (y >= currentSplitter.height() - limit) {
                                y = currentSplitter.height() - limit - 1;
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
                            } else if (x >= currentSplitter.width() - limit) {
                                x = currentSplitter.width() - limit - 1;
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
        self.data('splitter', self);
        return self;
    };
})(jQuery);
