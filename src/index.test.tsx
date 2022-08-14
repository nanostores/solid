import { STORE_UNMOUNT_DELAY, atom, map, mapTemplate, onMount as onMountStore } from 'nanostores';
import { cleanup, render, screen } from 'solid-testing-library';
import { afterEach, expect, it } from 'vitest';
import { delay } from 'nanodelay';

import { Match, Show, Switch, createMemo, createSignal } from 'solid-js';
import { useStore } from '.';

afterEach(() => {
  cleanup();
});

it('renders simple store', async() => {
  const events: string[] = [];
  let renders = 0;

  const letterStore = atom<string>('');

  onMountStore(letterStore, () => {
    events.push('constructor');
    letterStore.set('a');
    return () => {
      events.push('destroy');
    };
  });

  const Test1 = () => {
    const store = useStore(letterStore);
    renders += 1;
    return (
      <div data-testid="test1">{store()}</div>
    );
  };

  const Test2 = () => {
    const store = useStore(letterStore);

    return (
      <div data-testid="test2">{store()}</div>
    );
  };

  const Wrapper = () => {
    const [show, setShow] = createSignal(true);

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
    );
  };

  render(() => <Wrapper />);
  expect(events).toEqual(['constructor']);
  expect(screen.getByTestId('test1')).toHaveTextContent('a');
  expect(screen.getByTestId('test2')).toHaveTextContent('a');
  expect(renders).toBe(1);

  letterStore.set('b');
  letterStore.set('c');

  expect(screen.getByTestId('test1')).toHaveTextContent('c');
  expect(screen.getByTestId('test2')).toHaveTextContent('c');
  expect(renders).toBe(1);

  screen.getByRole('button').click();

  expect(screen.queryByTestId('test')).not.toBeInTheDocument();
  expect(renders).toBe(1);
  await delay(STORE_UNMOUNT_DELAY);

  expect(events).toEqual(['constructor', 'destroy']);
});

it('renders map store', async() => {
  const events: string[] = [];
  let renders = 0;

  const nameStore = map<{ first: string; last: string }>();

  onMountStore(nameStore, () => {
    events.push('constructor');
    nameStore.setKey('first', 'Aleister');
    nameStore.setKey('last', 'Crowley');
    return () => {
      events.push('destroy');
    };
  });

  const Wrapper = () => {
    const store = useStore(nameStore);

    renders += 1;

    return (
      <div data-testid="test">{store().first} {store().last}</div>
    );
  };

  render(Wrapper);
  expect(events).toEqual(['constructor']);
  expect(screen.getByTestId('test')).toHaveTextContent('Aleister Crowley');
  expect(renders).toBe(1);

  nameStore.setKey('first', 'Anton');
  nameStore.setKey('last', 'Lavey');

  expect(screen.getByTestId('test')).toHaveTextContent('Anton Lavey');
  expect(renders).toBe(1);
});

it('does not reload store on component changes', async() => {
  let destroyed = '';
  const simple = atom<string>('');

  onMountStore(simple, () => {
    simple.set('S');
    return () => {
      destroyed += 'S';
    };
  });

  const Map = mapTemplate<{ id: string }>((_store, id) => {
    return () => {
      destroyed += id;
    };
  });

  const TestA = () => {
    const simpleStore = useStore(simple);
    const mapStore = useStore(Map('M'));
    const text = createMemo(() => `1 ${simpleStore()} ${mapStore().id}`);
    return (
      <div data-testid="test">{text()}</div>
    );
  };

  const TestB = () => {
    const simpleStore = useStore(simple);
    const mapStore = useStore(Map('M'));
    const text = createMemo(() => `2 ${simpleStore()} ${mapStore().id}`);
    return (
      <div data-testid="test">{text()}</div>
    );
  };

  const Switcher = () => {
    const [state, setState] = createSignal('a');

    return (
      <Switch fallback={null}>
        <Match when={state() === 'a'}>
          <div>
            <button onClick={() => setState('b')}></button>
            <TestA />
          </div>
        </Match>
        <Match when={state() === 'b'}>
          <div>
            <button onClick={() => setState('none')}></button>
            <TestB />
          </div>
        </Match>
      </Switch>
    );
  };

  render(Switcher);
  expect(screen.getByTestId('test')).toHaveTextContent('1 S M');

  screen.getByRole('button').click();
  expect(screen.getByTestId('test')).toHaveTextContent('2 S M');
  expect(destroyed).toBe('');

  screen.getByRole('button').click();

  expect(screen.queryByTestId('test')).not.toBeInTheDocument();
  expect(destroyed).toBe('');

  await delay(STORE_UNMOUNT_DELAY);
  expect(destroyed).toBe('SM');
});
