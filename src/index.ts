import { RefObject, useEffect } from 'react';

const ANIMATION_LENGTH = 700;
const RIPPLE_SIZE = 100;
const RIPPLE_COLOR = 'rgba(0, 0, 0, 0.3)';
const RIPPLE_CLASSNAME = 'ripple-effect';
const KEY_ENTER = 'Enter';
const KEY_SPACE = ' ';

if (typeof document !== 'undefined') {
  const style = document.createElement('style');

  const keyframes = `
    @keyframes use-ripple-animation {
      from {
        opacity: 1;
        transform: scale(0);
      }
      to {
        opacity: 0;
        transform: scale(10);
      }
    }
    `;

  style.innerHTML = keyframes;

  document.querySelector('head')?.appendChild(style);
}

export interface RippleOptions {
  disabled?: boolean;
  rippleColor?: string;
  animationLength?: number;
  rippleSize?: number;
  excludedRefs?: RefObject<HTMLElement>[];
}

interface RippleEvent {
  clientX?: number;
  clientY?: number;
  target: EventTarget | null;
}

const defaultEvent: Required<RippleEvent> = {
  clientX: 0,
  clientY: 0,
  target: null,
};

const createRipple = (element: HTMLElement, options?: RippleOptions) => (
  e?: RippleEvent,
) => {
  const isExcluded = (options?.excludedRefs || []).some(
    ref =>
      (!!ref.current && ref.current.contains(e?.target as Node)) ||
      ref.current?.isSameNode(e?.target as Node),
  );

  if (isExcluded) {
    return;
  }

  const clientX = e?.clientX || defaultEvent.clientX;
  const clientY = e?.clientY || defaultEvent.clientY;

  const { height, width, top, left } = element.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;

  const rippleSize = Math.min(
    height,
    width,
    options?.rippleSize || RIPPLE_SIZE,
  );

  const positionTop = clientX
    ? y - rippleSize / 2
    : rippleSize / 2 - height / 2;
  const positionLeft = clientY
    ? x - rippleSize / 2
    : width / 2 - rippleSize / 2;

  const span = document.createElement('span');
  span.className = RIPPLE_CLASSNAME;
  span.style.cssText = `
    top: ${positionTop}px;
    left: ${positionLeft}px;
    position: absolute;
    border-radius: 50%;
    background-color: ${options?.rippleColor || RIPPLE_COLOR};
    pointer-events: none;
    width: ${rippleSize}px;
    height: ${rippleSize}px;
    animation: use-ripple-animation ${options?.animationLength ||
      ANIMATION_LENGTH}ms ease-in;
  `;

  element.appendChild(span);

  span.addEventListener('animationend', () => {
    element.removeChild(span);
  });
};

export const useRipple = (
  ref: RefObject<HTMLElement>,
  options?: RippleOptions,
) => {
  useEffect(() => {
    if (options?.disabled || !ref?.current) {
      return;
    }

    const element = ref.current;
    const elementPosition = getComputedStyle(element).getPropertyValue(
      'position',
    );

    element.style.position =
      elementPosition === 'static' || !elementPosition
        ? 'relative'
        : elementPosition;
    element.style.overflow = 'hidden';

    const ripple = createRipple(element, options);

    const keyboardRipple = (e: KeyboardEvent) => {
      const isAnElegibleKey = [KEY_ENTER, KEY_SPACE].includes(e.key);
      const elementIsFocused = element === e.target;
      const shouldRipple = isAnElegibleKey && elementIsFocused;

      shouldRipple && ripple();
    };

    element.addEventListener('mousedown', ripple);

    function keyboardListener(event: KeyboardEvent) {
      const targetElement = event?.target as HTMLElement;
      const isThereARippleEffectRunning = !targetElement?.getElementsByClassName(
        RIPPLE_CLASSNAME,
      ).length;

      if (isThereARippleEffectRunning) {
        keyboardRipple(event);
      }
    }

    document.addEventListener('keydown', keyboardListener);
    return () => {
      element.removeEventListener('mousedown', ripple);
      element.removeEventListener('keydown', keyboardRipple);
    };
  });
};
