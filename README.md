# solid-nanostores

Global state management in Solid using nanostores.

## Quick start

Install it:

```bash
yarn add solid-nanostores
```

Use it:

```ts
// store.ts
import { createStore, createDerived, update } from 'nanostores'

export const bearStore = createStore<{ count: number }>(() => {
  bearStore.set({ count: 0 })
})

export const increase = () => {
  update(bearStore, current => ({ count: current.count + 1 }))
}

// Use derived stores to create chains of reactive computations.
export const doubled = createDerived(bearStore, current =>
  current.count * 2
)
```

```tsx
import { useStore } from 'solid-nanostores'
import { bearStore, increase } from './store'

function BearCounter() {
  const state = useStore(bearStore)
  return <h1>{state.count} around here ...</h1>
}

function Controls() {
  return <button onClick={increase}>one up</button>
}
```

For more information about async operations and [server-side rendering](https://github.com/nanostores/nanostores#server-side-rendering), please visit [nanostores' docs](https://github.com/nanostores/nanostores).

## License

MIT License © 2021 [Robert Soriano](https://github.com/wobsoriano)