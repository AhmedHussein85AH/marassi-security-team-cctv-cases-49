import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <div className="min-h-screen bg-background">
        <main className="flex min-h-screen flex-col">
          <div className="flex flex-1">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;