export const metadata = {
  title: 'Kyro Studio',
  description: 'Content management for Kyro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
