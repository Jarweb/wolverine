## wolverine
a lightweight react framework based on react, redux


## intro

![framework](/shotcut/framework.jpg)

- model
	- reducers
- fetch controller
	- middleware
		- fetch error
		- before fetch
		- after fetch
	- sw fetch cache
- controller
	- controller is the custom hook
	- event binding
	- hook
	- effect
	- dispatch sync action
	- store selector
- view
	- mapping to controller, keep view simple
- application
	- router config
	- redux config
	- app life cycle
	- middlewares
		- error middleware
		- report sdk
		- jsb sdk
		- perf sdk
		- ...



## install

```
yarn add @jarzzzi/wolverine
```

## quick start

- [demo]('./example')

- index.tsx
```
const app = new Wolverine({
  appMode: 'spa',
  routerMode: 'hashRouter'
})
app.configReducers(reducers)
app.configRoutes(routes)

app.onError((error, ctx) => {
  console.log('app error', error)
})

app.onDidmount((ctx) => {
  console.log('app didmount', ctx)

  const handle = (state: any) => {
    console.log('route change', state)
  }
  const cleanup = ctx.on('routeChange', handle)

  return () => {
    cleanup()
  }
})

app.onUnmount((ctx) => {
  console.log('app unmount', ctx)
})

app.use((ctx) => {
  return import(
    './plugins/reportsdk'
  ).then(({ default: reporter }) => {
    ctx.reporter = reporter
    return () => {
      console.log('cleanup reporter')
    }
  })
})

app.render(document.getElementById('root'))
```

- reducer

```
export default createModel({
  namespace: 'counter',
  state: {
    count: 0
  },
  reducers: {
    inc(state, { payload: count }) {
      return {
        ...state,
        count: count
      }
    },
    dec(state, {payload: count}) {
      return {
        ...state,
        count: count
      }
    }
  },
})
```

- controller

```
export default function useController (props) {
  const dispatch = useDispatch()

  const { count } = useSelector((store) => {
    const { counter } = store

    return {
      count: counter.count
    }
  })

  const onInc = () => {
    dispatch({
      type: 'counter/inc',
      payload: count + 1
    })
  }

  const onDec = () => {
    dispatch({
      type: 'counter/dec',
      payload: count - 1
    })
  }

  return {
    count,
    onInc,
    onDec,
  }
}
```

## next

- immutable data