import type { Accessor } from 'solid-js';
import { createMemo } from 'solid-js';
import type { WritableAtom } from 'nanostores';
import { useStore } from './useStore';

export function useSignal<T>(atom: WritableAtom<T>) {
  const [store, updateValue] = useStore(atom);
  const accessor = createMemo(() => store);
  return [accessor, updateValue] as [
    Accessor<T>, typeof updateValue,
  ];
}
