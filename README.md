# Nano Store Solid

<img align="right" width="92" height="92" title="Nano Stores logo"
     src="https://nanostores.github.io/nanostores/logo.svg">

Solid integration for **[Nano Stores]**, a tiny state manager
with many atomic tree-shakable stores.

* **Small.** Less than 1 KB. Zero dependencies.
* **Fast.** With small atomic and derived stores, you do not need to call
  the selector function for all components on every store change.
* **Tree Shakable.** The chunk contains only stores used by components
  in the chunk.
* Was designed to move logic from components to stores.
* It has good **TypeScript** support.

[Nano Stores]: https://github.com/nanostores/nanostores/

## Installation

```bash
npm install nanostores @nanostores/solid
```

## Usage:

```ts
// store.ts
import { atom } from 'nanostores';

export const $counter = atom(0);

export const increase = () => {
  $counter.set($counter.get() + 1);
}
```

```tsx
import { useStore } from '@nanostores/solid';
import { $counter, increase } from './store';

function Counter() {
  const count = useStore($counter);
  return <h1>{count()} around here ...</h1>;
}

function Controls() {
  return <button onClick={increase}>one up</button>;
}
```

## Object values are reconciled in place

For object and array values, `useStore` applies updates with Solid’s
[`reconcile()`] to keep rendering fine-grained: instead of replacing
the value, the previous object is **mutated in place** to match the new one.
The second argument of `useStore` is passed through as [`ReconcileOptions`]
(for example `key`, used to match items in array stores).

This has one important consequence: if you `set()` a reference to an object
you don’t own — like a proxy from another library — the previous stored
object can be mutated to look like the new value. To avoid this footgun,
store plain copies rather than external references:

```ts
/**
 * Deep copy helper to remove proxies before storing a value.
 */
function unproxify<Value>(value: Value): Value {
  if (Array.isArray(value)) return value.map(unproxify) as Value;
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, unproxify(entry)])
    ) as Value;
  }
  return value;
}

$store.set(unproxify(nextValue));
```

[`reconcile()`]: https://docs.solidjs.com/reference/store-utilities/reconcile
[`ReconcileOptions`]: https://docs.solidjs.com/reference/store-utilities/reconcile

## License

MIT
