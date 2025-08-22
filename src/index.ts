import type { Store, StoreValue } from 'nanostores'
import { createStore, reconcile, ReconcileOptions } from 'solid-js/store'
import type { Accessor } from 'solid-js'
import { onCleanup } from 'solid-js'

type UseStoreOptions = ReconcileOptions

/**
 * Subscribes to store changes and gets store’s value.
 *
 * @param store Store instance.
 * @returns Store value.
 */
export function useStore<SomeStore extends Store, Value extends StoreValue<SomeStore>>(
  store: SomeStore,
  options: UseStoreOptions = {},
): Accessor<Value> {
  // Activate the store explicitly:
  // https://github.com/nanostores/solid/issues/19
  const unbindActivation = store.listen(() => {})

  const [state, setState] = createStore({
    value: store.get(),
  })

  const unsubscribe = store.subscribe(newValue => {
    // Specify the key for reconciliation to match items in array store.
    setState('value', reconcile(newValue, options))
  })

  onCleanup(() => unsubscribe())

  // Remove temporary listener now that there is already a proper subscriber.
  unbindActivation()

  return () => state.value
}
