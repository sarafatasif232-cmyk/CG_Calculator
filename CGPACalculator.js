import React, { useState } from "react";

export default function CGPACalculator() {
  const [courses, setCourses] = useState([{ grade: "", credit: "", retake: false, dropped: false }]);
  const [prevCgpa, setPrevCgpa] = useState(0);
  const [prevCredits, setPrevCredits] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const gradePoints = {
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    D: 1.0,
    F: 0.0,
  };

  const addCourse = () => {
    setCourses([...courses, { grade: "", credit: "", retake: false, dropped: false }]);
  };

  const updateCourse = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const calculateCurrentSemesterGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(({ grade, credit, dropped }) => {
      if (!dropped && gradePoints[grade] !== undefined && credit) {
        totalPoints += gradePoints[grade] * parseFloat(credit);
        totalCredits += parseFloat(credit);
      }
    });
    return { gpa: totalPoints / totalCredits || 0, credits: totalCredits };
  };

  const calculateCGPA = () => {
    let totalPoints = prevCgpa * prevCredits;
    let totalCredits = prevCredits;

    courses.forEach(({ grade, credit, retake, dropped }) => {
      if (!grade || !credit) return;

      if (dropped) {
        totalCredits -= parseFloat(credit);
        totalPoints -= gradePoints[grade] * parseFloat(credit);
      } else if (retake) {
        totalPoints += gradePoints[grade] * parseFloat(credit);
      } else {
        totalPoints += gradePoints[grade] * parseFloat(credit);
        totalCredits += parseFloat(credit);
      }
    });

    return { cgpa: totalPoints / totalCredits || 0, credits: totalCredits };
  };

  const { gpa, credits } = calculateCurrentSemesterGPA();
  const { cgpa, credits: totalCredits } = calculateCGPA();

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">CGPA Calculator</h1>

      <div className="mb-4">
        <label className="block mb-1">Previous CGPA:</label>
        <input type="number" value={prevCgpa} onChange={(e) => setPrevCgpa(parseFloat(e.target.value))} className="border p-2 w-full rounded" />
        <label className="block mb-1 mt-2">Previous Credits:</label>
        <input type="number" value={prevCredits} onChange={(e) => setPrevCredits(parseFloat(e.target.value))} className="border p-2 w-full rounded" />
      </div>

      <h2 className="text-xl font-semibold mb-2">Current Semester Courses</h2>
      {courses.map((course, index) => (
        <div key={index} className="flex gap-2 mb-2 items-center">
          <select value={course.grade} onChange={(e) => updateCourse(index, "grade", e.target.value)} className="border p-2 rounded w-1/5">
            <option value="">Select Grade</option>
            {Object.keys(gradePoints).map((g) => (<option key={g} value={g}>{g}</option>))}
          </select>
          <input type="number" placeholder="Credit" value={course.credit} onChange={(e) => updateCourse(index, "credit", e.target.value)} className="border p-2 rounded w-1/5" />
          <label className="flex items-center gap-1"><input type="checkbox" checked={course.retake} onChange={(e) => updateCourse(index, "retake", e.target.checked)} /> Retake</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={course.dropped} onChange={(e) => updateCourse(index, "dropped", e.target.checked)} /> Dropped</label>
        </div>
      ))}
      <button onClick={addCourse} className="bg-blue-500 text-white px-4 py-2 rounded mb-6">+ Add Course</button>

      <div className="flex justify-center mb-6">
        <button onClick={() => setShowResult(true)} className="bg-green-500 text-white px-6 py-3 rounded">Show Result</button>
      </div>

      {showResult && (
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Description</th>
              <th className="border border-gray-400 p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2">Current Semester GPA</td>
              <td className="border border-gray-400 p-2">{gpa.toFixed(2)} ({credits} credits)</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">Updated CGPA</td>
              <td className="border border-gray-400 p-2">{cgpa.toFixed(2)} ({totalCredits} credits)</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
