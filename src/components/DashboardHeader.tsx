
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const DashboardHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 lg:p-6 bg-white border-b space-y-3 sm:space-y-0">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
      <Button onClick={handleLogout} variant="outline" size="sm" className="self-end sm:self-auto">
        <LogOut className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Logout</span>
        <span className="sm:hidden">Exit</span>
      </Button>
    </div>
  );
};
