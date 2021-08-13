# solid-nanostores

{{ desc_of_lib }}

## Quick start

Install it:

```bash
yarn add solid-nanostores
```

Use it:

```ts
// store.ts
export const bearStore = createStore<{ count: number }>(() => {
  bearStore.set({ count: 0 })
})

export const increase = () => {
  update(bearStore, prev => ({ count: prev.count + 1 }))
}
```

```tsx
import { createStore, update } from 'nanostores'
import { useStore } from 'solid-nanostores'
import { bearStore, increase } from './store'

function BearCounter() {
  const state = useStore(bearStore)
  return <h1>{state.bears.count} around here ...</h1>
}

function Controls() {
  return <button onClick={increase}>one up</button>
}
```

For more information about async operations and server-side rendering, please visite [nanostores' docs](https://github.com/nanostores/nanostores).
