import walker from 'react-tree-walker'

const asyncRender = root => (
  walker(
    root,
    (el, instance, context) => (
      instance && instance.resolver ? instance.resolver : true
    )
  )
)

export {
  asyncRender
}

export default asyncRender
