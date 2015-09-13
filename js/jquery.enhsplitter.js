/*!
 * jQuery Enhanced Splitter Plugin
 * Main ECMAScript File
 * Version 1.2.0
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
    var splitters = [];
    var currentSplitter = null; // Reference to current splitter during events.
    var dragStartPosition = null;
    var disableClick = false;

    $.fn.enhsplitter = function (options) {
        var data = this.data('splitter');
        if (data) {
            return data;
        }

        var settings = $.extend({}, $.fn.enhsplitter.defaults, options);

        var id = splitterCount++;
        var self;
        var panelOne;
        var panelTwo;
        var splitter;
        var handle;

        // Wrap the existing child elements in invisible panels. These prevent unknown CSS from messing with the
        // positioning code - padding, borders, etc. easily break the splitter.
        panelOne = $('<div class="splitter_panel"/>')
            .append(this.children().first().detach())
            .prependTo(this);
        panelTwo = $('<div class="splitter_panel"/>')
            .append(panelOne.next().detach())
            .insertAfter(panelOne);

        if (settings.vertical) {
            this.addClass('splitter_container splitter-vertical');
        } else {
            this.addClass('splitter_container splitter-horizontal');
        }

        // Check for an empty container height (happens when height on the parent has not been set), and fix.
        if (!settings.height && this.height() == 0) {
            settings.height = '10em';
        }

        if (settings.height) {
            this.css('height', settings.height);
        }

        var containerSize = settings.vertical ? this.width() : this.height();

        if (settings.minSize) { settings.leftMinSize = settings.rightMinSize = settings.minSize; }
        if (settings.maxSize) { settings.leftMaxSize = settings.rightMaxSize = settings.maxSize; }

        // If left/right not defined, check for top/bottom and use them instead. (if all defined for some reason, left/right get precedence)
        settings.leftMinSize = ((settings.leftMinSize === null) && settings.topMinSize) ? settings.topMinSize : settings.leftMinSize;
        settings.leftMaxSize = ((settings.leftMaxSize === null) && settings.topMaxSize) ? settings.topMaxSize : settings.leftMaxSize;
        settings.rightMinSize = ((settings.rightMinSize === null) && settings.bottomMinSize) ? settings.bottomMinSize : settings.rightMinSize;
        settings.rightMaxSize = ((settings.rightMaxSize === null) && settings.bottomMaxSize) ? settings.bottomMaxSize : settings.rightMaxSize;

        // Verify ranges.
        settings.leftMinSize = (settings.leftMinSize < 0 ? 0 : (settings.leftMinSize > containerSize ? containerSize : settings.leftMinSize));
        settings.leftMaxSize = (settings.leftMaxSize < 0 ? 0 : (settings.leftMaxSize > containerSize ? containerSize : settings.leftMaxSize));
        settings.rightMinSize = (settings.rightMinSize < 0 ? 0 : (settings.rightMinSize > containerSize ? containerSize : settings.rightMinSize));
        settings.rightMaxSize = (settings.rightMaxSize < 0 ? 0 : (settings.rightMaxSize > containerSize ? containerSize : settings.rightMaxSize));

        // Verify minimum sizes.
        var totalSize = settings.leftMinSize + settings.rightMinSize;
        if (totalSize > containerSize) {
            // User has set the left and right minimums too high. Proportionally reduce them.
            settings.leftMinSize = containerSize * (settings.leftMinSize / totalSize);
            settings.rightMinSize = containerSize * (settings.rightMinSize / totalSize);
        }


        settings.collapseNormal = !(settings.collapse == 'right' || settings.collapse == 'down');
        settings.collapsable = !(settings.collapse == 'none');
        if (!settings.collapsable) {
            this.addClass('splitter-handle-disabled');
        }

        if (settings.fixed) {
            this.addClass('splitter-fixed');
        }

        splitter = $('<div class="splitter_bar splitter-handle-' + settings.handle + '"/>')
            .insertAfter(panelOne);
        handle = $('<div class="splitter_handle"/>')
            .appendTo(splitter);

        if (settings.invisible) {
            splitter.addClass('splitter-invisible');
        }

        // Option to override CSS for width. Useful in conjunction with {invisible: true} or {handle: none}.
        if (settings.splitterSize) {
            splitter.css(settings.vertical ? 'width' : 'height', settings.splitterSize);
        }

        self = $.extend(this, {
            currentPosition: 0,
            containerSize: containerSize,
            splitterSize: settings.invisible ? 0 : (settings.vertical ? splitter.outerWidth() : splitter.outerHeight()),
            splitterSizeHalf: settings.invisible ? 0 : (settings.vertical ? splitter.outerWidth() / 2 : splitter.outerHeight() / 2),

            refresh: function () {
                var newSize = self.settings.vertical ? this.width() : this.height();
                if (self.containerSize != newSize) {
                    self.containerSize = newSize;
                    self.setPosition(self.currentPosition);
                }
            },

            setPosition: function (newPos) {
                if (newPos <= settings.leftMinSize) {
                    newPos = settings.leftMinSize;
                } else if (newPos >= self.containerSize - settings.rightMinSize - self.splitterSize) {
                    newPos = self.containerSize - settings.rightMinSize - self.splitterSize;
                }
                self.currentPosition = newPos;

                if (self.settings.vertical) {
                    panelOne.outerWidth(newPos);
                    panelTwo.outerWidth(self.containerSize - newPos - self.splitterSize);
                    splitter.css('left', self.settings.invisible ? newPos - self.splitterSizeHalf : newPos);
                } else {
                    panelOne.outerHeight(newPos);
                    panelTwo.outerHeight(self.containerSize - newPos - self.splitterSize);
                    splitter.css('top', self.settings.invisible ? newPos - self.splitterSizeHalf : newPos);
                }

                return self;
            },

            translatePosition: function (position) {
                //TODO: Consider replacing this with a more robust function that can accept any CSS value, such as Length.js at https://github.com/heygrady/Units
                // Currently valid parameter examples: 500, '500', '500px', '50%', 12.34, '12.34', '12.34px', '12.34%'
                if (typeof position === 'number') {
                    return position;
                } else if (typeof position === 'string') {
                    var match = position.match(/^([0-9\.]+)(px|%)?$/);
                    if (match) {
                        if (match[2] && match[2] == '%') {
                            var splitter = currentSplitter || self;
                            return (splitter.containerSize * +match[1]) / 100;
                        }
                        return +match[1]; // assume pixels for ANY suffix except '%', or lack thereof.
                    } else {
                        throw 'Invalid parameter: self.translatePosition(' + position + ') - bad string (only numbers allowed, with optional suffixes "px" or "%")';
                    }
                } else {
                    throw 'Invalid parameter: self.translatePosition(' + position + ') - bad type (only string/number allowed)';
                }
            },

            destroy: function () {
                self.removeClass('splitter_container');
                panelOne.before(panelOne.children().first().detach()).remove();
                panelTwo.before(panelTwo.children().first().detach()).remove();
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

        // If this is the first splitter, set up our events.
        if (splitters.length == 0) {
            $(window)
                .on('resize.splitter', function () {
                    $.each(splitters, function (i, splitter) {
                        splitter.refresh();
                    });
                });

            $(document.documentElement)
                .on('click.splitter', '.splitter_handle', function (e) {
                    // Prevent clicks if the user started dragging too much.
                    // Some (all?) browsers fire the click event even after the bar has been dragged hundreds of pixels.
                    if (disableClick) {
                        return disableClick = false;
                    }
                    currentSplitter = $(this).closest('.splitter_container').data('splitter');

                    if (currentSplitter.settings.collapsable) {
                        if (currentSplitter.data('savedPosition')) {
                            // Saved position found; restore.
                            currentSplitter.setPosition(currentSplitter.data('savedPosition'));
                            currentSplitter.data('savedPosition', null);

                        } else {
                            // Save current position and collapse.
                            currentSplitter.data('savedPosition', currentSplitter.currentPosition);
                            if (currentSplitter.settings.collapseNormal) {
                                currentSplitter.setPosition(currentSplitter.settings.leftMinSize);
                            } else {
                                currentSplitter.setPosition(currentSplitter.containerSize - currentSplitter.settings.rightMinSize);
                            }
                        }

                        currentSplitter.find('.splitter_panel').trigger('resize.splitter');
                        e.preventDefault();
                        $('.splitter_mask').remove();
                        currentSplitter.settings.onDrag(e, currentSplitter);
                    }
                    currentSplitter.removeClass('splitter-active');
                    currentSplitter = null;
                })

                .on('mousedown.splitter', '.splitter_handle', function (e) {
                    e.preventDefault();
                    if (currentSplitter == null) {
                        $(this).closest('.splitter_bar').trigger('mousedown');
                    }

                    dragStartPosition = (currentSplitter.settings.vertical) ? e.pageX : e.pageY;
                })

                .on('mousedown.splitter touchstart.splitter', '.splitter_container > .splitter_bar', function (e) {
                    e.preventDefault();
                    currentSplitter = $(this).closest('.splitter_container').data('splitter');
                    if (currentSplitter.settings.fixed) {
                        currentSplitter = null;
                    } else {
                        currentSplitter.addClass('splitter-active');
                        $('<div class="splitter_mask"></div>').css('cursor', currentSplitter.children().eq(1).css('cursor')).insertAfter(currentSplitter);
                        currentSplitter.settings.onDragStart(e, currentSplitter);
                    }
                })

                .on('mouseup.splitter touchend.splitter touchleave.splitter touchcancel.splitter', '.splitter_mask, .splitter_container > .splitter_bar', function (e) {
                    if (currentSplitter) {
                        e.preventDefault();
                        dragStartPosition = null;

                        // If the slider is dropped near it's collapsed position, set a saved position back to its
                        // original start position so the collapse handle works at least somewhat properly.
                        if (!currentSplitter.data('savedPosition')) {
                            if (currentSplitter.settings.collapseNormal) {
                                if (currentSplitter.currentPosition <= (currentSplitter.settings.leftMinSize + 5)) {
                                    currentSplitter.data('savedPosition', self.translatePosition(currentSplitter.settings.position));
                                    disableClick = false;
                                }
                            } else {
                                if (currentSplitter.currentPosition >= (currentSplitter.containerSize - currentSplitter.settings.rightMinSize - currentSplitter.splitterSize - 5)) {
                                    currentSplitter.data('savedPosition', self.translatePosition(currentSplitter.settings.position));
                                    disableClick = false;
                                }
                            }
                        }
                        $('.splitter_mask').remove();
                        currentSplitter.settings.onDragEnd(e, currentSplitter);
                        currentSplitter.removeClass('splitter-active');
                        currentSplitter = null;
                    }
                })

                .on('mousemove.splitter touchmove.splitter', '.splitter_mask, .splitter_bar', function (e) {
                    if (currentSplitter !== null) {
                        currentSplitter.data('savedPosition', null);

                        var position = (currentSplitter.settings.vertical) ? e.pageX : e.pageY;
                        if (e.originalEvent && e.originalEvent.changedTouches) {
                            position = (currentSplitter.settings.vertical) ? e.originalEvent.changedTouches[0].pageX : e.originalEvent.changedTouches[0].pageY;
                        }

                        // If the user started the drag with a mousedown on the handle, give it a 5-pixel delay.
                        if (dragStartPosition !== null) {
                            if (position > (dragStartPosition + 5) || position < (dragStartPosition - 5)) {
                                dragStartPosition = null;
                                disableClick = true;
                            } else {
                                e.preventDefault();
                                return false;
                            }
                        }

                        if (currentSplitter.settings.vertical) {
                            currentSplitter.setPosition(position - currentSplitter.offset().left - currentSplitter.splitterSize + 1);
                        } else {
                            currentSplitter.setPosition(position - currentSplitter.offset().top - currentSplitter.splitterSize + 1);
                        }
                        e.preventDefault();
                        currentSplitter.settings.onDrag(e, currentSplitter);
                    }
                }
            );
        }

        self.settings = settings;

        // Set the initial position of the splitter.
        self.setPosition(self.translatePosition(settings.position));

        self.data('splitter', self);
        splitters.push(self);
        return self;
    };

    $.fn.enhsplitter.defaults = {
        vertical: true,
        position: '50%',
        leftMinSize: 100,
        leftMaxSize: null,
        rightMinSize: 100,
        rightMaxSize: null,
        invisible: false,
        handle: 'default',
        fixed: false,
        collapse: 'left',
        height: null,
        splitterSize: null,
        onDragStart: $.noop,
        onDragEnd: $.noop,
        onDrag: $.noop
    };

})
(jQuery);
