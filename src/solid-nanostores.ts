import { createStore, reconcile, StoreNode } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import { ReadableAtom } from 'nanostores';

export function useStore<T extends StoreNode>(store: ReadableAtom<T>) {
  const [state, setState] = createStore(store.get());
  const unsubscribe = store.subscribe((newState) => {
    setState(reconcile(newState))
  });
  onCleanup(() => unsubscribe());
  return state;
}