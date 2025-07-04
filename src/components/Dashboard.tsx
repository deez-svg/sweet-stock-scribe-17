
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInventory } from '@/hooks/useInventory';
import { AlertTriangle, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import { DashboardHeader } from '@/components/DashboardHeader';

export const Dashboard = () => {
  const { rawMaterials, getLowStockItems, getStockStatus, transactions, productionLogs } = useInventory();
  
  const lowStockItems = getLowStockItems();
  const totalValue = rawMaterials.reduce((sum, material) => sum + (material.currentStock * material.costPerUnit), 0);
  const recentTransactions = transactions.slice(0, 5);
  const todayProduction = productionLogs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across all materials</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-amber-600">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-green-600">{todayProduction}</div>
              <p className="text-xs text-muted-foreground">Products completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">{rawMaterials.length}</div>
              <p className="text-xs text-muted-foreground">Raw materials tracked</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Overview */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Raw Materials Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rawMaterials.map((material) => {
                  const status = getStockStatus(material);
                  const percentage = (material.currentStock / (material.minStockLevel * 3)) * 100;
                  
                  return (
                    <div key={material.id} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-medium text-sm lg:text-base">{material.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {material.currentStock.toLocaleString()}{material.unit}
                          </span>
                          <Badge variant={status === 'critical' ? 'destructive' : status === 'warning' ? 'secondary' : 'default'}>
                            {status}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            status === 'critical' ? 'bg-red-500' : 
                            status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 lg:space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => {
                    const material = rawMaterials.find(m => m.id === transaction.materialId);
                    return (
                      <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm lg:text-base">{material?.name || 'Unknown Material'}</p>
                          <p className="text-xs lg:text-sm text-gray-600">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right sm:text-left sm:ml-4">
                          <p className={`font-bold text-sm lg:text-base ${transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}{material?.unit}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm lg:text-base">No recent transactions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts with item names */}
        {lowStockItems.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center text-lg lg:text-xl">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Low Stock Alerts - Items Need Restocking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {lowStockItems.map((material) => (
                  <div key={material.id} className="bg-white p-4 rounded-lg border border-amber-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-900 text-sm lg:text-base">{material.name}</h4>
                        <p className="text-xs lg:text-sm text-gray-600">
                          Current: {material.currentStock}{material.unit} | 
                          Min: {material.minStockLevel}{material.unit}
                        </p>
                        <p className="text-xs text-amber-700 font-medium mt-1">
                          Need to restock: {Math.max(0, material.minStockLevel - material.currentStock)}{material.unit}
                        </p>
                      </div>
                      <Badge variant="destructive" className="self-start sm:self-center">Restock</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
