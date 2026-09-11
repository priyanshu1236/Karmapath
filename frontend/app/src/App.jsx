import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import InitialAssessmentChoice from './pages/InitialAssessmentChoice';
import TakeAssessment from './pages/TakeAssessment';

// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import MyCompetencies from './pages/MyCompetencies';
import LearningPath from './pages/LearningPath';
import Courses from './pages/Courses';
import AiAssessment from './pages/AiAssessment';
import Progress from './pages/Progress';
import Reports from './pages/Reports';
import TakeResourceAssessment from './pages/TakeResourceAssessment';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import Departments from './pages/Departments';
import TrainingEffectiveness from './pages/TrainingEffectiveness';
import AdminResources from './pages/AdminResources';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="initial-assessment-choice" element={<InitialAssessmentChoice />} />
          <Route path="take-assessment" element={<TakeAssessment />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="my-competencies" element={<MyCompetencies />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="courses" element={<Courses />} />
          <Route path="assessments" element={<AiAssessment />} />
          <Route path="progress" element={<Progress />} />
          <Route path="reports" element={<Reports />} />
          <Route path="resource-assessment/:resourceId" element={<TakeResourceAssessment />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="training-effectiveness" element={<TrainingEffectiveness />} />
          <Route path="resources" element={<AdminResources />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
