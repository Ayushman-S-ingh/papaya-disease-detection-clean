import React from "react";
import { Link } from "react-router-dom";

export default function Home() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 text-white overflow-hidden">

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col justify-center min-h-screen">

        {/* HERO SECTION */}
        <div className="text-center">

          {/* ICON */}
          <div className="mb-6 text-6xl sm:text-7xl animate-pulse">
            🌿
          </div>

          {/* TITLE */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">

            Papaya Disease
            <span className="block text-green-400">
              Detection AI
            </span>

          </h1>

          {/* SUBTITLE */}
          <p className="max-w-3xl mx-auto text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-10 px-2">

            Advanced AI-powered papaya leaf disease detection system
            using Deep Learning and EfficientNetB0 for accurate
            crop health monitoring and smart agriculture.

          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">

            <Link to="/login">

              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300">

                Login

              </button>

            </Link>

            <Link to="/signup">

              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300">

                Sign Up

              </button>

            </Link>

          </div>

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">

          <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-6 hover:scale-105 transition-all duration-300">

            <div className="text-4xl mb-4">
              ⚡
            </div>

            <h3 className="text-xl font-bold mb-3">
              Fast Prediction
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Upload papaya leaf images and get instant AI-powered disease predictions.
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-6 hover:scale-105 transition-all duration-300">

            <div className="text-4xl mb-4">
              🧠
            </div>

            <h3 className="text-xl font-bold mb-3">
              Deep Learning
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Powered by EfficientNetB0 trained on thousands of papaya leaf images.
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-6 hover:scale-105 transition-all duration-300">

            <div className="text-4xl mb-4">
              📊
            </div>

            <h3 className="text-xl font-bold mb-3">
              Smart Analytics
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Track prediction history and monitor crop health efficiently.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}