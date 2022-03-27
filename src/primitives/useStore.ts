import type { Store } from 'solid-js/store';
import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import type { WritableAtom } from 'nanostores';

export function useStore<T>(atom: WritableAtom<T>): [
  Store<T>, (newValue: T) => void,
] {
  const initialValue = atom.get();
  const [state, setState] = createStore(initialValue);

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
