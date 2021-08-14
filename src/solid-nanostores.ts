import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import { ReadableStore, getValue } from 'nanostores';

export function useStore<T extends any>(store: ReadableStore<T>) {
  const [state, setState] = createStore(getValue(store));
  const unsubscribe = store.subscribe((newState) => {
    setState(reconcile(newState))
  });
  onCleanup(() => unsubscribe());
  return state;
}