import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <div className="min-h-screen bg-background">
        <main className="flex min-h-screen flex-col">
          <div className="flex flex-1">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <Routes>
                <Route path="/" element={<div className="text-center py-8">
                  <h1 className="text-4xl font-bold mb-4">نظام إدارة الأمن</h1>
                  <p className="text-xl text-gray-600">مرحباً بكم في نظام إدارة الأمن</p>
                </div>} />
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