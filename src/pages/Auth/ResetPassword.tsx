import { useState } from "react";
import { Link } from "react-router";
import expertedgeLogo from "../../asset/expertedgeLogo.jpg";

export default function ResetPassword() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showPass, setShowPass] = useState({
    password: false,
    confirmPassword: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: { password?: string; confirmPassword?: string } = {};

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_rgba(13,23,52,0.08)] sm:p-8">
        <Link to="/" className="inline-block mb-6">
          <img
            src={expertedgeLogo}
            alt="ExpertEdge Academy"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-blue">
            Secure access
          </p>
          <h1 className="mt-3 font-display text-3xl font-black text-charcoal">
            Set a new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Choose a new password for your account. Make it strong and
            memorable.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-success/20 bg-success/10 p-4 text-sm text-success">
              Your password has been reset successfully.
            </div>
            <Link
              to="/login"
              className="block w-full rounded-xl bg-primary-blue px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-deep-blue"
            >
              Continue to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPass.password ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, password: e.target.value }));
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="At least 8 characters"
                  className={`w-full rounded-xl border-2 bg-white px-4 py-3 pr-12 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none ${
                    errors.password
                      ? "border-error"
                      : "border-neutral-300 focus:border-primary-blue"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPass((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass.password ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showPass.confirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }}
                  placeholder="Re-enter your password"
                  className={`w-full rounded-xl border-2 bg-white px-4 py-3 pr-12 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none ${
                    errors.confirmPassword
                      ? "border-error"
                      : "border-neutral-300 focus:border-primary-blue"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPass((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass.confirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary-blue px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-deep-blue"
            >
              Reset password
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Need help?{" "}
          <Link
            to="/login"
            className="font-semibold text-charcoal hover:text-primary-blue"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
