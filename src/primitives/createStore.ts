import type { Store as SolidStore } from 'solid-js/store';
import type { Store, WritableStore } from 'nanostores';
import { reconcile, createStore as solidCreateStore } from 'solid-js/store';
import { onCleanup } from 'solid-js';

export function createStore<T>(store: Store<T>): [
  SolidStore<T>, (newValue: T) => void,
] {
  const initialValue = store.get();
  const [state, setState] = solidCreateStore(initialValue);

  const unsubscribe = store.subscribe((value) => {
    const newState = reconcile(value);
    setState(newState);
  });

  onCleanup(() => unsubscribe());

  const updateValue = (newValue: T) => {
    (store as WritableStore<T>).set(newValue);
  };

  return [state, updateValue];
}
