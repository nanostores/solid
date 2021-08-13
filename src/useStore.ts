import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import { ReadableStore } from 'nanostores';
import { ReadonlyIfObject } from 'nanostores/create-store';

export function useStore<T extends any>(store: ReadableStore<T>) {
  // @ts-expect-error: Need to subscribe to get first value
  const [state, setState] = createStore<ReadonlyIfObject<T> | undefined>();
  const unsubscribe = store.subscribe((newState) => {
    setState(reconcile(newState))
  });
  onCleanup(() => unsubscribe());
  return state;
}