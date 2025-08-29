import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid } from "react-loading-icons";

const FinalForm = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [siteName, setSiteName] = useState(null);
  const [apiDone, setApiDone] = useState(false); // ⬅️ track API completion

  const id = localStorage.getItem("componyId");

  useEffect(() => {
    if (!id) {
      setError(true);
      setMessage("Company ID not found.");
      setLoading(false);
      return;
    }

    // Start API call
    axios
      .post(`${import.meta.env.VITE_API_URL}/createnewsite/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          setMessage("✅ Site created successfully!");
          setSiteName(res.data?.siteName || null);
        } else {
          setError(true);
          setMessage("❌ Failed to create site.");
        }
      })
      .catch((err) => {
        setError(true);
        setMessage(err.response?.data?.message || err.message || "❌ Site creation failed.");
      })
      .finally(() => {
        setApiDone(true); // mark API as finished
      });

    // Animate progress bar
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 10;
      setProgress(progressVal);

      // When progress reaches 100, only then hide loader
      if (progressVal >= 100) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 160); // 160ms × 10 = ~1.6s
  }, [id]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40 z-50 p-4">
          <Grid className="w-16 h-16 text-white" />
          <div className="w-64 h-2 bg-gray-300 rounded-full mt-6 overflow-hidden">
            <div
              className="h-2 bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {!loading && apiDone && error && (
        <div className="text-red-600 text-center text-lg">{message}</div>
      )}

      {!loading && apiDone && success && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-green-600 text-center text-lg">{message}</div>
          {siteName && (
            <button
              onClick={() => window.open(`http://${siteName}`, "_blank")}
              className="px-6 py-2 bg-[#1D76BC] text-white rounded-lg shadow hover:bg-sky-800 transition"
            >
              Visit Your Site
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FinalForm;
