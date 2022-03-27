import { atom } from 'nanostores';
import { render, screen } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { createStore } from '../index';

test('render correct in solid', async() => {
  const counterStore = atom({ value: 0 });

  const App = () => {
    const counter = createStore(counterStore);

    const inc = () => {
      counterStore.set({ value: counterStore.get().value + 1 });
    };
    const dec = () => {
      counterStore.set({ value: counterStore.get().value - 1 });
    };

    return (
      <>
        <div data-testid="count">{counter().value}</div>
        <button data-testid="inc" onClick={inc}>+</button>
        <button data-testid="dec" onClick={dec}>-</button>
      </>
    );
  };

  const { unmount } = render(() => <App />);

  const increment = await screen.findByTestId('inc');
  const decrement = await screen.findByTestId('dec');

  userEvent.click(increment);
  userEvent.click(increment);

  expect((await screen.findByTestId('count')).textContent).toBe('2');
  userEvent.click(decrement);
  expect((await screen.findByTestId('count')).textContent).toBe('1');

  unmount();
});
