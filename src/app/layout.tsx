import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MCP OAuth Gateway',
  description: 'Connect MCP clients to your MCP OAuth Server!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
