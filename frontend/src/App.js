import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import FacultyDashboard from "./pages/Dashboard/FacultyDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import PrivateRoute from "./components/Routes/PrivateRoute";
import ProfilePage from "./pages/Profile/ProfilePage";

import ViewAttendance from "./pages/SubPages/student/ViewAttendance";
import StudentList from "./pages/SubPages/faculty/StudentList";
import ClassRecord from "./pages/SubPages/faculty/ClassRecord";
import ManageUsers from "./pages/SubPages/admin/ManageUsers";
import ClassRecordAdmin from "./pages/SubPages/admin/ClassRecordAdmin";
import Analytics from "./pages/SubPages/admin/Analytics";
import SettingPage from "./pages/Profile/SettingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute allowedRole="student" />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRole="faculty" />}>
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRole={["student", "faculty", "admin"]} />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/setting" element={<SettingPage />} />
        </Route>

        <Route element={<PrivateRoute allowedRole="student" />}>
          <Route path="/view-attendance" element={<ViewAttendance />} />
        </Route>

        <Route element={<PrivateRoute allowedRole="faculty" />}>
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/class-record" element={<ClassRecord />} />
        </Route>

        <Route element={<PrivateRoute allowedRole="admin" />}>
          <Route path="/manage-user" element={<ManageUsers/>} />
          <Route path="/class-record-admin" element={<ClassRecordAdmin/>} />
          <Route path="/analytics" element={<Analytics/>} />
        </Route>
        

      </Routes>
    </Router>
  );
}

export default App;
