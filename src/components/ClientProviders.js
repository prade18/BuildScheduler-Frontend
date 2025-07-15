'use client'

import { Provider } from 'react-redux'
import { store } from '../redux/store'
import ClientLayout from './ClientLayout'

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <ClientLayout>{children}</ClientLayout>
    </Provider>
  )
}
