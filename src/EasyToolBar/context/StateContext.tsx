import React, { createContext, useCallback, useState } from 'react'

export interface SearchStateType {
  [key: string]: any
}

export const StateContext = createContext<{
  searchState: SearchStateType
  setSearchState: (searchState: SearchStateType) => void
  containerState: any
  setContainerState: (containerState: any) => void
} | null>(null)

const StateProvider: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const [containerState, setContainerState] = useState({
    show: false,
    field: '',
    container: () => {},
  })
  const [searchState, _setSearchState] = useState({})
  const setSearchState = useCallback((state: SearchStateType) => {
    _setSearchState(state)
  }, [])

  return (
    // FIXME: 修复类型报错
    <StateContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        searchState,
        setSearchState,
        containerState,
        setContainerState,
      }}
    >
      {props.children}
    </StateContext.Provider>
  )
}

export default StateProvider
