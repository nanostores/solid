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
interface BearStore {
  bears: {
      count: number
  }
}

export const bearStore = createStore<BearStore>(() => {
  bearStore.set({ bears: { count: 0 } })
})

export function increase() {
  update(bearStore, current => ({ bears: { count: current.bears.count + 1 } }))
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
