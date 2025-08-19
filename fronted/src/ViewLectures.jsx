import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // Track expanded card

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lectures');
        setLectures(res.data);
      } catch (err) {
        console.error('Error fetching lectures:', err);
      }
    };

    fetchLectures();
  }, []);

  const handleCardClick = (idx) => {
    setExpandedCard(expandedCard === idx ? null : idx); // Toggle expand
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-14 text-red-700 text-center">
          View Guest Lectures
        </h2>

        {lectures.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No lectures available.</p>
        ) : (
          <div
            className={`grid gap-8 max-w-[1280px] mx-auto ${
              lectures.length === 1
                ? 'grid-cols-1 justify-items-center max-w-xl mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {lectures.map((lecture, idx) => {
              const isExpanded = expandedCard === idx;

              return (
                <div
                  key={lecture.id || idx}
                  className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out group"
                  onClick={() => handleCardClick(idx)}
                >
                  {/* Banner */}
                  {lecture.banner && (
                    <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg border border-gray-200 shadow mb-4">
                      <img
                        src={`http://localhost:5000/uploads/${lecture.banner}`}
                        alt="Banner"
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Topic */}
                  <h3 className="text-xl font-semibold text-red-700 mb-2 text-center">
                    {lecture.topic}
                  </h3>

                  {/* Guest Speaker */}
                  <p className="text-center text-sm text-gray-600 mb-4">
                    🎤 {lecture.resourcePerson} ({lecture.designation})
                  </p>

                  {/* Expanded Full Details */}
                  {isExpanded && (
                    <div className="mt-4 text-sm text-gray-700 space-y-2">
                      <p><span className="font-semibold">👨‍🏫 Teacher:</span> {lecture.teacher || 'N/A'}</p>
                      <p><span className="font-semibold">🏫 Venue:</span> {lecture.venue || 'N/A'}</p>
                      <p><span className="font-semibold">📚 Class:</span> {lecture.class || 'N/A'}</p>
                      <p><span className="font-semibold">⏰ Time:</span> {lecture.time || 'N/A'}</p>
                      <p><span className="font-semibold">👥 Strength:</span> {lecture.strength || 'N/A'}</p>
                      <p><span className="font-semibold">🏢 Company:</span> {lecture.company || 'N/A'}</p>
                      <p><span className="font-semibold">📍 Location:</span> {lecture.location || 'N/A'}</p>

                      {/* Lecture Image */}
                      {lecture.images && (
                        <div>
                          <p className="font-semibold mt-4">Image</p>
                          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg border border-gray-200 shadow">
                            <img
                              src={`http://localhost:5000/uploads/${lecture.images}`}
                              alt="Lecture"
                              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLectures;
 