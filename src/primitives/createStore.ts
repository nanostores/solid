import type { WritableStore } from 'nanostores';
import { createStore as createStoreImpl, reconcile } from 'solid-js/store';
import type { Accessor } from 'solid-js';
import { createMemo, createSignal, onCleanup } from 'solid-js';
import { isPrimitive } from '../util';

function createPrimitiveStore<T>(store: WritableStore<T>): [
  Accessor<T>, (newValue: T) => void,
] {
  const initialValue = store.get();
  const [state, setState] = createSignal(initialValue);

  const unsubscribe = store.subscribe((value) => {
    // @ts-expect-error: fix later
    setState(value);
  });

  onCleanup(() => unsubscribe());

  const updateValue = (newValue: T) => {
    store.set(newValue);
  };

  return [state, updateValue];
}

export function createStore<T>(store: WritableStore<T>): [
  Accessor<T>, (newValue: T) => void,
] {
  if (isPrimitive(store.get()))
    return createPrimitiveStore(store);

  const initialValue = store.get();
  const [state, setState] = createStoreImpl(initialValue);

  const unsubscribe = store.subscribe((value) => {
    const newState = reconcile(value);
    setState(newState);
  });

  onCleanup(() => unsubscribe());

  const updateValue = (newValue: T) => {
    store.set(newValue);
  };

  const memoizedStore = createMemo(() => state);

  return [memoizedStore, updateValue];
}
