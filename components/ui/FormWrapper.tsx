import ConfettiBackground from "./ConfettiBackground";

export default function FormWrapper({
  children,
  title,
  description,
  showConfetti = false,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showConfetti?: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {showConfetti && <ConfettiBackground />}

      <div className="relative z-10 max-w-md w-full rounded-2xl p-6 shadow-xl border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-blue-50">
        {title && (
          <h1 className="text-3xl font-bold text-pink-600 text-center mb-2">{title}</h1>
        )}
        {description && (
          <p className="text-sm text-gray-600 text-center mb-6">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
