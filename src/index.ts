import type { Store, StoreValue } from 'nanostores';
import { createStore as createStoreImpl, reconcile } from 'solid-js/store';
import type { Accessor } from 'solid-js';
import { createMemo, createSignal, onCleanup } from 'solid-js';
import { isPrimitive } from './util';

function createPrimitiveStore<
  SomeStore extends Store,
  Value extends StoreValue<SomeStore>,
>(store: SomeStore): Accessor<Value> {
  const initialValue = store.get();
  const [state, setState] = createSignal(initialValue);

  const unsubscribe = store.subscribe((value) => {
    setState(value);
  });

  onCleanup(() => unsubscribe());

  return state;
}

/**
 * Subscribes to store changes and gets store’s value.
 *
 * @param store Store instance.
 * @returns Store value.
 */
export function useStore<
  SomeStore extends Store,
  Value extends StoreValue<SomeStore>,
>(store: SomeStore): Accessor<Value> {
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
