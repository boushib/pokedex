import './AppBar.sass'

interface Props {
  children: React.ReactNode
}

const AppBar = ({ children }: Props) => (
  <div className="app-bar">{children}</div>
)

export default AppBar
