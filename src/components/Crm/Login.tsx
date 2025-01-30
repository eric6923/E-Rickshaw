import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";

interface Credentials {
  email: string;
  password: string;
}

export default function CrmLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://totem-consultancy-beta.vercel.app/api/auth/adminlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("crmAuthenticated", "true");
        localStorage.setItem("userRole", "admin");
        navigate("/crm/dashboard");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCredentials = (): Credentials => ({
    email: "totemmanagement@gmail.com",
    password: "Totem@123"
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
        <div className="relative w-full flex flex-col items-center justify-center p-12 text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to Vaishali Traders</h1>
          <p className="text-xl text-blue-100 max-w-md text-center">
            Access your dashboard to manage tasks, track progress, and grow your business.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg mb-8">
              <LogIn className="w-10 h-10 text-white transform -rotate-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Login to Dashboard
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg animate-shake" role="alert">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3.5 rounded-xl text-gray-900 dark:text-white
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder-gray-400 dark:placeholder-gray-500
                    transition duration-200 ease-in-out
                    hover:border-blue-400 dark:hover:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 rounded-xl text-gray-900 dark:text-white
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder-gray-400 dark:placeholder-gray-500
                      transition duration-200 ease-in-out
                      hover:border-blue-400 dark:hover:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                      focus:outline-none transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                rounded-xl shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transform transition-all duration-200 ease-out
                hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Sign in to Dashboard</span>
              )}
            </button>

            {/* Sample Credentials Card */}
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Sample Admin Credentials
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  Demo Only
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 w-20">Email:</span>
                  <code className="font-mono text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded">
                    {getCredentials().email}
                  </code>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 w-20">Password:</span>
                  <code className="font-mono text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded">
                    {getCredentials().password}
                  </code>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}