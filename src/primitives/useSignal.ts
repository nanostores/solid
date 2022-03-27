import type { Accessor } from 'solid-js';
import { createSignal, onCleanup } from 'solid-js';
import type { WritableAtom } from 'nanostores';

export function useSignal<T>(atom: WritableAtom<T>): [
  Accessor<T>, (newValue: T) => void,
] {
  const initialValue = atom.get();
  const [state, setState] = createSignal(initialValue);

  const unsubscribe = atom.subscribe((value) => {
    // @ts-expect-error: fix later
    setState(value);
  });

  onCleanup(() => unsubscribe());

  const updateValue = (newValue: T) => {
    atom.set(newValue);
  };

  return [state, updateValue];
}
