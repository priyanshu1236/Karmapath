import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LearningPath from './pages/LearningPath';
import AiAssessment from './pages/AiAssessment';
import Courses from './pages/Courses';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import MyCompetencies from './pages/MyCompetencies';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth / Root */}
        <Route path="/" element={<Login />} />

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="my-competencies" element={<MyCompetencies />} />
          <Route path="skill-gaps" element={<div className="p-8">Skill Gaps Placeholder</div>} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="courses" element={<Courses />} />
          <Route path="assessments" element={<AiAssessment />} />
          <Route path="progress" element={<div className="p-8">Progress Placeholder</div>} />
          <Route path="reports" element={<div className="p-8">Reports Placeholder</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="workforce-intelligence" element={<div className="p-8">Workforce Intel Placeholder</div>} />
          <Route path="skill-heatmap" element={<div className="p-8">Skill Heatmap Placeholder</div>} />
          <Route path="departments" element={<div className="p-8">Departments Placeholder</div>} />
          <Route path="districts" element={<div className="p-8">Districts Placeholder</div>} />
          <Route path="training-effectiveness" element={<div className="p-8">Effectiveness Placeholder</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
