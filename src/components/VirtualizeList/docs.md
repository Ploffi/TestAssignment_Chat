# VirtualizeList

The VirtualizeList component is a tool for rendering a virtualized list with a bottom-up direction. This component can
improve performance and user experience when working with large lists by only rendering a subset of the list items that
are currently visible on the screen.
Inspired by [@tanstack/react-virtual](https://tanstack.com/virtual/v3).

## Algorithm of virtualization

The VirtualizeList component requires three pieces of information to function effectively:

The minimum height of the rendered element
The total number of elements in the list
The oversize amount, which is the number of elements to render before and after the visible range to improve the user
experience.

Using this information, the component calculates the estimated total height of the scrollable block and estimated
measurements of every element from 0 to total. When the component receives the actual size of an element through a
`React.ref` to the element's indexed DOM node, it recalculates the estimated measurements and total height. However, the
component does not currently support element size changes because of the task requirements, but this can be improved
with the
use of a `ResizeObserver` in the future.

The virtualization algorithm can be broken down into the following steps:

1. Subscribe to the scroll event of the scroll element and start re-calculation on its change
2. Calculate the estimated total size and measurements of elements
3. Using the current scroll offset, calculate the range of elements that should be visible in the user's display by
   measuring the bottom and top borders
4. Render this range of elements
5. Measure the actual size of elements. If there is a difference between the estimated and actual size, then recalculate
   the measurements and total height
6. Find a new range of visible elements and render them.

## Algorithm of the scroll to the last element

To scroll to the last element, the component must first determine whether the last element has been mounted or not. This
is done by checking the ready flag in the result of the children function. The algorithm for scrolling to the last
element can be broken down into the following steps:

1. Render a full-height container and calculate an initial range of elements.
2. Scroll to the end of the container and calculate the range of the last elements.
3. Until the last elements are rendered, scroll to the end of the container on every render.