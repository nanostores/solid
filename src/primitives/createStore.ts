import type { Store } from 'solid-js/store';
import { reconcile, createStore as solidCreateStore } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import type { WritableAtom } from 'nanostores';

export function createStore<T>(atom: WritableAtom<T>): [
  Store<T>, (newValue: T) => void,
] {
  const initialValue = atom.get();
  const [state, setState] = solidCreateStore(initialValue);

  const unsubscribe = atom.subscribe((value) => {
    const newState = reconcile(value);
    setState(newState);
  });

  onCleanup(() => unsubscribe());

  const updateValue = (newValue: T) => {
    atom.set(newValue);
  };

  return [state, updateValue];
}
