import type { WritableAtom } from 'nanostores';
import { useSignal } from './useSignal';

export function useMemo<T>(atom: WritableAtom<T>) {
  const [store] = useSignal(atom);
  return store;
}
