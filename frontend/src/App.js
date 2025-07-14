import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CheckEmailPage from './pages/auth/CheckEmailPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ResendVerificationPage from './pages/auth/ResendVerificationPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CreatorDashboard from './pages/CreatorDashboard';
import BrandDashboard from './pages/BrandDashboard';
import CreateContest from './pages/CreateContest';
import ContestSubmissions from './pages/ContestSubmissions';
import HowItWorks from './pages/HowItWorks';
import VideoLibrary from './pages/VideoLibrary';
import VideoDetails from './pages/VideoDetails';
import Contests from './pages/Contests';
import ContestDetails from './pages/ContestDetails';
import ContestApplication from './pages/ContestApplication';
import HbadaSynergy from './pages/HbadaSynergy';
import SubmitVideo from './pages/SubmitVideo';
import Dashboard from './pages/Dashboard';
import CreatorProfile from './pages/CreatorProfile';
import CreatorProfileSettings from './pages/CreatorProfileSettings';
import BrandProfile from './pages/BrandProfile';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import ContestRules from './components/legal/ContestRules';
import ParticipantAgreement from './components/legal/ParticipantAgreement';
import Contact from './pages/Contact';
import Library2 from './pages/library2';

// Create theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
  },
  typography: {
    fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h4: {
      fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h5: {
      fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontFamily: '"Open Sauce One", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <AuthProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* Keep old route temporarily for backward compatibility */}
                  <Route path="/register" element={<Navigate to="/signup" replace />} />
                  <Route path="/check-email" element={<CheckEmailPage />} />
                  <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage />} />
                  <Route path="/verify-email/error" element={<VerifyEmailPage />} />
                  <Route path="/resend-verification" element={<ResendVerificationPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/video/:id" element={<VideoDetails />} />
                  <Route path="/about" element={<div>About Us</div>} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/hbada-synergy" element={<HbadaSynergy />} />
                  <Route path="/faq" element={<div>FAQ</div>} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<div>Terms of Service</div>} />
                  <Route path="/rules" element={<ContestRules />} />
                  <Route path="/agreement" element={<ParticipantAgreement />} />
                  <Route path="/profile/:id" element={<CreatorProfile />} />
                  <Route path="/brand/:id" element={<BrandProfile />} />
                  <Route
                    path="/profile/settings"
                    element={
                      <PrivateRoute roles={['creator']}>
                        <CreatorProfileSettings />
                      </PrivateRoute>
                    }
                  />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Navigate to="/creator-dashboard" replace />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/creator-dashboard"
                    element={
                      <PrivateRoute roles={['creator']}>
                        <CreatorDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/brand-dashboard"
                    element={
                      <PrivateRoute roles={['brand']}>
                        <BrandDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/contests/create"
                    element={
                      <PrivateRoute>
                        <CreateContest />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/contests/:contestId/submissions"
                    element={
                      <PrivateRoute>
                        <ContestSubmissions />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/videos" element={<VideoLibrary />} />
                  <Route path="/videos/:id" element={<VideoDetails />} />
                  <Route path="/contests" element={<Contests />} />
                  <Route path="/contests/hbada-chair-contest" element={<ContestDetails />} />
                  <Route path="/contests/:contestId" element={<ContestDetails />} />
                  <Route path="/contests/:contestId/apply" element={<ContestApplication />} />
                  <Route path="/contests/:contestId/submit" element={<SubmitVideo />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <div>Profile</div>
                      </PrivateRoute>
                    }
                  />
                  <Route path="/library" element={<Library2 />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
