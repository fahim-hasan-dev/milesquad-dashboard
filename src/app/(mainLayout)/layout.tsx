export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[480px]">
        {children}
      </div>
    </div>
  );
}
