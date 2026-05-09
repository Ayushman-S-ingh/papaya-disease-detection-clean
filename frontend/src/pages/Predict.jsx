import React from "react";

// src/pages/Predict.jsx
// Main prediction page with drag-and-drop upload, camera capture, and real-time results

import { useState, useRef, useCallback } from "react";

import { predictionService } from "../services/predictionService";

import Navbar from "../components/common/Navbar";

import ConfidenceBar from "../components/common/ConfidenceBar";



const SEVERITY_COLORS = {

  none: "bg-green-100 text-green-800 border-green-300",

  low: "bg-lime-100 text-lime-800 border-lime-300",

  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",

  high: "bg-red-100 text-red-800 border-red-300",

  critical: "bg-red-900 text-red-100 border-red-700",

};



export default function Predict() {

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const [cameraMode, setCameraMode] = useState(false);

  const [notes, setNotes] = useState("");

  const [dragging, setDragging] = useState(false);



  const fileInputRef = useRef(null);

  const videoRef = useRef(null);

  const streamRef = useRef(null);



  // =====================================================
  // FILE HANDLING
  // =====================================================

  const handleFile = useCallback((f) => {

    if (!f) return;



    const allowed = [

      "image/jpeg",

      "image/png",

      "image/webp"

    ];



    if (!allowed.includes(f.type)) {

      setError("Please upload JPG, PNG, or WEBP image.");

      return;

    }



    if (f.size > 16 * 1024 * 1024) {

      setError("Image must be under 16MB.");

      return;

    }



    setFile(f);

    setPreview(URL.createObjectURL(f));

    setResult(null);

    setError("");

  }, []);



  const handleDrop = (e) => {

    e.preventDefault();

    setDragging(false);

    handleFile(e.dataTransfer.files[0]);

  };



  // =====================================================
  // CAMERA
  // =====================================================

  const startCamera = async () => {

    setCameraMode(true);



    const stream = await navigator.mediaDevices.getUserMedia({

      video: {

        facingMode: "environment",

      },

      audio: false,

    });



    streamRef.current = stream;



    setTimeout(() => {

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

      }

    }, 100);

  };



  const capturePhoto = () => {

    const canvas = document.createElement("canvas");



    canvas.width = videoRef.current.videoWidth;

    canvas.height = videoRef.current.videoHeight;



    canvas
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0);



    canvas.toBlob(

      (blob) => {

        const f = new File(

          [blob],

          "camera_capture.jpg",

          {

            type: "image/jpeg",

          }

        );



        handleFile(f);

      },

      "image/jpeg",

      0.92

    );



    stopCamera();

  };



  const stopCamera = () => {

    streamRef.current?.getTracks().forEach((t) => t.stop());

    setCameraMode(false);

  };



  // =====================================================
  // PREDICTION
  // =====================================================

  const handlePredict = async () => {

    if (!file) return;



    setLoading(true);

    setError("");



    try {

      const data = await predictionService.predict(

        file,

        notes

      );



      setResult(data);

    } catch (e) {

      setError(

        e.message ||

        "Prediction failed. Please try again."

      );

    } finally {

      setLoading(false);

    }

  };



  const downloadReport = async () => {

    if (!result) return;



    const blob = await predictionService.getReport(

      result.prediction_id

    );



    const url = URL.createObjectURL(blob);



    const a = document.createElement("a");

    a.href = url;

    a.download = `papaya_report_${result.prediction_id}.pdf`;

    a.click();



    URL.revokeObjectURL(url);

  };



  const reset = () => {

    setFile(null);

    setPreview(null);

    setResult(null);

    setError("");

    setNotes("");

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">

      <Navbar />



      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">

            🌿 Leaf Disease Detection

          </h1>



          <p className="text-gray-500 mt-2 text-sm sm:text-base">

            Upload or photograph a papaya leaf for instant AI-powered diagnosis

          </p>

        </div>



        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

          {/* ===================================================== */}
          {/* LEFT SIDE */}
          {/* ===================================================== */}

          <div className="space-y-4">

            {!cameraMode ? (

              <>

                {/* DROP ZONE */}

                <div

                  className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer bg-white shadow-sm

                  ${dragging

                    ? "border-green-500 bg-green-50"

                    : "border-gray-300 hover:border-green-400 hover:bg-green-50"

                  }`}

                  onDragOver={(e) => {

                    e.preventDefault();

                    setDragging(true);

                  }}

                  onDragLeave={() => setDragging(false)}

                  onDrop={handleDrop}

                  onClick={() => fileInputRef.current?.click()}

                >

                  {preview ? (

                    <img

                      src={preview}

                      alt="Preview"

                      className="max-h-72 w-full object-contain mx-auto rounded-2xl shadow"

                    />

                  ) : (

                    <div className="space-y-4">

                      <div className="text-5xl sm:text-6xl">

                        🍃

                      </div>



                      <p className="text-gray-700 font-semibold text-base sm:text-lg">

                        Drag & drop a leaf image here

                      </p>



                      <p className="text-gray-400 text-sm">

                        JPG, PNG, WEBP · Max 16MB

                      </p>

                    </div>

                  )}



                  <input

                    ref={fileInputRef}

                    type="file"

                    accept="image/*"

                    className="hidden"

                    onChange={(e) =>

                      handleFile(e.target.files[0])

                    }

                  />

                </div>



                {/* BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-3">

                  <button

                    onClick={() => fileInputRef.current?.click()}

                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 text-gray-700 font-medium transition-all"

                  >

                    📁 Browse File

                  </button>



                  <button

                    onClick={startCamera}

                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 text-gray-700 font-medium transition-all"

                  >

                    📷 Use Camera

                  </button>

                </div>

              </>

            ) : (

              /* CAMERA MODE */

              <div className="bg-black rounded-3xl overflow-hidden shadow-lg">

                <video

                  ref={videoRef}

                  autoPlay

                  playsInline

                  className="w-full"

                />



                <div className="flex flex-col sm:flex-row gap-3 p-4">

                  <button

                    onClick={capturePhoto}

                    className="flex-1 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition"

                  >

                    📸 Capture

                  </button>



                  <button

                    onClick={stopCamera}

                    className="flex-1 py-3 bg-gray-700 text-white rounded-2xl font-semibold hover:bg-gray-800 transition"

                  >

                    Cancel

                  </button>

                </div>

              </div>

            )}



            {/* NOTES */}

            <textarea

              value={notes}

              onChange={(e) => setNotes(e.target.value)}

              placeholder="Optional notes (location, symptoms, plant age...)"

              rows={4}

              className="w-full p-4 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"

            />



            {/* ERROR */}

            {error && (

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">

                {error}

              </div>

            )}



            {/* ACTIONS */}

            <div className="flex flex-col sm:flex-row gap-3">

              {file && (

                <button

                  onClick={handlePredict}

                  disabled={loading}

                  className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition-all"

                >

                  {loading

                    ? "⚙️ Analyzing..."

                    : "🔍 Detect Disease"}

                </button>

              )}



              {(file || result) && (

                <button

                  onClick={reset}

                  className="py-4 px-6 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition"

                >

                  Reset

                </button>

              )}

            </div>

          </div>



          {/* ===================================================== */}
          {/* RIGHT SIDE */}
          {/* ===================================================== */}

          <div>

            {loading && (

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-5">

                <div className="text-5xl animate-bounce">

                  🤖

                </div>



                <p className="text-gray-700 font-semibold">

                  AI is analyzing your leaf image...

                </p>



                <div className="w-full bg-gray-100 rounded-full h-3">

                  <div className="bg-green-500 h-3 rounded-full animate-pulse w-3/4" />

                </div>



                <p className="text-gray-400 text-sm">

                  EfficientNetB0 inference in progress

                </p>

              </div>

            )}



            {result && !loading && (

              <div className="space-y-5">

                {/* RESULT CARD */}

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

                  <div

                    className={`px-4 sm:px-6 py-4 border-b

                    ${result.disease === "Healthy Leaf"

                      ? "bg-green-50 border-green-200"

                      : "bg-red-50 border-red-200"

                    }`}

                  >

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                      <div>

                        <p className="text-sm text-gray-500 font-medium">

                          Detected Disease

                        </p>



                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">

                          {result.disease}

                        </h2>

                      </div>



                      <span

                        className={`px-3 py-1 rounded-full text-xs font-semibold border w-fit

                        ${SEVERITY_COLORS[result.severity]}`}

                      >

                        {result.severity?.toUpperCase()}

                      </span>

                    </div>

                  </div>



                  <div className="p-4 sm:p-6 space-y-5">

                    {/* CONFIDENCE */}

                    <div>

                      <div className="flex justify-between text-sm mb-2">

                        <span className="text-gray-600 font-medium">

                          Confidence Score

                        </span>



                        <span className="font-bold text-gray-900">

                          {result.confidence}%

                        </span>

                      </div>



                      <ConfidenceBar value={result.confidence} />

                    </div>



                    {/* TOP PREDICTIONS */}

                    <div>

                      <p className="text-sm font-medium text-gray-600 mb-3">

                        Top Predictions

                      </p>



                      <div className="space-y-3">

                        {Object.entries(result.all_scores || {})

                          .sort((a, b) => b[1] - a[1])

                          .slice(0, 4)

                          .map(([name, score]) => (

                            <div

                              key={name}

                              className="flex items-center gap-2 text-sm"

                            >

                              <span className="w-24 sm:w-40 truncate text-gray-700 text-xs sm:text-sm">

                                {name}

                              </span>



                              <div className="flex-1 bg-gray-100 rounded-full h-2">

                                <div

                                  className="bg-green-500 h-2 rounded-full transition-all"

                                  style={{

                                    width: `${score}%`

                                  }}

                                />

                              </div>



                              <span className="text-gray-500 w-12 text-right text-xs sm:text-sm">

                                {score.toFixed(1)}%

                              </span>

                            </div>

                          ))}

                      </div>

                    </div>

                  </div>

                </div>



                {/* TREATMENT */}

                <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-6">

                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">

                    💊 Treatment Recommendation

                  </h3>



                  <p className="text-gray-700 text-sm leading-relaxed">

                    {result.treatment}

                  </p>

                </div>



                {/* PDF */}

                <button

                  onClick={downloadReport}

                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all"

                >

                  📄 Download PDF Report

                </button>

              </div>

            )}



            {!result && !loading && (

              <div className="bg-white rounded-3xl p-8 shadow-sm text-center text-gray-400">

                <div className="text-6xl mb-4">

                  🔬

                </div>



                <p className="text-gray-700 font-medium">

                  Upload a papaya leaf image to get started

                </p>



                <p className="text-sm mt-2">

                  Supports multiple disease classes

                </p>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>

  );

}