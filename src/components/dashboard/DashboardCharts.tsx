
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

// Sample data for incidents by day
const incidentsByDayData = [
  { day: "السبت", count: 5 },
  { day: "الأحد", count: 3 },
  { day: "الإثنين", count: 7 },
  { day: "الثلاثاء", count: 2 },
  { day: "الأربعاء", count: 6 },
  { day: "الخميس", count: 4 },
  { day: "الجمعة", count: 1 }
];

// Sample data for incident types
const incidentTypesData = [
  { name: "سرقة", value: 8 },
  { name: "تخريب", value: 5 },
  { name: "تسلل", value: 3 },
  { name: "أخرى", value: 4 }
];

// Sample data for incidents status
const incidentsStatusData = [
  { name: "جاري المعالجة", count: 8 },
  { name: "مغلق", count: 12 },
  { name: "جديد", count: 4 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardCharts = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-6">
      {/* Incidents by Day (Line Chart) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">البلاغات حسب الأيام</CardTitle>
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
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="عدد البلاغات"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Incident Types (Pie Chart) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">أنواع البلاغات</CardTitle>
          <ChartPie className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {incidentTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'عدد البلاغات']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Incidents Status (Bar Chart) */}
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">حالة البلاغات</CardTitle>
          <ChartBarIncreasing className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[300px]"
            config={{
              "جديد": {
                color: "#FFBB28",
              },
              "جاري المعالجة": {
                color: "#0088FE",
              },
              "مغلق": {
                color: "#00C49F",
              },
            }}
          >
            <BarChart data={incidentsStatusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="line"
                    nameKey="name"
                    formatter={(value) => [value, "عدد البلاغات"]}
                  />
                }
              />
              <Bar dataKey="count" name="عدد البلاغات" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
