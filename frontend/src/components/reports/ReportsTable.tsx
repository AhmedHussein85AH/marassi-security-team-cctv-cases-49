
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from 'lucide-react';
import type { Incident } from "@/types/incident";

interface ReportsTableProps {
  reports: Incident[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, searchTerm, setSearchTerm }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>قائمة البلاغات</CardTitle>
        <p className="text-sm text-muted-foreground">جميع البلاغات المسجلة في النظام</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="البحث عن البلاغات..."
            className="max-w-sm text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-right">رقم البلاغ</TableHead>
              <TableHead className="w-[150px] text-right">نوع البلاغ</TableHead>
              <TableHead className="w-[200px] text-right">الموقع</TableHead>
              <TableHead className="w-[120px] text-right">التاريخ</TableHead>
              <TableHead className="w-[100px] text-right">الوقت</TableHead>
              <TableHead className="w-[130px] text-right">الحالة</TableHead>
              <TableHead className="w-[150px] text-right">المبلغ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="text-right">{report.id}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center">
                    <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                    {report.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">{report.location}</TableCell>
                <TableCell className="text-right">{report.date}</TableCell>
                <TableCell className="text-right">{report.time}</TableCell>
                <TableCell className="text-right">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    report.status === 'تم المعالجة' ? 'bg-green-100 text-green-800' :
                    report.status === 'قيد المعالجة' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {report.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">{report.reporter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReportsTable;
