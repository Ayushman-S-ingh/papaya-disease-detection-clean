import React, { useEffect, useState } from "react";

import Navbar from "../components/common/Navbar";

import axios from "axios";

import { useNavigate } from "react-router-dom";



export default function History() {

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();



  useEffect(() => {

    fetchHistory();

  }, []);



  const fetchHistory = async () => {

    try {

      const token = localStorage.getItem("access_token");



      const response = await axios.get(

        `${import.meta.env.VITE_API_URL}/api/history`,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );



      setHistory(response.data.predictions);

    } catch (error) {

      console.error(

        "Failed to fetch history:",

        error.response?.data || error

      );

    } finally {

      setLoading(false);

    }

  };



  const deletePrediction = async (id) => {

    try {

      const token = localStorage.getItem("access_token");



      await axios.delete(

        `${import.meta.env.VITE_API_URL}/api/history/${id}`,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );



      setHistory((prev) =>

        prev.filter((item) => item.id !== id)

      );

    } catch (error) {

      console.error(

        "Delete failed:",

        error.response?.data || error

      );



      alert("Delete failed");

    }

  };



  if (loading) {

    return (

      <>

        <Navbar />



        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">

          <div className="text-center">

            <div className="text-5xl animate-spin mb-4">

              🌿

            </div>



            <h2 className="text-xl font-semibold text-gray-700">

              Loading history...

            </h2>

          </div>

        </div>

      </>

    );

  }



  return (

    <>

      <Navbar />



      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 px-4 sm:px-6 py-6 sm:py-8">

        {/* HEADER */}

        <div className="max-w-7xl mx-auto mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-green-900">

            📋 Prediction History

          </h1>



          <p className="text-gray-600 mt-2 text-sm sm:text-base">

            View all your previous disease detections and reports

          </p>

        </div>



        {/* EMPTY STATE */}

        {history.length === 0 ? (

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-sm text-center">

            <div className="text-6xl mb-4">

              🌿

            </div>



            <h2 className="text-2xl font-bold text-gray-800 mb-3">

              No Prediction History

            </h2>



            <p className="text-gray-500">

              Start scanning papaya leaves to see your history here.

            </p>

          </div>

        ) : (

          <div className="max-w-7xl mx-auto grid gap-6">

            {history.map((item) => (

              <div

                key={item.id}

                onClick={() =>

                  navigate(`/history/${item.id}`)

                }

                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"

              >

                <div className="flex flex-col lg:flex-row">

                  {/* IMAGE */}

                  <div className="lg:w-72 w-full">

                    <img

                      src={`${import.meta.env.VITE_API_URL}${item.image_url}`}

                      alt="leaf"

                      className="w-full h-64 lg:h-full object-cover"

                    />

                  </div>



                  {/* CONTENT */}

                  <div className="flex-1 p-5 sm:p-6">

                    {/* TOP */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                      <div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">

                          {item.disease_name}

                        </h2>



                        <div className="space-y-2 text-sm sm:text-base text-gray-700">

                          <p>

                            <strong>Confidence:</strong>{" "}

                            {item.confidence > 1

                              ? item.confidence.toFixed(2)

                              : (item.confidence * 100).toFixed(2)

                            }%

                          </p>



                          <p>

                            <strong>Severity:</strong>{" "}

                            {item.severity}

                          </p>



                          <p>

                            <strong>Date:</strong>{" "}

                            {new Date(

                              item.created_at

                            ).toLocaleString()}

                          </p>

                        </div>

                      </div>



                      {/* DELETE BUTTON */}

                      <button

                        onClick={(e) => {

                          e.stopPropagation();

                          deletePrediction(item.id);

                        }}

                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300 w-full sm:w-auto"

                      >

                        🗑 Delete

                      </button>

                    </div>



                    {/* TREATMENT */}

                    <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4">

                      <h3 className="text-lg font-bold text-green-900 mb-3">

                        💊 Treatment Recommendation

                      </h3>



                      <p className="text-gray-700 leading-7 text-sm sm:text-base">

                        {item.treatment}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </>

  );

}