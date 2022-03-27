import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import type { ReadableAtom } from 'nanostores';
import type { Store } from 'solid-js/store';

export function useStore<T>(store: ReadableAtom<T>): Store<T> {
  const initialValue = store.get();
  const [state, setState] = createStore(initialValue);
  const unsubscribe = store.subscribe((value) => {
    const newState = reconcile(value);
    setState(newState);
  });
  onCleanup(() => unsubscribe());
  return state;
}
