import CustomerAuth from "../../components/CustomerAuth";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#6b1839] to-pink-200 px-4 py-10">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.svg"
            alt="Eventra Logo"
            className="w-20 h-20 mb-4 drop-shadow-lg"
          />
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight text-white drop-shadow-lg text-center">
            Welcome to Eventra
          </h2>
          <p className="text-lg text-white max-w-md mx-auto text-center">
            Sign in to access your personalized wedding dashboard and manage
            your bookings.
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-[#f3e6ef]">
          <CustomerAuth />
        </div>
      </div>
    </div>
  );
}
