# jQuery Enhanced Splitter Change Log

## Branch v1.2.0

A few bug fixes and minor enhancements, with small breaking changes signifying the minor version increment.
- Updated composer.json to specify valid jQuery versions (1.8+ / 2.0+).
- Implemented drag-delay if the user clicks on the collapse handle then starts dragging. Drag will not begin until mouse has moved past 5 pixels in either direction. (UX improvement)
- Prevent click event if the user started and ended their drag on the collapse handle. (UX improvement)
- Change splitter bar class from .splitter to .splitter_bar for consistency.
- Fixed issue where collapse handle would ignore one click if manually dragged to the collapsed position. (UX improvement/bug)
- Modified onDrag, onDragStart, onDragEnd events to pass splitter container for easy manipulation.

## Release v1.1.0

This release adds a number of new options, as well as a few fixes and overall UX improvements.
- Added 'lowerLimit' and 'upperLimit' options, changed 'limit' to an alias to set both.
- Added 'collapse' option.
- Added 'fixed' option.
- Added 'splitterSize' option.
- Changed 'orientation' string setting to 'vertical' boolean setting. (BREAKING CHANGE)
- Fixed a few bugs.
- Significantly rewrote event handling, now smoother, faster, and tastier.

## Release v1.0.1

More bug fixes, improved event handlers, improved CSS.

## Release v1.0.0

Original release of fork, with significant changes and bug fixes.
