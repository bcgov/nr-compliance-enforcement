import { FC } from 'react'

interface Props {
  environmentName: string
}

const EnvironmentBanner: FC<Props> = ({ environmentName }) => {
  return (
    <div className="environment-banner">
      This is a {environmentName} environment: data entered here could be lost.
    </div>
  )
}

export default EnvironmentBanner
