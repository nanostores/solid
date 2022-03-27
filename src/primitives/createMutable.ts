import type { Store } from 'nanostores';
import { createMutable as createMutableImpl } from 'solid-js/store';

export function createMutable<T>(store: Store<T>) {
  const initialData = store.get();
  const mutable = createMutableImpl(initialData);
  return mutable;
}
