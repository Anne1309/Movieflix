
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import AuthPage from "@/components/AuthPage";
import MainContent from "@/components/MainContent";
import { useToast } from "@/components/ui/use-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    toast({
      title: "Success",
      description: "Logged out successfully!",
    });
  };

  return (
    <>
      {isAuthenticated ? (
        <MainContent onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
      <Toaster />
    </>
  );
}

export default App;
