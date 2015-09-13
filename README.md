# jQuery Enhanced Splitter

jquery.enhsplitter is a plugin to generate sliding splitters on your page. Useful for separating content, emulating the
look of frames, collapsable tool windows, and more. Completely customizable look and feel, and touchscreen friendly.

## Demo and Documentation

A demo and basic documentation of options of the latest version are available at:

<http://janfield.ca/github/jquery.enhsplitter/demo.html>

## Requirements

jquery.enhsplitter requires jQuery v1.8 or greater, or v2.0 or greater.

## Example

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

Defaults
--------
To change the default value for any setting for your entire page, use the .defaults object:
```javascript
$.fn.enhsplitter.defaults.splitterSize = '13px';
```


## Testing

Officially, jquery.enhsplitter follows the same device support program as jQuery 2.x.
We test on as many browsers and devices as we can, starting with the major ones.

### Windows and Linux

- [x] Firefox 40 (primary testing platform)
- [x] Chrome 45
- [x] Internet Explorer 11

Have you installed Windows 10? Give us an Edge report!

### Mac OS X

We do not have easy access to any Apple systems. If you are using one, please
[try everything in the test file](http://www.janfield.ca/github/jquery.enhsplitter/test.html)
and send us a report!

### Touch Screen Devices

On sites specifically designed for mobile, It is recommended to use the `splitterSize` option or custom CSS to increase
the width of the splitter. Using custom CSS to increase the size of the collapse handle is also recommended if it is
intended to be used; it should be disabled otherwise as it is too awkward to hit on mobile devices.

Future revisions will include special CSS for mobile and touch screen devices.

Currently tested and fully functional on the following, unless otherwise noted:
- [x] Android 5.0.1 - Internet 2.1.34.16 
- [x] Android 5.0.1 - Chrome for Android 45.0.2454.84
- [ ] Android 5.0.1 - Firefox for Android 40.0.3 - Collapse handle clicks not working; everything else fine.
- [ ] iOS 8.4 - Mobile Safari - Collapse handle clicks are difficult and touchy; everything else fine.

We do not have easy access to any Surface-type devices. If you are using one, please
[try everything in the test file](http://www.janfield.ca/github/jquery.enhsplitter/test.html)
and send us a report! Although I expect everything to work the same as the Windows browsers listed above, we can't be
sure that they handle touch events the same as mouse.

## License

Copyright (C) 2015 Hilton Janfield <hilton@janfield.ca>

Released under the terms of the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)

## Original Author and Contributors

This plugin was originally created by Jakub Jankiewicz. See https://github.com/jcubic/jquery.splitter

This project was originally forked from jcbuic/jquery.splitter, but was heavily overhauled and is now maintained as a
separate project.
