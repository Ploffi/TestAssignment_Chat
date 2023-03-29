# VirtualizeList

Component for render virtualized list with bottom-up direction.  
Inspired by [@tanstack/react-virtual](https://tanstack.com/virtual/v3).

## Algorithm of virtualization

Component require some information about your list:

1. Minimal height of rendered element
2. Total amount of elements
3. Oversize amount - how many elements should render before and after visible range, for improve UX

With this information we can calculate estimated total height of scrollable block and estimated measures of every
element from `0` to `total`.
When we get a real size of element by `React.ref` to elements indexed DOM node we will re-calculate following measures
and total height.
It doesn't support element size changes by the task requirements, but we could improve this part with `ResizeObserver`
in the future.

So, step by the step:

1. Subscribe to the scroll event of scroll element. Start re-calculation on its change
2. Calculate estimated total size and measures of elements
3. By current scroll offset calculate range of elements: find first and last elements which should be visible in user
   display by measured bottom and top borders
4. Render these range of elements
5. Measure real size of elements. If it has difference, then re-calculate our measures and total heights
6. Find new range of visible elements and render them

## Algorithm of scroll to last element

For these purpose we require to get information is final element was mounted or some skeleton.
Before we got all final component mounted component will scroll to the end on every `render` phase:
1. Render full height container, calculate initial range
2. Scroll to the end of container, calculate range of a last elements
3. Until the last elements are rendered scroll to the end of container on every `render`

