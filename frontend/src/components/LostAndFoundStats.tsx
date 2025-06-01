import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LostAndFoundItem } from '@/services/lostAndFoundService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LostAndFoundStatsProps {
  items: LostAndFoundItem[];
}

export function LostAndFoundStats({ items }: LostAndFoundStatsProps) {
  const stats = {
    total: items.length,
    found: items.filter(item => item.type === 'found').length,
    lost: items.filter(item => item.type === 'lost').length,
    delivered: items.filter(item => item.status === 'delivered').length,
    inStorage: items.filter(item => item.status === 'in_storage').length,
    pending: items.filter(item => item.status === 'pending').length,
    highValue: items.filter(item => item.value === 'high').length,
    lowValue: items.filter(item => item.value === 'low').length,
  };

  const monthlyData = items.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    if (!acc[monthYear]) {
      acc[monthYear] = { found: 0, lost: 0 };
    }
    if (item.type === 'found') {
      acc[monthYear].found++;
    } else {
      acc[monthYear].lost++;
    }
    return acc;
  }, {} as Record<string, { found: number; lost: number }>);

  const chartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    found: data.found,
    lost: data.lost,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي العناصر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.found} معثورات و {stats.lost} مفقودات
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">حالة العناصر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.delivered + stats.inStorage + stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            {stats.delivered} تم التسليم، {stats.inStorage} في المخزن، {stats.pending} قيد الانتظار
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">قيمة العناصر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.highValue + stats.lowValue}</div>
          <p className="text-xs text-muted-foreground">
            {stats.highValue} غالية و {stats.lowValue} رخيصة
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">نسبة التسليم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            من إجمالي العناصر تم تسليمها
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>إحصائيات شهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="found" name="معثورات" fill="#22c55e" />
                <Bar dataKey="lost" name="مفقودات" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 