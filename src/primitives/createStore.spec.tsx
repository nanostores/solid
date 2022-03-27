import { action, atom, computed } from 'nanostores';
import { render, screen } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { createStore } from '../index';

const counterStore = atom({ value: 0 });
const increase = action(counterStore, 'increase', (store) => {
  store.set({ value: store.get().value + 1 });
});
const decrease = action(counterStore, 'decrease', (store) => {
  store.set({ value: store.get().value - 1 });
});
const doubledCounterStore = computed(counterStore, current =>
  current.value * 2,
);

test('render correct in solid', async() => {
  const App = () => {
    const counter = createStore(counterStore);
    const doubled = createStore(doubledCounterStore);

    return (
      <>
        <div data-testid="count">{counter().value}</div>
        <div data-testid="doubled">{doubled()}</div>
        <button data-testid="inc" onClick={increase}>+</button>
        <button data-testid="dec" onClick={decrease}>-</button>
      </>
    );
  };

  const { unmount } = render(() => <App />);

  const increment = await screen.findByTestId('inc');
  const decrement = await screen.findByTestId('dec');

  userEvent.click(increment);
  userEvent.click(increment);

  expect((await screen.findByTestId('count')).textContent).toBe('2');
  expect((await screen.findByTestId('doubled')).textContent).toBe('4');
  userEvent.click(decrement);
  expect((await screen.findByTestId('count')).textContent).toBe('1');
  expect((await screen.findByTestId('doubled')).textContent).toBe('2');

  unmount();
});
