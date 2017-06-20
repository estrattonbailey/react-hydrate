import Tap from './lib/Tap.js'
import _store from './lib/store.js'
import hydrate from './lib/hydrate.js'

const { setState, getLoaders, addLoader, ...store } = _store

export {
  Tap,
  hydrate,
  store
}
