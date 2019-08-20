import { useEffect } from 'react'

export type TMapKeyPress = {
  [key: string]: (props: any) => void,
}

export const mapKeyPress = <P extends {}>() => (props: P) => {
  useEffect(() => {
    const onKeyPress = () => {}

    window.addEventListener('keypress', onKeyPress)

    return () => {
      window.removeEventListener('keypress', onKeyPress)
    }
  }, [])

  return props
}
