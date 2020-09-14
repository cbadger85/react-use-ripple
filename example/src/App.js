import React from 'react';
import { useRipple } from 'react-use-ripple';
import { useRef } from 'react';

const App = () => {
  const ref = useRef();
  useRipple(ref, { minRippleSize: 10000 });

  return (
    <button className="btn" ref={ref}>
      Button
    </button>
  );
};

export default App;
