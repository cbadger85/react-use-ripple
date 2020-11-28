import React, { useRef } from 'react';
import { useRipple } from 'react-use-ripple';

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
