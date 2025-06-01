
import React from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarIncreasing, ChartLine, ChartPie } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useIncidentStore from "@/stores/incidents";
import { format, subDays, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

const DashboardCharts = () => {
  const { incidents } = useIncidentStore();

  // إحصائيات البلاغات حسب الأيام (آخر 7 أيام)
  const incidentsByDayData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayName = format(date, 'EEEE', { locale: ar });
      
      const count = incidents.filter(incident => incident.date === dateString).length;
      
      return {
        day: dayName,
        count,
        date: dateString
      };
    });
    
    return last7Days;
  }, [incidents]);

  // إحصائيات حالات البلاغات للرسم البياني الدائري
  const incidentsStatusData = React.useMemo(() => {
    const statusCounts = incidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [incidents]);

  // إحصائيات أنواع البلاغات للرسم البياني العمودي
  const incidentTypesData = React.useMemo(() => {
    const typeCounts = incidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([name, count]) => ({
      name,
      count
    }));
  }, [incidents]);

  const STATUS_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F97316']; // أحمر، أزرق، أخضر، أصفر، بنفسجي، برتقالي
  const TYPE_COLORS = '#3B82F6'; // أزرق للرسم العمودي

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-6">
      {/* Incidents by Day (Line Chart) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">البلاغات حسب الأيام (آخر 7 أيام)</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={incidentsByDayData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'عدد البلاغات']}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${label} (${payload[0].payload.date})`;
                  }
                  return label;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="عدد البلاغات"
                stroke="#3B82F6"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Incidents Status (Pie Chart) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">حالة البلاغات</CardTitle>
          <ChartPie className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentsStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {incidentsStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'عدد البلاغات']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Incident Types (Vertical Bar Chart) */}
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">أنواع البلاغات</CardTitle>
          <ChartBarIncreasing className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={incidentTypesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'عدد البلاغات']} />
              <Legend />
              <Bar 
                dataKey="count" 
                name="عدد البلاغات"
                fill={TYPE_COLORS}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
