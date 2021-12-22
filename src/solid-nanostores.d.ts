import { ReadableAtom } from 'nanostores';
import { Store } from 'solid-js/store';

export function useStore<Value>(store: ReadableAtom<Value>):Store<Value>;
