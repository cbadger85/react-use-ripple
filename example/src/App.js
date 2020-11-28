import React, { useRef, useState } from 'react';
import { useRipple } from 'react-use-ripple';

const App = () => {
  const ref = useRef();
  const excludedRef = useRef();
  const [isShown, setIsShown] = useState(false);
  useRipple(ref, { excludedRefs: [excludedRef] });

  return (
    <button className="btn" ref={ref} onClick={() => setIsShown(!isShown)}>
      <span>TEST2|</span>
      Button
      {isShown && <span ref={excludedRef}>|TEST</span>}
    </button>
  );
};

export default App;
