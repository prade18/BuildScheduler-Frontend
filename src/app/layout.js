import './globals.css'
import ClientProviders from '../components/ClientProviders'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'BuildScheduler',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Navbar /> {/* ✅ Logic handled inside Navbar now */}
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}




