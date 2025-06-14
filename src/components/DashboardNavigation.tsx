
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, MapPin, ShoppingBag, Star } from 'lucide-react';

interface DashboardNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const DashboardNavigation = ({ currentView, onViewChange }: DashboardNavigationProps) => {
  const navigationItems = [
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'address', label: 'Saved Address', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "outline"}
              onClick={() => onViewChange(item.id)}
              className="flex flex-col items-center justify-center h-16 text-xs sm:text-sm"
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">{item.label}</span>
              <span className="sm:hidden">{item.label.split(' ')[0]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardNavigation;
