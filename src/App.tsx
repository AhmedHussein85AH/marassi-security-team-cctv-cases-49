import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import Index from "./pages/Index";
import Incidents from "./pages/incidents/IncidentsPage";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Roles from "./pages/Roles";
import NotFound from "./pages/NotFound";
import IncidentDetail from "./pages/IncidentDetail";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Login from "./pages/Login";
import DailyPortEvents from "./pages/DailyPortEvents";
import CallCenterReports from "./pages/CallCenterReports";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PermissionRoute from "./components/PermissionRoute";
import Footer from "@/components/Footer";
import WorkPermits from '@/pages/WorkPermits';
import IncidentReportForm from './pages/IncidentReportForm';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="h-screen flex flex-col w-full bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-1 overflow-hidden">
        {!isLoginPage && <MainSidebar />}
        <main className="flex-1 overflow-auto flex flex-col">
          <Toaster />
          <Sonner />
          <div className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_dashboard">
                    <Index />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/incidents" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_incidents">
                    <Incidents />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/incidents/:id" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_incidents">
                    <IncidentDetail />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/reports" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_reports">
                    <Reports />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/daily-port-events" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_reports">
                    <DailyPortEvents />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/call-center-reports" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_reports">
                    <CallCenterReports />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/users" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_users">
                    <Users />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/users/add" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="manage_users">
                    <AddUser />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/users/edit/:id" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="manage_users">
                    <EditUser />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_dashboard">
                    <Settings />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/roles" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_dashboard">
                    <Roles />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/work-permits" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_work_permits">
                    <WorkPermits />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="/incident-report-form" element={
                <PrivateRoute>
                  <PermissionRoute requiredPermission="view_reports">
                    <IncidentReportForm />
                  </PermissionRoute>
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
