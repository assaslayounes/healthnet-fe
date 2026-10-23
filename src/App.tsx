import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Specialties from '@/pages/Specialties';
import ProvidersList from '@/pages/ProvidersList';
import ProviderDetail from '@/pages/ProviderDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Appointments from '@/pages/Appointments';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Documents from '@/pages/Documents';
import NewRequest from '@/pages/NewRequest';
import Requests from '@/pages/Requests';
import RequestDetail from '@/pages/RequestDetail';
import Inbox from '@/pages/Inbox';
import InboxDetail from '@/pages/InboxDetail';
import Dashboard from '@/pages/Dashboard';
import ShareView from '@/pages/ShareView';
import Admin from '@/pages/Admin';
import Health from '@/pages/Health';
import Reminders from '@/components/Reminders';
import { useI18n } from '@/i18n';
const Soon = () => { const { t } = useI18n(); return <p className="py-32 text-center text-muted-foreground">{t('soon')}</p>; };
export default function App() {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Reminders />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Specialties />} />
          <Route path="/doctors/:slug" element={<ProvidersList type="doctor" />} />
          <Route path="/dentists" element={<ProvidersList type="dentist" />} />
          <Route path="/pharmacies" element={<ProvidersList type="pharmacy" />} />
          <Route path="/labs" element={<ProvidersList type="lab" />} />
          <Route path="/providers/:id" element={<ProviderDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/appointments" element={<ProtectedRoute roles={['patient']}><Appointments /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute roles={['patient']}><Documents /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute roles={['patient']}><Requests /></ProtectedRoute>} />
          <Route path="/requests/new" element={<ProtectedRoute roles={['patient']}><NewRequest /></ProtectedRoute>} />
          <Route path="/requests/:id" element={<ProtectedRoute roles={['patient']}><RequestDetail /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute roles={['pharmacy', 'lab']}><Inbox /></ProtectedRoute>} />
          <Route path="/inbox/:id" element={<ProtectedRoute roles={['pharmacy', 'lab']}><InboxDetail /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['doctor', 'dentist', 'lab']}><Dashboard /></ProtectedRoute>} />
          <Route path="/share/:token" element={<ProtectedRoute roles={['doctor', 'dentist', 'pharmacy', 'lab']}><ShareView /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute roles={['patient']}><Health /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Soon />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
