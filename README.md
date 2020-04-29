## wolverine
a lightweight react framework based on react, redux

- 约束原则
  - 不应该 dispatch 异步 action，所有 fetch effect 应该维护在对应的 controller 中
  - controller 与 view 一一对应，处理业务逻辑
  - redux store 中只维护业务数据实体
  - 与视图交互相关的 state 维护在 controller

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
- base
	- hooks
	- components
	- middleware plugins



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
    },
    fetch(state, {payload: count}) {
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
  const [loading, setLoading] = useState(false)
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

  const onFetch = () => {
    setLoading(true)
    const res = await fetch('xxx')
    setLoading(false)
    dispatch({
      type: 'counter/fetch',
      payload: res
    })
  }

  return {
    count,
    onInc,
    onDec,
  }
}
```

- view

```
export default React.memo((props) => {
  const {
    count,
    onDec,
    onInc,
    onFetch,
  } = useController(props)

  return (
    <div>
      <div>{count}</div>
      <div><button onClick={onInc}>inc</button></div>
      <div><button onClick={onDec}>dec</button></div>
      <div><button onClick={onFetch}>fetch</button></div>
    </div>
  )
})
```

## next

- immutable data