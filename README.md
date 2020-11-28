# react-use-ripple

> A react hook to implement [Material Design ripple overlays](https://www.google.com)

[![NPM](https://img.shields.io/npm/v/react-use-ripple.svg)](https://www.npmjs.com/package/react-use-ripple) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

[![Edit react-use-ripple demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/heuristic-currying-kp08n?fontsize=14&hidenavigation=1&theme=dark)

## Install

```bash
npm install --save react-use-ripple
```

## Usage

`useRipple` only requires the ref of the DOM element that the ripple should be applied too.

```tsx
import React from 'react';
import { useRipple } from 'react-use-ripple';
import { useRef } from 'react';

const App = () => {
  const ref = useRef();
  useRipple(ref);

  return (
    <button className="btn" ref={ref}>
      Button
    </button>
  );
};

export default App;
```

## Arguments

`useRipple(ref [, options])`

- ref `<RefObject<HTMLElement>>`
- options `<Object>`
  - disabled `<boolean>` **Default** `false`
  - rippleColor\* `<string>` **Default** `rgba(0, 0, 0, 0.3)`
  - animationLength** `<number>` **Default\*\* `700`
  - rippleSize**\* `<number>` **Default\*\* `100`
  - excludedRefs**\*\* `<RefObject<HTMLElement>>[]` **Default\*\* `[]`

> \* `rippleColor` can be any valid css color that is supported by the targeted browsers
>
> \*\* `animationLength` will always be in milliseconds
>
> \*\*\* `rippleSize` will use the smallest value of the length, width, or specified size. if specifying a size, the unit will be in pixels.
>
> \*\*\*\* `excludedRefs` a list of child refs that should not cause a ripple when clicked

## FAQ

**Q.** Can `useRipple` be used more than once in a component?  
**A.** `useRipple` can be used as many times as neccessary inside a component.

**Q.** Does `useRipple` support SSR?  
**A.** Yup! Thanks to a recent PR, `useRipple` now supports SSR (as of version 1.4.0)

**Q.** Can the `useRipple` hook be conditionally rendered?  
**A.** No. Keep the rules-of-hooks in mind when using use `useRipple` and do not conditionally render it.

**Q.** What happens when the JSX with the ref is conditionally rendered? Will the ripple still work when the component mounts?  
**A.** `useRipple` can handle null references, so if an element using a the ripple effect is conditionally rendered, the effect will applied when the component mounts.

**Q.** How does adding a ripple to an element affect its css?  
**A.** `useRipple` does two things to an element's css:

- If an element's position is not set (i.e. its position is `initial` or `static`) than `position: relative` is added to the element.
- `useRipple` sets the overflow of the element to `hidden`, to prevent the ripple from extending outside the element.

**NOTE:** If your using child or descendant selectors to style `span` elements, it may affect the css of the ripple. To avoid this, use specificity to target span elements that you wish to style.

## License

MIT © [Charles Badger](https://github.com/cbadger85)
