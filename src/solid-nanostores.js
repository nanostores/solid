import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';

export function useStore(store) {
  const [state, setState] = createStore(store.get());
  const unsubscribe = store.subscribe((newState) => {
    setState(reconcile(newState))
  });
  onCleanup(() => unsubscribe());
  return state;
}