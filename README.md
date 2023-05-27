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

[Nano Stores]: https://github.com/nanostores/nanostores

## Quick start

Install it:

```bash
pnpm add nanostores @nanostores/solid # or npm or yarn
```

Use it:

```ts
// store.ts
import { action, atom, computed } from 'nanostores';

export const counter = atom(0);

export const increase = action(counter, 'increase', (store) => {
  counter.set(counter.get() + 1);
});

// Use computed stores to create chains of reactive computations.
export const doubled = computed(counter, current => current.count * 2);
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

## Usage with `@nanostores/router`

```tsx
import { createRouter } from '@nanostores/router';
import { useStore } from '@nanostores/solid';
import { Match, Suspense, Switch, lazy } from 'solid-js';

export const routerStore = createRouter({
  home: '/',
  post: '/posts/:postId',
  comment: '/posts/:postId/comments/:commentId',
});

const Home = lazy(() => import('./pages/Home'));
const Post = lazy(() => import('./pages/Post'));
const Comment = lazy(() => import('./pages/Comment'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function Router() {
  const page = useStore(routerStore);

  return (
    <Switch fallback={<NotFound />}>
      <Match when={page().route === 'home'}>
        <Home />
      </Match>
      <Match when={page().route === 'post'}>
        <Post postId={page().params.postId} />
      </Match>
      <Match when={page().route === 'comment'}>
        <Comment postId={page().params.postId} commentId={page().params.commentId} />
      </Match>
    </Switch>
  );
}
```

## License

MIT
