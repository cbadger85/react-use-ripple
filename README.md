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
import React from "react";
import { useRipple } from "react-use-ripple";
import { useRef } from "react";

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

## FAQ

**Q.** Can `useRipple` be used more than once in a component?  
**A.** `useRipple` can be used as many times as neccessary inside a component.

**Q.** Can the `useRipple` hook be conditionally rendered?  
**A.** No. Keep the rules-of-hooks in mind when using use `useRipple` and do not conditionally render it.

**Q.** What happens when the JSX with the ref is conditionally rendered? Will the ripple still work when the component mounts?  
**A.** `useRipple` can handle null references, so if an element using a the ripple effect is conditionally rendered, the effect will applied when the component mounts.

## License

MIT © [Charles Badger](https://github.com/cbadger85)
