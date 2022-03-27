import { atom } from 'nanostores';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { expect, test } from 'vitest';
import { useStore } from '../src';

test('renders correct in Solid', async() => {
  let renders = 0;

  const letterStore = atom<{ letter: string }>({ letter: 'a' });

  const div = document.createElement('div');
  const [show, setShow] = createSignal(true);
  const [store, setStore] = useStore(letterStore);

  const dispose = render(() => {
    renders += 1;
    return (
      <>
        { show() && <div data-testid="test">{store().letter}</div> }
      </>
    );
  }, div);

  expect(div.querySelector('[data-testid="test"]').textContent).toBe('a');
  expect(renders).toEqual(1);

  setStore({ letter: 'b' });
  setStore({ letter: 'c' });

  expect(div.querySelector('[data-testid="test"]').textContent).toBe('c');
  expect(renders).toEqual(1);

  setShow(false);
  expect(div.querySelector('[data-testid="test"]')).toBeNull();
  expect(renders).toEqual(1);
  dispose();
});
