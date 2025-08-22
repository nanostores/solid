import { STORE_UNMOUNT_DELAY, atom, map, onMount as onMountStore } from 'nanostores'
import { cleanup, render, screen } from '@solidjs/testing-library'
import { afterEach, expect, it } from 'vitest'
import { delay } from 'nanodelay'

import { For, Match, Show, Switch, createMemo, createSignal } from 'solid-js'
import { useStore } from './'

afterEach(() => {
  cleanup()
})

it('renders simple store', async () => {
  const events: string[] = []
  let renders = 0

  const letterStore = atom<string>('')

  onMountStore(letterStore, () => {
    events.push('constructor')
    letterStore.set('a')
    return () => {
      events.push('destroy')
    }
  })

  const Test1 = () => {
    const store = useStore(letterStore)
    renders += 1
    return <div data-testid="test1">{store()}</div>
  }

  const Test2 = () => {
    const store = useStore(letterStore)

    return <div data-testid="test2">{store()}</div>
  }

  const Wrapper = () => {
    const [show, setShow] = createSignal(true)

    return (
      <div>
        <button onClick={() => setShow(prev => !prev)}>Show</button>
        <Show when={show()}>
          <Test1 />
        </Show>
        <Show when={show()}>
          <Test2 />
        </Show>
      </div>
    )
  }

  render(() => <Wrapper />)
  expect(events).toEqual(['constructor'])
  expect(screen.getByTestId('test1')).toHaveTextContent('a')
  expect(screen.getByTestId('test2')).toHaveTextContent('a')
  expect(renders).toBe(1)

  letterStore.set('b')
  letterStore.set('c')

  expect(screen.getByTestId('test1')).toHaveTextContent('c')
  expect(screen.getByTestId('test2')).toHaveTextContent('c')
  expect(renders).toBe(1)

  screen.getByRole('button').click()

  expect(screen.queryByTestId('test')).not.toBeInTheDocument()
  expect(renders).toBe(1)
  await delay(STORE_UNMOUNT_DELAY)

  expect(events).toEqual(['constructor', 'destroy'])
})

it('renders map store', async () => {
  const events: string[] = []
  let renders = 0

  const nameStore = map<{ first: string; last: string }>()

  onMountStore(nameStore, () => {
    events.push('constructor')
    nameStore.setKey('first', 'Aleister')
    nameStore.setKey('last', 'Crowley')
    return () => {
      events.push('destroy')
    }
  })

  const Wrapper = () => {
    const store = useStore(nameStore)

    renders += 1

    return (
      <div data-testid="test">
        {store().first} {store().last}
      </div>
    )
  }

  render(Wrapper)
  expect(events).toEqual(['constructor'])
  expect(screen.getByTestId('test')).toHaveTextContent('Aleister Crowley')
  expect(renders).toBe(1)

  nameStore.setKey('first', 'Anton')
  nameStore.setKey('last', 'Lavey')

  expect(screen.getByTestId('test')).toHaveTextContent('Anton Lavey')
  expect(renders).toBe(1)
})

it('renders array store - items with "id" key', async () => {
  const events: string[] = []
  let renders = 0

  const listStore = atom<{ id: number; name: string }[]>([])

  onMountStore(listStore, () => {
    events.push('constructor')
    listStore.set([
      { id: 1, name: 'apple' },
      { id: 2, name: 'banana' },
      { id: 3, name: 'orange' },
    ])
    return () => {
      events.push('destroy')
    }
  })

  const Wrapper = () => {
    const list = useStore(listStore)

    renders += 1

    return (
      <div data-testid="test">
        <For each={list()}>
          {item => (
            <div data-testid="test-item">
              {item.id} {item.name}
            </div>
          )}
        </For>
      </div>
    )
  }

  render(Wrapper)
  expect(events).toEqual(['constructor'])
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '1 apple',
    '2 banana',
    '3 orange',
  ])
  expect(renders).toBe(1)

  // push an item
  listStore.set([...listStore.get(), { id: 4, name: 'grape' }])
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '1 apple',
    '2 banana',
    '3 orange',
    '4 grape',
  ])

  // reverse
  listStore.set(listStore.get().toReversed())
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '4 grape',
    '3 orange',
    '2 banana',
    '1 apple',
  ])

  // sort
  listStore.set(listStore.get().toSorted((a, b) => a.name.localeCompare(b.name, 'en')))
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '1 apple',
    '2 banana',
    '4 grape',
    '3 orange',
  ])

  expect(renders).toBe(1)
})

it('renders array store - items with other key property', async () => {
  const events: string[] = []
  let renders = 0

  const listStore = atom<{ itemId: number; name: string }[]>([])

  onMountStore(listStore, () => {
    events.push('constructor')
    listStore.set([
      { itemId: 1, name: 'apple' },
      { itemId: 2, name: 'banana' },
      { itemId: 3, name: 'orange' },
    ])
    return () => {
      events.push('destroy')
    }
  })

  const Wrapper = () => {
    const list = useStore(listStore, { key: 'itemId' })

    renders += 1

    return (
      <div data-testid="test">
        <For each={list()}>
          {item => (
            <div data-testid="test-item">
              {item.itemId} {item.name}
            </div>
          )}
        </For>
      </div>
    )
  }

  render(Wrapper)
  expect(events).toEqual(['constructor'])
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '1 apple',
    '2 banana',
    '3 orange',
  ])
  expect(renders).toBe(1)

  // push an item
  listStore.set([...listStore.get(), { itemId: 4, name: 'grape' }])
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '1 apple',
    '2 banana',
    '3 orange',
    '4 grape',
  ])

  // reverse
  listStore.set(listStore.get().toReversed())
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '4 grape',
    '3 orange',
    '2 banana',
    '1 apple',
  ])

  // sort
  listStore.set(listStore.get().toSorted((a, b) => a.name.localeCompare(b.name, 'en')))
  expect(screen.getAllByTestId('test-item').map(item => item.textContent)).toEqual([
    '1 apple',
    '2 banana',
    '4 grape',
    '3 orange',
  ])
  expect(renders).toBe(1)
})

it('does not reload store on component changes', async () => {
  let destroyed = ''
  const simple = atom<string>('')

  onMountStore(simple, () => {
    simple.set('S')
    return () => {
      destroyed += 'S'
    }
  })

  const TestA = () => {
    const simpleStore = useStore(simple)
    const text = createMemo(() => `1 ${simpleStore()}`)
    return <div data-testid="test">{text()}</div>
  }

  const TestB = () => {
    const simpleStore = useStore(simple)
    const text = createMemo(() => `2 ${simpleStore()}`)
    return <div data-testid="test">{text()}</div>
  }

  const Switcher = () => {
    const [state, setState] = createSignal('a')

    return (
      <Switch fallback={null}>
        <Match when={state() === 'a'}>
          <div>
            <button onClick={() => setState('b')} />
            <TestA />
          </div>
        </Match>
        <Match when={state() === 'b'}>
          <div>
            <button onClick={() => setState('none')} />
            <TestB />
          </div>
        </Match>
      </Switch>
    )
  }

  render(Switcher)
  expect(screen.getByTestId('test')).toHaveTextContent('1 S')

  screen.getByRole('button').click()
  expect(screen.getByTestId('test')).toHaveTextContent('2 S')
  expect(destroyed).toBe('')

  screen.getByRole('button').click()

  expect(screen.queryByTestId('test')).not.toBeInTheDocument()
  expect(destroyed).toBe('')

  await delay(STORE_UNMOUNT_DELAY)
  expect(destroyed).toBe('S')
})
