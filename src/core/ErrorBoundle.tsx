import { PureComponent} from 'react'

interface ErrorProps {
  onCatch: (err: any) => void
}

export default class ErrorBoundary extends PureComponent<ErrorProps> {
  public componentDidCatch(err: any) {
    this.props.onCatch(err)
  }

  public render() {
    return this.props.children
  }
}