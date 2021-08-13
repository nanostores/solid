import { createStore } from 'nanostores'
import { createSignal, Show } from 'solid-js'
import { render } from 'solid-js/web'
import { delay } from 'nanodelay'
import { useStore } from '../src/useStore'

it('renders simple store', async () => {
    const events: string[] = []
    
    const letterStore = createStore<{ letter: string }>(() => {
        events.push('constructor')
        letterStore.set({ letter: 'a' })
        return () => {
            events.push('destroy')
        }
    })

    const div = document.createElement('div')
    const [show, setShow] = createSignal(true)

    const dispose = render(() => {
        const store = useStore(letterStore)

        return (
            <div>
                { show() && <div data-testid="test1">{store.letter}</div> }
            </div>
        )
    }, div)
    
    expect(events).toEqual(['constructor'])
    expect(div.querySelector('[data-testid="test1"]').textContent).toBe('a')

    letterStore.set({ letter: 'b' })
    letterStore.set({ letter: 'c' })

    expect(div.querySelector('[data-testid="test1"]').textContent).toBe('c')
    setShow(false)
    expect(div.querySelector('[data-testid="test1"]')).toBeNull()
    dispose()
    await delay(1000)
    
    expect(events).toEqual(['constructor', 'destroy'])
})