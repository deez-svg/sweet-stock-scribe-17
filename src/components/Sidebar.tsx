
import React from 'react';
import { 
  Home, 
  Package, 
  Factory, 
  BarChart3, 
  Settings,
  Store,
  Candy,
  Coffee,
  Cake
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onMobileMenuClick?: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, onMobileMenuClick }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { 
      id: 'production', 
      label: 'Production', 
      icon: Factory,
      submenu: [
        { id: 'production-sweets', label: 'Sweets', icon: Candy },
        { id: 'production-savouries', label: 'Savouries', icon: Coffee },
        { id: 'production-bakery', label: 'Bakery', icon: Cake },
      ]
    },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleProductionClick = () => {
    // If not already in a production section, default to sweets
    if (!activeTab.startsWith('production')) {
      setActiveTab('production-sweets');
    }
    onMobileMenuClick?.();
  };

  const handleMenuClick = (itemId: string) => {
    setActiveTab(itemId);
    onMobileMenuClick?.();
  };

  return (
    <div className="w-64 lg:w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-4 lg:p-6 border-b">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
          <h1 className="text-lg lg:text-xl font-bold text-gray-800">Inventory Pro</h1>
        </div>
      </div>
      
      <nav className="mt-4 lg:mt-6 flex-1 overflow-y-auto">
        <ul className="space-y-1 lg:space-y-2 px-3 lg:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isProductionActive = activeTab.startsWith('production');
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => hasSubmenu ? handleProductionClick() : handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-left transition-colors duration-200 ${
                    (activeTab === item.id || (item.id === 'production' && isProductionActive))
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                </button>
                
                {hasSubmenu && isProductionActive && (
                  <ul className="ml-6 lg:ml-8 mt-1 lg:mt-2 space-y-1">
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <li key={subItem.id}>
                          <button
                            onClick={() => handleMenuClick(subItem.id)}
                            className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                              activeTab === subItem.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            <SubIcon className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                            <span className="text-xs lg:text-sm">{subItem.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-3 lg:p-4 border-t bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">Inventory Management System</p>
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};
