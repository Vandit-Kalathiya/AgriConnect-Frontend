import { useState, useEffect, useRef } from "react";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";

const OtpVerification = ({
  onSubmit,
  onBack,
  buttonText,
  isFromLogin,
  error,
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      handleSubmit();
    }
  }, [otp, isLoading]);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(otp);
    } catch (err) {
      toast.error("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      setOtp("");
      toast.success("OTP resent successfully!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading && otp.length === 6) {
      handleSubmit();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-medium text-[#275434] mb-2">
          OTP Verification
        </h3>
        <p className="text-sm text-gray-600">
          {isFromLogin
            ? "Enter the OTP sent to your registered phone number"
            : "Enter the OTP sent to your phone number to complete registration"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-[#275434] mb-3 font-medium">
          Enter 6-Digit OTP
        </label>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span className="w-2"></span>}
          renderInput={(props, index) => (
            <input
              {...props}
              disabled={isLoading}
              onKeyDown={handleKeyDown}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className={`w-[48px] h-[48px] px-3 py-2 border rounded-md text-center text-lg font-semibold focus:outline-none focus:ring-2 transition duration-200 ${
                isLoading
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white focus:ring-[#45a25e] border-gray-300"
              }`}
            />
          )}
          containerStyle={{
            justifyContent: "space-between",
            gap: "0 6px",
          }}
          shouldAutoFocus
          inputType="tel"
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {!canResend ? (
              <span>
                Resend OTP in{" "}
                <span className="font-semibold text-[#45a25e]">
                  {formatTime(timer)}
                </span>
              </span>
            ) : (
              <button
                onClick={handleResendOTP}
                className="text-[#45a25e] font-medium hover:text-[#34854a] transition duration-200 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">{otp.length}/6</div>
        </div>
      </div>

      <button
        className={`w-full py-3 rounded-md transition duration-200 mb-3 font-medium flex items-center justify-center ${
          isLoading || otp.length !== 6
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#45a25e] text-white hover:bg-[#34854a]"
        }`}
        onClick={handleSubmit}
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? (
          <>
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
            Verifying...
          </>
        ) : (
          buttonText
        )}
      </button>

      <button
        className="w-full bg-white text-[#34854a] border border-[#45a25e] py-3 rounded-md hover:bg-[#e3f5e7] transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onBack}
        disabled={isLoading}
      >
        Back
      </button>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm text-blue-700 font-medium mb-1">
              Didn't receive OTP?
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Check your phone for SMS messages</li>
              <li>• Wait for the timer to expire and resend</li>
              <li>• Ensure you entered the correct phone number</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
