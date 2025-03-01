import { useState } from "react";
import OtpInput from "react-otp-input";

const OtpVerification = ({
  onSubmit,
  onBack,
  buttonText,
  isFromLogin,
  error,
}) => {
  const [otp, setOtp] = useState("");

  return (
    <div>
      <h3 className="text-xl font-medium text-[#275434] mb-4">Verification</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-6">
        <label className="block text-[#275434] mb-2 font-medium">
          Enter OTP
        </label>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span className="w-2"></span>}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-[48px] px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
            />
          )}
          containerStyle={{
            justifyContent: "space-between",
            gap: "0 6px",
          }}
        />
      </div>
      <button
        className="w-full bg-[#45a25e] text-white py-3 rounded-md hover:bg-[#34854a] transition duration-200 mb-3 font-medium"
        onClick={() => onSubmit(otp)}
      >
        {buttonText}
      </button>
      <button
        className="w-full bg-white text-[#34854a] border border-[#45a25e] py-3 rounded-md hover:bg-[#e3f5e7] transition duration-200"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
};

export default OtpVerification;
