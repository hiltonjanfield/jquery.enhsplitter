# jQuery Enhanced Splitter

jquery.enhsplitter is a plugin to generate sliding splitters on your page. Useful for separating content, emulating the
look of frames, collapsable tool windows, and more. Completely customizable look and feel, and touchscreen friendly.

## Release v1.1.0

This release adds a number of new options, as well as a few fixes and overall UX improvements.
- Added 'lowerLimit' and 'upperLimit' options, changed 'limit' to an alias to set both.
- Added 'collapse' option.
- Added 'fixed' option.
- Added 'splitterSize' option.
- Changed 'orientation' string setting to 'vertical' boolean setting.
- Fixed a few bugs.
- Significantly rewrote event handling, now smoother, faster, and tastier.

## Branch v1.1.1

Changes made so far.
- (UX improvement) Implemented drag-delay if the user clicks on the collapse handle then starts dragging.
  Drag will not begin until mouse has moved past 5 pixels in either direction.
- (UX improvement) Prevent click event if the user started and ended their drag on the collapse handle.

# Demo and Documentation

A demo and basic documentation of options are available at:

<http://janfield.ca/github/jquery.enhsplitter/demo.html>

# Example

A minimal call to jquery.enhsplitter in a jQuery ready function looks like this:

```javascript
jQuery(function ($) {
    $('#panels').enhsplitter();
}
```

Three HTML elements are required at a minimum. These can theoretically be any elements, but are intended
to be DIVs or other basic block-level elements. There must be one parent element and two child
elements. Additional child elements can exist, but is not supported and will result in unintended
side effects.

Once that is in place, all you need to do is call `.enhsplitter()` on an element, as shown above.
This will insert a splitter between the two child elements of `#panels` using default
settings (vertical splitter and defaults as shown below).

```html
<div id="panels">
    <div>
        [...]
    </div>
    <div>
        [...]
    </div>
</div>
```

Advanced Usage
--------------

jquery.enhsplitter has a number of options. Usage is just like most jQuery plugins -
just pass the options as an object parameter.

Please refer to the [demo](http://janfield.ca/github/jquery.enhsplitter/demo.html) for full details on the
available options.

```javascript
jQuery(function ($) {
    $('#panels').enhsplitter({
        vertical: true,
        limit: 125,
        handle: 'striped'
    });
}
```


# License

Copyright (C) 2015 Hilton Janfield <hilton@janfield.ca>

Released under the terms of the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)

# Original Author and Contributors

This plugin was originally created by Jakub Jankiewicz. See https://github.com/jcubic/jquery.splitter

This project was originally forked from jcbuic/jquery.splitter, but was heavily overhauled and is now maintained as a
separate project.
