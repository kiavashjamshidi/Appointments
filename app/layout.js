// app/layout.js
import './globals.css'

export const metadata = {
    title: 'Vocare App',
    description: 'Fullstack challenge',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  