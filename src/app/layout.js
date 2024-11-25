import ThemeProvider from './ThemeProvider';
import "./globals.css";

export const metadata = {
  title: "Theatre Booking System",
  description: "Book your theatre seats online",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
