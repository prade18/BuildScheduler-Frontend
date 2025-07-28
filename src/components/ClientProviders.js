// 'use client'

// import { Provider } from 'react-redux'
// import { store } from '../redux/store'
// import ClientLayout from './ClientLayout'

// export default function ClientProviders({ children }) {
//   return (
//     <Provider store={store}>
//       <ClientLayout>{children}</ClientLayout>
//     </Provider>
//   )
// }

// src/components/ClientProviders.js
'use client'; // This component must be a client component

import { Provider } from 'react-redux';
import { store } from '@/redux/store'; // Adjust this path if your store.js is elsewhere

export default function ClientProviders({ children }) {
  return (
    // Wrap your children with the Redux Provider
    <Provider store={store}>
      {children}
    </Provider>
    // If you have other client-side providers (e.g., ThemeProvider, QueryClientProvider),
    // you would nest them here:
    /*
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
    */
  );
}