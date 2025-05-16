import "./globals.css";


export const metadata = {
  title: "GridTactix",
  description: "A board game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
