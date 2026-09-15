'use client'

import { Provider } from 'react-redux'
import { ReactNode, useEffect } from 'react'
import store from './store'
import { preparationsHydrated } from './preparations/preparationsSlice'
import { topicsHydrated } from './topics/topicsSlice'
import { sectionsHydrated } from './sections/sectionsSlice'

type ProvidersProps = {
  children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  useEffect(() => {
    store.dispatch(preparationsHydrated())
    store.dispatch(topicsHydrated())
    store.dispatch(sectionsHydrated())
  }, [])

  return <Provider store={store}>{children}</Provider>
}

export default Providers
