import { createStore, reconcile } from 'solid-js/store';
import type { Accessor } from 'solid-js';
import { createMemo, onCleanup } from 'solid-js';
import type { WritableAtom } from 'nanostores';

export function useStore<T>(atom: WritableAtom<T>) {
  const initialValue = atom.get();
  const [state, setState] = createStore(initialValue);

  const unsubscribe = atom.subscribe((value) => {
    const newState = reconcile(value);
    setState(newState);
  });

  onCleanup(() => unsubscribe());

  const signal = createMemo(() => state);

  const updateValue = (newValue: T) => {
    atom.set(newValue);
  };

  return [signal, updateValue] as [
    Accessor<T>, (newValue: T) => void,
  ];
}
