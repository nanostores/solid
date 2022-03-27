import type { WritableAtom } from 'nanostores';
import type { Accessor } from 'solid-js';
import { useSignal } from './useSignal';

export function useMemo<T>(atom: WritableAtom<T>) {
  const [store] = useSignal(atom);
  return store as Accessor<T>;
}
