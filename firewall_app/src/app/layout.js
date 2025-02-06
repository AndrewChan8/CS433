import './globals.css';
import Navbar from "./components/navbar/Navbar.js"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
