import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { predictionService } from "../services/predictionService";

import Navbar from "../components/common/Navbar";



export default function Dashboard() {

  const { user } = useAuth();

  const [summary, setSummary] = useState(null);

  const [recent, setRecent] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    Promise.all([

      predictionService.getSummary(),

      predictionService.getHistory({ per_page: 5 }),

    ])

      .then(([sumData, histData]) => {

        setSummary(sumData);

        setRecent(histData.predictions || []);

      })

      .catch(console.error)

      .finally(() => setLoading(false));

  }, []);



  const sevEmoji = {

    none: "✅",

    low: "🟡",

    medium: "🟠",

    high: "🔴",

    critical: "🚨",

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">

      <Navbar />



      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* HERO SECTION */}

        <div className="bg-gradient-to-r from-green-700 to-emerald-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 overflow-hidden">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            <div className="flex-1">

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">

                🌿 Welcome back,

                <span className="block mt-2">

                  {user?.name?.split(" ")[0]}

                </span>

              </h1>



              <p className="text-sm sm:text-base lg:text-lg text-green-100 max-w-2xl leading-7 sm:leading-8">

                PapayaAI helps farmers identify papaya leaf diseases using

                Artificial Intelligence and Computer Vision technology.

                Upload a leaf image and receive instant disease detection,

                severity analysis, and treatment recommendations.

              </p>



              <div className="flex flex-col sm:flex-row gap-4 mt-8">

                <Link

                  to="/predict"

                  className="bg-white text-green-700 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 text-center shadow-lg"

                >

                  🔍 Start New Scan

                </Link>



                <Link

                  to="/history"

                  className="border border-white px-6 py-4 rounded-2xl font-semibold hover:bg-white hover:text-green-700 transition-all duration-300 text-center"

                >

                  📋 View History

                </Link>

              </div>

            </div>



            <img

              src="https://cdn-icons-png.flaticon.com/512/2909/2909762.png"

              alt="plant"

              className="w-40 sm:w-52 lg:w-60 drop-shadow-2xl"

            />

          </div>

        </div>



        {/* STATS */}

        {loading ? (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

            {[...Array(4)].map((_, i) => (

              <div

                key={i}

                className="bg-white h-32 rounded-3xl animate-pulse"

              />

            ))}

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

            <StatCard

              icon="🌿"

              title="Total Scans"

              value={summary?.total_predictions || 0}

              color="green"

            />



            <StatCard

              icon="🎯"

              title="Avg Confidence"

              value={`${summary?.avg_confidence || 0}%`}

              color="blue"

            />



            <StatCard

              icon="🦠"

              title="Diseases Found"

              value={

                Object.keys(

                  summary?.disease_distribution || {}

                ).filter((k) => k !== "Healthy Leaf").length

              }

              color="orange"

            />



            <StatCard

              icon="✅"

              title="Healthy Leaves"

              value={

                summary?.disease_distribution?.[

                  "Healthy Leaf"

                ] || 0

              }

              color="purple"

            />

          </div>

        )}



        {/* QUICK ACTIONS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <QuickCard

            to="/predict"

            icon="📸"

            title="Scan Leaf"

            desc="Upload a papaya leaf image for AI diagnosis"

          />



          <QuickCard

            to="/history"

            icon="📋"

            title="Prediction History"

            desc="View previous disease detection records"

          />



          <QuickCard

            to="/analytics"

            icon="📊"

            title="Analytics"

            desc="Visualize disease trends and reports"

          />

        </div>



        {/* RECENT PREDICTIONS */}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-10">

          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">

              Recent Predictions

            </h2>



            <Link

              to="/history"

              className="text-green-700 font-semibold hover:underline text-sm sm:text-base"

            >

              View all →

            </Link>

          </div>



          {recent.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              No predictions yet

            </div>

          ) : (

            recent.map((p) => (

              <div

                key={p.id}

                className="p-4 sm:p-6 border-b border-gray-100 hover:bg-gray-50 transition flex items-center gap-3 sm:gap-5"

              >

                <div className="text-3xl sm:text-4xl">

                  {sevEmoji[p.severity] || "🌿"}

                </div>



                <div className="flex-1 min-w-0">

                  <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">

                    {p.disease_name}

                  </h3>



                  <p className="text-xs sm:text-sm text-gray-500">

                    {new Date(

                      p.created_at

                    ).toLocaleDateString()}

                  </p>

                </div>



                <div className="text-right">

                  <p className="font-bold text-lg sm:text-xl text-gray-900">

                    {p.confidence}%

                  </p>



                  <p className="text-xs sm:text-sm text-gray-400">

                    confidence

                  </p>

                </div>

              </div>

            ))

          )}

        </div>



        {/* ABOUT */}

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm mb-10">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-5">

            🚀 About PapayaAI

          </h1>



          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-7 sm:leading-9 mb-10">

            PapayaAI is an intelligent plant disease detection platform

            developed to help farmers identify papaya leaf diseases using

            deep learning and computer vision. The system analyzes uploaded

            leaf images and predicts diseases instantly with treatment

            recommendations and severity analysis.

          </p>



          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <FeatureCard

              icon="🧠"

              title="AI Powered"

              desc="Uses machine learning models for disease prediction"

            />



            <FeatureCard

              icon="⚡"

              title="Real-Time Detection"

              desc="Instant results with high confidence accuracy"

            />



            <FeatureCard

              icon="💊"

              title="Treatment Advice"

              desc="Smart treatment and prevention recommendations"

            />



            <FeatureCard

              icon="📈"

              title="Analytics"

              desc="Tracks disease trends and scan history"

            />

          </div>

        </div>



        {/* WORKFLOW */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 sm:p-10 text-white">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10">

            🔬 How The System Works

          </h1>



          <div className="grid md:grid-cols-4 gap-6">

            <StepCard

              number="1"

              title="Upload"

              desc="Upload or capture a leaf image"

            />



            <StepCard

              number="2"

              title="AI Analysis"

              desc="Deep learning analyzes disease patterns"

            />



            <StepCard

              number="3"

              title="Prediction"

              desc="System predicts disease and severity"

            />



            <StepCard

              number="4"

              title="Treatment"

              desc="Treatment recommendations are generated"

            />

          </div>

        </div>

      </main>

    </div>

  );

}



function StatCard({ icon, title, value, color }) {

  const colors = {

    green: "from-green-500 to-green-600",

    blue: "from-blue-500 to-blue-600",

    orange: "from-orange-500 to-orange-600",

    purple: "from-purple-500 to-purple-600",

  };



  return (

    <div

      className={`bg-gradient-to-r ${colors[color]} rounded-3xl p-5 sm:p-6 text-white shadow-lg hover:scale-105 transition-all duration-300`}

    >

      <div className="text-3xl sm:text-4xl mb-3">

        {icon}

      </div>



      <h2 className="text-2xl sm:text-4xl font-bold">

        {value}

      </h2>



      <p className="text-white/90 mt-2 text-sm sm:text-base">

        {title}

      </p>

    </div>

  );

}



function QuickCard({ to, icon, title, desc }) {

  return (

    <Link

      to={to}

      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

    >

      <div className="text-4xl sm:text-5xl mb-4">

        {icon}

      </div>



      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">

        {title}

      </h2>



      <p className="text-gray-500 leading-7 text-sm sm:text-base">

        {desc}

      </p>

    </Link>

  );

}



function FeatureCard({ icon, title, desc }) {

  return (

    <div className="bg-[#f8fffb] rounded-2xl p-6 border border-green-100">

      <div className="text-4xl mb-4">

        {icon}

      </div>



      <h2 className="text-xl font-bold text-gray-900 mb-3">

        {title}

      </h2>



      <p className="text-gray-600 leading-7 text-sm sm:text-base">

        {desc}

      </p>

    </div>

  );

}



function StepCard({ number, title, desc }) {

  return (

    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">

      <div className="w-14 h-14 rounded-full bg-white text-green-700 flex items-center justify-center text-2xl font-bold mb-5">

        {number}

      </div>



      <h2 className="text-xl sm:text-2xl font-bold mb-3">

        {title}

      </h2>



      <p className="text-green-50 leading-7 text-sm sm:text-base">

        {desc}

      </p>

    </div>

  );

}