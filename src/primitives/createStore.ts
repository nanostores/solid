import type { Store } from 'nanostores';
import { createStore as createStoreImpl, reconcile } from 'solid-js/store';
import { createMemo, createSignal, onCleanup } from 'solid-js';
import { isPrimitive } from '../util';

function createPrimitiveStore<T>(store: Store<T>) {
  const initialValue = store.get();
  const [state, setState] = createSignal(initialValue);

  const unsubscribe = store.subscribe((value) => {
    // @ts-expect-error: fix later
    setState(value);
  });

  onCleanup(() => unsubscribe());

  return state;
}

export function createStore<T>(store: Store<T>) {
  if (isPrimitive(store.get()))
    return createPrimitiveStore(store);

  const initialValue = store.get();
  const [state, setState] = createStoreImpl(initialValue);

  const unsubscribe = store.subscribe((value) => {
    const newState = reconcile(value);
    setState(newState);
  });

  onCleanup(() => unsubscribe());

  return createMemo(() => state);
}
