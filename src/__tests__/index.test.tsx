import { fireEvent, render, screen } from '@testing-library/react';
import React, { CSSProperties, useRef } from 'react';
import { RippleOptions, useRipple } from '..';

const TestComponent: React.FC<Props> = ({
  style,
  disabled,
  animationLength,
  rippleColor,
  rippleSize,
  excludeRef,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const excludedRef = useRef<HTMLDivElement>(null);
  useRipple(ref, {
    disabled,
    animationLength,
    rippleColor,
    rippleSize,
    excludedRefs: excludeRef ? [excludedRef] : undefined,
  });

  return (
    <button
      id="btn"
      ref={ref}
      style={{ display: excludeRef ? 'block' : undefined, ...style }}
    >
      Button
      {excludeRef && <div ref={excludedRef}>test</div>}
    </button>
  );
};

interface Props extends RippleOptions {
  style?: CSSProperties;
  excludeRef?: boolean;
}

const NullComponent = () => {
  const ref = useRef<HTMLElement>(null);
  useRipple(ref);

  return <div>null</div>;
};

beforeAll(jest.useFakeTimers);

describe('useRipple', () => {
  it('should not crash if the ref is null', async () => {
    render(<NullComponent />);

    const element = screen.getByText('null');

    expect(element).toBeTruthy();
  });

  it('should not have the ripple created or keyframes created on mount', async () => {
    const { container } = render(<TestComponent />);

    const ripple = container.querySelector('span');

    expect(ripple).toBeFalsy();
  });

  it('should create the ripple and keyframes on mouse down', async () => {
    const { container } = render(<TestComponent />);

    fireEvent.mouseDown(screen.getByText('Button'));

    const ripple = container.querySelector('span');

    expect(ripple).toBeTruthy();
  });

  it('should not ripple if an excluded element clicked and the ref is added to the excludedRefs list', async () => {
    const { container } = render(<TestComponent excludeRef />);

    fireEvent.mouseDown(screen.getByText('test'));

    const ripple = container.querySelector('span');

    expect(ripple).toBeFalsy();
  });

  it('should not create the ripple and keyframes on mouse down if the hook is disabled', async () => {
    const { container } = render(<TestComponent disabled />);

    fireEvent.mouseDown(screen.getByText('Button'));

    const ripple = container.querySelector('span');

    expect(ripple).toBeFalsy();
  });

  it('should show the ripple at the point of mouse down', () => {
    const { container } = render(<TestComponent />);

    fireEvent.mouseDown(screen.getByText('Button'), { clientX: 5, clientY: 5 });

    const ripple = container.querySelector('span');

    expect(ripple?.style.top).toBe('5px');
    expect(ripple?.style.left).toBe('5px');
  });

  it('should show the ripple in the middle of the element if the event was fired from an enter press', () => {
    const { container } = render(<TestComponent />);

    fireEvent.keyDown(screen.getByText('Button'), { key: 'Enter' });

    const ripple = container.querySelector('span');

    expect(ripple?.style.top).toBe('0px');
    expect(ripple?.style.left).toBe('0px');
  });

  it('should show the ripple in the middle of the element if the event was fired from an spacebar press', () => {
    const { container } = render(<TestComponent />);

    fireEvent.keyDown(screen.getByText('Button'), { key: ' ' });

    const ripple = container.querySelector('span');

    expect(ripple?.style.top).toBe('0px');
    expect(ripple?.style.left).toBe('0px');
  });

  it('should not show the ripple in the middle of the element if the event was fired from a keydown but not an enter press', () => {
    const { container } = render(<TestComponent />);

    fireEvent.keyDown(screen.getByText('Button'), { key: 'Tab' });

    const ripple = container.querySelector('span');

    expect(ripple).toBeFalsy();
  });

  it('should remove the ripple and keyframe after the animation', async () => {
    const { container } = render(<TestComponent />);

    fireEvent.mouseDown(screen.getByText('Button'));

    fireEvent.animationEnd(container.querySelector('span') as HTMLElement);

    const finalRipple = container.querySelector('span');
    expect(finalRipple).toBeFalsy();
  });

  it('should create a style tag', () => {
    const styleTag = document.querySelector('style');

    expect(styleTag?.innerHTML).toBeTruthy();
  });

  it(`should change the element's position to relative`, () => {
    const { container } = render(<TestComponent />);

    const button = container.querySelector('#btn') as HTMLElement;

    const position = button.style.position;

    expect(position).toBe('relative');
  });

  it(`should not overwrite position style if element is already positioned`, () => {
    const { container } = render(
      <TestComponent style={{ position: 'fixed' }} />,
    );

    const button = container.querySelector('#btn') as HTMLElement;

    const position = button.style.position;

    expect(position).toBe('fixed');
  });

  it('should change the ripple color if specified', () => {
    const { container } = render(<TestComponent rippleColor="blue" />);

    fireEvent.mouseDown(screen.getByText('Button'), { clientX: 5, clientY: 5 });

    const ripple = container.querySelector('span');

    expect(ripple?.style.backgroundColor).toBe('blue');
  });

  it('should change the ripple animation length if specified', () => {
    const { container } = render(<TestComponent animationLength={3000} />);

    fireEvent.mouseDown(screen.getByText('Button'), { clientX: 5, clientY: 5 });

    const ripple = container.querySelector('span');

    expect(ripple?.style.animation).toBe('use-ripple-animation 3000ms ease-in');
  });
});
