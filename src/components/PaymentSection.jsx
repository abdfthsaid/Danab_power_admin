import axios from "axios";
import React, { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import ProcessingModal from "./ProcessingModal";

const PaymentSection = ({ selectedAmount, selectedMethod, selectMethod }) => {
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");
  const [batteryInfo, setBatteryInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🛡️ Prevent double-click

  const [phone, setPhone] = useState("");
  const [agree1, setAgree1] = useState(true);

  const [errors, setErrors] = useState({});

  const handlePayment = async () => {
    // 🛡️ PREVENT DOUBLE-CLICK
    if (isSubmitting) {
      console.log("⚠️ Payment already in progress, ignoring click");
      return;
    }
    setIsSubmitting(true);
    const number = phone;
    const amount = parseFloat(selectedAmount.replace("$", ""));
    let isSuccess = false;

    try {
      const res = await axios.post(
        "https://phase2backeend-1.onrender.com/api/pay/58",
        {
          phoneNumber: number,
          amount: amount,
        },
        {
          validateStatus: () => true, // Prevent axios from throwing error on 400/500
        },
      );

      const data = res.data;

      if (res.status === 200 && data.success === true) {
        setProcessingStatus("success");
        setBatteryInfo({ battery_id: data.battery_id, slot_id: data.slot_id });
        isSuccess = true;
      } else if (data.error) {
        // Handle backend error messages
        setProcessingStatus("failed");
        const errorMsg = data.error;

        // Detect specific error types from message
        if (errorMsg.includes("No available battery")) {
          setReason("NO_BATTERY_AVAILABLE");
          setErrorMessage(
            "Ma jiro baytari diyaar ah hadda, fadlan mar kale isku day",
          );
        } else if (errorMsg.includes("already have an active rental")) {
          setReason("ALREADY_RENTED");
          setErrorMessage(
            "Waxaad hore u haysataa battery, fadlan soo celi midkaas ka hor intaadan mid kale kireysanin",
          );
        } else if (errorMsg.includes("battery is already rented")) {
          setReason("BATTERY_TAKEN");
          setErrorMessage(
            "Battery-gan waa la kireystay, fadlan mar kale isku day",
          );
        } else if (errorMsg.includes("blocked from renting")) {
          setReason("BLACKLISTED");
          setErrorMessage(
            "Waa lagaa mamnuucay kireysiga. Fadlan la xiriir taageerada.",
          );
        } else if (errorMsg.includes("Payment not approved")) {
          setReason("PAYMENT_FAILED");
          setErrorMessage("Lacag bixinta ma dhicin, fadlan hubi numberkaaga");
        } else {
          setReason("PAYMENT_FAILED");
          setErrorMessage(errorMsg);
        }
      } else {
        // Fallback for other error cases
        setProcessingStatus("failed");
        setReason("unknown_error");
        setErrorMessage("Khalad dhacay, fadlan mar kale isku day");
      }
      // 🛡️ Reset isSubmitting for failed payments (allow retry)
      if (!isSuccess) {
        setIsSubmitting(false);
      }
    } catch (err) {
      // Catch block will rarely be triggered now unless there is a network failure
      setProcessingStatus("failed");
      setReason("network_error");
      setErrorMessage("Network error, please try again.");
      setIsSubmitting(false); // 🛡️ Reset on error
    }

    if (isSuccess) {
      setTimeout(() => {
        setShowProcessing(false);
        setProcessingStatus("processing");
        setReason("");
        setErrorMessage("");
        setBatteryInfo(null);
        setPhone("");
        setAgree1(false);
        setIsSubmitting(false); // 🛡️ Reset on success

        setErrors({});
        selectMethod(null);
      }, 3000);
    }
  };

  const isActiveMethod = (method) => selectedMethod === method;

  const validate = () => {
    const newErrors = {};
    if (!phone || phone.length < 7) {
      newErrors.phone = "Fadlan gali number sax ah (ugu yaraan 7 digit)";
    }
    if (!agree1) {
      newErrors.agree1 = "Fadlan ogolow shuruudaha koowaad";
    }

    return newErrors;
  };

  const getplaceholders_Input = () => {
    if (selectedMethod === "EVC Plus") return "61 xxxxx";
    if (selectedMethod === "ZAAD") return "63 xxxxx";
    if (selectedMethod === "SAHAL") return "37 xxxxx";
    return "Telefoon Numberka";
  };

  const handlePay = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setShowProcessing(true);
      setProcessingStatus("processing");
      handlePayment();
    }
  };

  return (
    <>
      {showProcessing && (
        <ProcessingModal
          status={processingStatus}
          errorMessage={errorMessage}
          reason={reason}
          batteryInfo={batteryInfo}
          onClose={() => setShowProcessing(false)}
        />
      )}

      {/* Amount to Pay */}
      <div className="py-4 mt-6 ml-3 mr-3 text-center bg-purple-200 shadow rounded-xl dark:bg-purple-800">
        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
          Amount to Pay:
        </p>
        <p className="text-3xl font-extrabold text-purple-900 dark:text-white">
          {selectedAmount}
        </p>
      </div>

      {/* Payment Method */}
      <div className="mt-6 ml-3 mr-3">
        <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Habka Lacag Bixinta
        </p>
        <div className="grid grid-cols-4 gap-2 text-xs font-medium text-center">
          {["EVC Plus", "ZAAD", "SAHAL"].map((method) => (
            <button
              key={method}
              onClick={() => selectMethod(method)}
              className={`px-2 py-1 rounded-full shadow-sm border ${
                isActiveMethod(method)
                  ? "bg-pink-100 text-pink-800 border-pink-400 active-method dark:bg-pink-700 dark:text-pink-200 dark:border-pink-600"
                  : "bg-gray-100 dark:bg-gray-700 dark:text-gray-300 border-transparent"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="mt-5 ml-3 mr-3">
        <label className="block mb-1 ml-3 mr-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Telefonn Numberka
        </label>
        <div
          className={`flex items-center ml-3 mr-3 overflow-hidden border rounded-xl shadow-sm focus-within:ring-2 ring-pink-100 ${
            errors.phone
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700 dark:focus-within:ring-pink-300"
          }`}
        >
          <span className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
            <img
              src="https://flagcdn.com/w40/so.png"
              alt="SO"
              className="w-5 h-3.5 rounded-sm"
            />
            +252
          </span>
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-transparent outline-none dark:text-white"
            placeholder={getplaceholders_Input()}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 ml-3 text-xs text-red-500">{errors.phone}</p>
        )}
        <label className="flex items-center mt-3 ml-3 mr-3 text-xs text-gray-600 dark:text-gray-400">
          Fadlan Gali Numberka lacagta la Dirayo
        </label>
      </div>

      {/* Checkboxes */}
      <div className="mx-3 mt-5">
        <div
          onClick={() => setAgree1(!agree1)}
          className={`flex items-center gap-3 p-3 transition-all duration-200 border-2 cursor-pointer rounded-xl ${
            agree1
              ? "border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 dark:border-pink-500"
              : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 hover:border-pink-200 dark:hover:border-pink-700"
          } ${errors.agree1 ? "border-red-400 dark:border-red-500" : ""}`}
        >
          {/* Custom Checkbox */}
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-200 flex-shrink-0 ${
              agree1
                ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500"
                : "border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"
            }`}
          >
            {agree1 && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          {/* Label Content */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Waan ogolahay
            </span>
            <a
              href="/rules.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-pink-500 underline transition hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 decoration-dotted underline-offset-2"
            >
              📜 Shuruudaha iyo xeerarka isticmaalka Danab
            </a>
          </div>
        </div>
        {errors.agree1 && (
          <p className="mt-1 ml-1 text-xs text-red-500">{errors.agree1}</p>
        )}
      </div>

      {/* <div className="flex items-start mt-5 ml-3 mr-3 space-x-2">
        <input
          type="checkbox"
          checked={agree2}
          onChange={(e) => setAgree2(e.target.checked)}
          className="w-4 h-4 mt-0.5"
        />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Qofkale shuruudaha iyo xeerarka isticmaala Danab
          {errors.agree2 && (
            <p className="mt-1 text-xs text-red-500">{errors.agree2}</p>
          )}
        </span>
      </div> */}

      {/* Pay Button */}
      <div className="ml-3 mr-3">
        <button
          onClick={handlePay}
          className="flex items-center justify-center w-full gap-2 py-3 mt-5 text-lg font-bold text-white transition shadow-lg bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl hover:scale-105"
        >
          Bixi Hadda
          <FaLongArrowAltRight className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default PaymentSection;
