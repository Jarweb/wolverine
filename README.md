## wolverine
a lightweight react framework based on react 、redux and middleware

- 约束原则
  - 采用分层原则，职责分离
  - controller 与 view 一一对应，处理相应的业务逻辑
  - redux store 中只维护业务数据实体
  - 视图交互相关的 state 维护在 controller
  - effects 应该维护在相应的 controller
  - 不应该 dispatch 异步 action

- 更多请看这里[关于框架分层设计的思考](https://github.com/Jarweb/thinking-in-deep/issues/21)

## intro

![framework](https://tva1.sinaimg.cn/large/007S8ZIlgy1gft7scoeu0j31at0u0ae4.jpg)

- model
	- reducers：维护与服务端一致的数据实体
- controller
	- controller：是一个自定义 hook，无需考虑复用，因为 controller 与 view 一一对应
	- event binding
	- hook
	- effect
	- dispatch sync action
	- store selector
- view
	- 与 controller 一一对应，保持 view 的简单性
- application
	- router config
	- redux config
	- app life cycle
	- middlewares：支持同步或异步中间件。
		- jsb sdk
		- report sdk
		- error sdk
		- perf sdk
		- ...
- fetch controller：缓存，http 规范，错误处理等
	- middleware
		- fetch error
		- before fetch
		- after fetch
	- sw fetch cache
- base
	- hooks：通用 hook
	- components：通用组件
	- middleware plugins



## install

```
yarn add @jarzzzi/wolverine
```

## quick start

[demo]('./example')

- index

```javascript
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

```javascript
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

```javascript
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

  const onFetch = async () => {
    setLoading(true)
    const res = await fetch('xxx')
    setLoading(false)
    dispatch({
      type: 'counter/fetch',
      payload: res
    })
  }

  const onReport = async () => {
    appContext.ready('reporter').then((reporter) => {
      reporter.push()
    })
  }

  return {
    count,
    onInc,
    onDec,
    onFetch,
    onReport
  }
}
```

- view

```javascript
export default React.memo((props) => {
  const {
    count,
    onDec,
    onInc,
    onFetch,
    onReport,
  } = useController(props)

  return (
    <div>
      <div>{count}</div>
      <div><button onClick={onInc}>inc</button></div>
      <div><button onClick={onDec}>dec</button></div>
      <div><button onClick={onFetch}>fetch</button></div>
      <div><button onClick={onReport}>report</button></div>
    </div>
  )
})
```

## next

- immutable data