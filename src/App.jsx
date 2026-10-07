import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Portfolio
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin
import Login from './admin/pages/Login';
import DashboardLayout from './admin/components/DashboardLayout';
import Dashboard from './admin/pages/Dashboard';
import AdminProjects from './admin/pages/Projects';
import AdminCertificates from './admin/pages/Certificates';
import AdminMessages from './admin/pages/Messages';
import AdminSettings from './admin/pages/Settings';

function PortfolioApp() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <BackToTop />
          <Navbar />
          <main id="main-content">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Certificates />
            <Services />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          {/* Portfolio */}
          <Route path="/" element={<PortfolioApp />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
