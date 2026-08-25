import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '观势',
  description: '以易经卦象观察当下处境与下一步行动姿态。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
