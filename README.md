# Nano Store Solid

<img align="right" width="92" height="92" title="Nano Stores logo"
     src="https://nanostores.github.io/nanostores/logo.svg">

Vue integration for **[Nano Stores]**, a tiny state manager
with many atomic tree-shakable stores.

* **Small.** Less than 1 KB with all helpers. Zero dependencies.
* **Fast.** With small atomic and derived stores, you do not need to call
  the selector function for all components on every store change.
* **Tree Shakable.** The chunk contains only stores used by components
  in the chunk.
* **Helpers.** Designed to keep code clean and save a few keystrokes.
* **Devtools.** Plugin with full support of [Vue Devtools].
* Was designed to move logic from components to stores.
* It has good **TypeScript** support.

## Quick start

Install it:

```bash
pnpm add nanostores solid-nanostores # or npm or yarn
```

Use it:

```ts
// store.ts
import { createDerived, createStore, update } from 'nanostores';

export const bearStore = createStore<{ count: number }>(() => {
  bearStore.set({ count: 0 });
});

export const increase = () => {
  update(bearStore, current => ({ count: current.count + 1 }));
};

// Use derived stores to create chains of reactive computations.
export const doubled = createDerived(bearStore, current =>
  current.count * 2,
);
```

```tsx
import { useStore } from 'solid-nanostores';
import { bearStore, increase } from './store';

function BearCounter() {
  const state = useStore(bearStore);
  return <h1>{state.count} around here ...</h1>;
}

function Controls() {
  return <button onClick={increase}>one up</button>;
}
```

For more information about async operations and [server-side rendering](https://github.com/nanostores/nanostores#server-side-rendering), please visit [nanostores' docs](https://github.com/nanostores/nanostores).

## License

MIT
