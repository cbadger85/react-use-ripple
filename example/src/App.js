import React from "react";
import { useRipple } from "use-ripple";
import { useRef } from "react";

const App = () => {
  const ref = useRef();
  useRipple(ref);

  return (
    <button className="btn" ref={ref} style={{ position: "initial" }}>
      Button
    </button>
  );
};

export default App;
