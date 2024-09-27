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

## Installation

Install it:

```bash
npm install nanostores @nanostores/solid # or npm or yarn
```

## Usage:

```ts
// store.ts
import { action, atom } from 'nanostores';

export const counter = atom(0);

export const increase = action(counter, 'increase', (store) => {
  counter.set(counter.get() + 1);
});
```

```tsx
import { useStore } from '@nanostores/solid';
import { counter, increase } from './store';

function Counter() {
  const count = useStore(counter);
  return <h1>{count()} around here ...</h1>;
}

function Controls() {
  return <button onClick={increase}>one up</button>;
}
```

## License

MIT
