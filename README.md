# Nano Store Solid

<img align="right" width="92" height="92" title="Nano Stores logo"
     src="https://nanostores.github.io/nanostores/logo.svg">

Solid integration for **[Nano Stores]**, a tiny state manager
with many atomic tree-shakable stores.

* **Small.** Less than 1 KB with all helpers. Zero dependencies.
* **Fast.** With small atomic and derived stores, you do not need to call
  the selector function for all components on every store change.
* **Tree Shakable.** The chunk contains only stores used by components
  in the chunk.
* **Helpers.** Designed to keep code clean and save a few keystrokes.
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
import { action, atom, computed } from 'nanostores';

export const bearStore = atom({ value: 0 });

export const increase = action(bearStore, 'increase', (store) => {
  store.set({ value: store.get().value + 1 });
});

// Use computed stores to create chains of reactive computations.
export const doubled = computed(bearStore, current =>
  current.count * 2,
);
```

```tsx
import { createStore } from 'solid-nanostores';
import { bearStore, increase } from './store';

function BearCounter() {
  const count = createStore(bearStore);
  return <h1>{count().value} around here ...</h1>;
}

function Controls() {
  return <button onClick={increase}>one up</button>;
}
```

## Server-Side Rendering

Nano Stores support SSR. Use standard strategies.

```ts
import { isServer } from 'solid-js/web';

if (isServer) {
  settings.set(initialSettings);
  router.open(renderingPageURL);
}
```

You can wait for async operations (for instance, data loading via isomorphic `fetch()`) before rendering the page:

```tsx
import { renderToString } from 'solid-js/web';
import { allTasks } from 'nanostores';

post.listen(() => {}); // Move store to active mode to start data loading
await allTasks();

const html = renderToString(<App />);
```

## License

MIT
