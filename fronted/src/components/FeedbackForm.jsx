import React from "react";
import { useLocation } from "react-router-dom";

export default function FeedbackForm() {
  const location = useLocation();
  const lecture = location.state?.lecture;

  if (!lecture) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">No lecture selected for feedback.</h2>
        <p>Please navigate from the lectures page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-[#9B1C1C] mb-4">
        Feedback for: {lecture.topic}
      </h2>
      <div className="mb-6 space-y-1 text-gray-800">
        <p><strong>Resource Person:</strong> {lecture.resourcePerson}</p>
        <p><strong>Class:</strong> {lecture.class}</p>
        <p><strong>Venue:</strong> {lecture.venue}</p>
        <p><strong>Time:</strong> {lecture.time}</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Your Rating</label>
          <select className="w-full rounded border-gray-300 p-2">
            <option value="">Select...</option>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Comments</label>
          <textarea
            className="w-full rounded border-gray-300 p-2"
            rows="4"
            placeholder="Enter your feedback..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
