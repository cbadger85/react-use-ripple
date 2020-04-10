import { fireEvent, render, screen } from '@testing-library/react';
import React, { useRef } from 'react';
import { useRipple } from '..';

const TestComponent: React.FC<Props> = ({ position }) => {
  const ref = useRef<HTMLButtonElement>(null);
  useRipple(ref);

  return (
    <button id="btn" ref={ref} style={{ position }}>
      Button
    </button>
  );
};

interface Props {
  position?:
    | 'absolute'
    | 'relative'
    | 'sticky'
    | 'fixed'
    | 'static'
    | 'initial';
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

  it('should create the ripple and keyframes on click', async () => {
    const { container } = render(<TestComponent />);

    fireEvent.click(screen.getByText('Button'));

    const ripple = container.querySelector('span');

    expect(ripple).toBeTruthy();
  });

  it('should show the ripple at the point of click', () => {
    const { container } = render(<TestComponent />);

    fireEvent.click(screen.getByText('Button'), { clientX: 5, clientY: 5 });

    const ripple = container.querySelector('span');

    expect(ripple?.style.top).toBe('5px');
    expect(ripple?.style.left).toBe('5px');
  });

  it('should show the ripple in the middle of the element if the event was not fired from a mouse click', () => {
    const { container } = render(<TestComponent />);

    fireEvent.click(screen.getByText('Button'), { clientX: 0, clientY: 0 });

    const ripple = container.querySelector('span');

    expect(ripple?.style.top).toBe('0px');
    expect(ripple?.style.left).toBe('0px');
  });

  it('should remove the ripple and keyframe after the animation', async () => {
    const { container } = render(<TestComponent />);

    fireEvent.click(screen.getByText('Button'));

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
    const { container } = render(<TestComponent position="fixed" />);

    const button = container.querySelector('#btn') as HTMLElement;

    const position = button.style.position;

    expect(position).toBe('fixed');
  });
});
