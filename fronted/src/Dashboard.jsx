import React, { memo } from "react";
import { FaClock, FaUserGraduate, FaInfoCircle } from "react-icons/fa";

const badgeColors = {
  New: "bg-green-500",
  Upcoming: "bg-yellow-400",
  Popular: "bg-red-600",
};

const LectureCard = memo(
  ({
    title,
    date,
    imageUrl,
    description,
    badge,
    duration,
    instructor,
    onDetailsClick,
  }) => {
    return (
      <article
        tabIndex={0}
        aria-label={`Lecture titled ${title}`}
        className="w-full max-w-xs bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={imageUrl}
            alt={`Thumbnail for ${title}`}
            className="w-full h-40 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
            loading="lazy"
          />
          {badge && (
            <span
              className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg select-none ${
                badgeColors[badge] || "bg-gray-500"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
            {description}
          </p>

          <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              <FaClock className="text-red-600" aria-hidden="true" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserGraduate className="text-red-600" aria-hidden="true" />
              <span>{instructor}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <p className="text-right text-red-600 font-semibold text-xs">{date}</p>
            <button
              aria-label={`View details of ${title}`}
              className="flex items-center gap-1 text-red-600 font-semibold text-xs hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 rounded"
              onClick={onDetailsClick}
              type="button"
            >
              <FaInfoCircle /> Details
            </button>
          </div>
        </div>
      </article>
    );
  }
);

const LectureSection = ({ title, data }) => (
  <section className="mb-14 animate-fadeIn">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-extrabold text-red-700 border-b-4 border-red-700 pb-1 select-none">
        {title}
      </h2>
      <a
        href="#"
        className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
      >
        View All &gt;
      </a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {data.map(
        (
          { title, date, imageUrl, description, badge, duration, instructor },
          index
        ) => (
          <LectureCard
            key={index}
            title={title}
            date={date}
            imageUrl={imageUrl}
            description={description}
            badge={badge}
            duration={duration}
            instructor={instructor}
            onDetailsClick={() => alert(`Clicked details for ${title}`)}
          />
        )
      )}
    </div>
  </section>
);

export default function Dashboard() {
  const lectures = [
    {
      title: "Introduction to Data Science and Analytics",
      date: "5th August 2025",
      imageUrl: "https://picsum.photos/400/240?random=11",
      description:
        "Explore foundational concepts of data science including data analysis, visualization, and machine learning basics.",
      badge: "New",
      duration: "1h 30m",
      instructor: "Dr. Jane Doe",
    },
    {
      title: "Advanced Machine Learning Techniques",
      date: "10th August 2025",
      imageUrl: "https://picsum.photos/400/240?random=12",
      description:
        "Dive deep into complex algorithms like neural networks, SVMs, and ensemble learning.",
      badge: "Upcoming",
      duration: "2h 15m",
      instructor: "Prof. John Smith",
    },
    {
      title: "Data Visualization with Python",
      date: "15th August 2025",
      imageUrl: "https://picsum.photos/400/240?random=13",
      description:
        "Learn to create compelling charts and dashboards using Matplotlib and Seaborn.",
      badge: "Popular",
      duration: "1h 45m",
      instructor: "Dr. Alice Johnson",
    },
    {
      title: "Big Data Fundamentals",
      date: "20th August 2025",
      imageUrl: "https://picsum.photos/400/240?random=14",
      description:
        "Understand the basics of big data, Hadoop ecosystem, and real-time data processing.",
      badge: null,
      duration: "2h 00m",
      instructor: "Mr. Bob Williams",
    },
  ];

  return (
    <main className="bg-gray-50 min-h-screen p-8 w-full overflow-y-auto">
      <h1 className="text-5xl font-extrabold text-red-700 mb-16 select-none">
        Dashboard
      </h1>

      <LectureSection title="Recently Added Lectures" data={lectures} />
      <LectureSection title="Upcoming Lectures" data={lectures} />
      <LectureSection title="Attended Lectures" data={lectures} />
    </main>
  );
}
