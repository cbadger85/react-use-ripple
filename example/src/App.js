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
