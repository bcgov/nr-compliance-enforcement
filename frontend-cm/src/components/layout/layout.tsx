import { FC } from 'react'
import { Header } from './header'
import { SideBar } from './sidebar'
import './_styles.scss'

type Props = {
  children: React.ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <div className="body-container">
        <SideBar />
        <div className="main-content">{children}</div>
      </div>
    </div>
  )
}
