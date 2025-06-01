
import React, { useState } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileSpreadsheet, FileText, Upload } from 'lucide-react';
import useDailyPortEventsStore from '@/stores/dailyPortEventsStore';
import { DailyPortEvent, EVENT_TYPES, DEPARTMENTS } from '@/types/dailyPortEvents';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const DailyPortEvents = () => {
  const { events, addEvent } = useDailyPortEventsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newEvent, setNewEvent] = useState<Partial<DailyPortEvent>>({
    crrNumber: '',
    dateTime: '',
    attachments: [],
    type: '',
    subType: '',
    location: '',
    description: '',
    responsibleDepartment: '',
    actionTaken: '',
    responseDate: '',
    notes: ''
  });

  const filteredEvents = events.filter(event =>
    event.crrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEvent = () => {
    if (!newEvent.crrNumber || !newEvent.dateTime || !newEvent.type) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const eventToAdd: DailyPortEvent = {
      id: Date.now().toString(),
      crrNumber: newEvent.crrNumber || '',
      dateTime: newEvent.dateTime || '',
      attachments: newEvent.attachments || [],
      type: newEvent.type || '',
      subType: newEvent.subType || '',
      location: newEvent.location || '',
      description: newEvent.description || '',
      responsibleDepartment: newEvent.responsibleDepartment || '',
      actionTaken: newEvent.actionTaken || '',
      responseDate: newEvent.responseDate || '',
      notes: newEvent.notes || ''
    };

    addEvent(eventToAdd);
    setNewEvent({
      crrNumber: '',
      dateTime: '',
      attachments: [],
      type: '',
      subType: '',
      location: '',
      description: '',
      responsibleDepartment: '',
      actionTaken: '',
      responseDate: '',
      notes: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "تم الإضافة بنجاح",
      description: "تم إضافة الحدث الجديد",
    });
  };

  const exportToExcel = () => {
    const excelData = filteredEvents.map((event, index) => ({
      '#': index + 1,
      'CRR Number': event.crrNumber,
      'Date & Time': event.dateTime,
      'Type': event.type,
      'Sub Type': event.subType,
      'Location': event.location,
      'Description': event.description,
      'Responsible Department': event.responsibleDepartment,
      'Action Taken': event.actionTaken,
      'Response Date': event.responseDate,
      'Notes': event.notes
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Port Events');
    XLSX.writeFile(wb, `Daily_Port_Events_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast({
      title: "Excel Export",
      description: "File exported successfully",
    });
  };

  const exportToPDF = () => {
    const pdf = new jsPDF('l', 'mm', 'a4');
    
    pdf.setFontSize(16);
    pdf.text('Daily Port Events Report', 20, 20);
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 20, 30);

    const tableData = filteredEvents.map((event, index) => [
      index + 1,
      event.crrNumber,
      event.dateTime,
      event.type,
      event.subType,
      event.location,
      event.description.substring(0, 50) + '...',
      event.responsibleDepartment,
      event.actionTaken.substring(0, 30) + '...',
      event.responseDate
    ]);

    autoTable(pdf, {
      startY: 40,
      head: [['#', 'CRR Number', 'Date & Time', 'Type', 'Sub Type', 'Location', 'Description', 'Department', 'Action Taken', 'Response Date']],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { left: 10, right: 10 }
    });

    pdf.save(`Daily_Port_Events_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast({
      title: "PDF Export",
      description: "File exported successfully",
    });
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="daily-port-events" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-xl font-bold">Daily Port Events</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-4">
              <p className="text-muted-foreground">Manage and track daily port events and incidents</p>
            </div>

            <div className="flex gap-4 mb-6">
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Event
              </Button>
              <Button onClick={exportToExcel} variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </Button>
              <Button onClick={exportToPDF} variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Export to PDF
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add New Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      placeholder="CRR Number"
                      value={newEvent.crrNumber}
                      onChange={(e) => setNewEvent({...newEvent, crrNumber: e.target.value})}
                    />
                    <Input
                      type="datetime-local"
                      value={newEvent.dateTime}
                      onChange={(e) => setNewEvent({...newEvent, dateTime: e.target.value})}
                    />
                    <div className="flex items-center gap-2">
                      <Input type="file" multiple accept="image/*" className="hidden" id="attachments" />
                      <Button variant="outline" asChild className="gap-2">
                        <label htmlFor="attachments">
                          <Upload className="h-4 w-4" />
                          Attachments
                        </label>
                      </Button>
                    </div>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Sub Type"
                      value={newEvent.subType}
                      onChange={(e) => setNewEvent({...newEvent, subType: e.target.value})}
                    />
                    <Input
                      placeholder="Location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    />
                    <div className="col-span-full">
                      <Textarea
                        placeholder="Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      />
                    </div>
                    <Select value={newEvent.responsibleDepartment} onValueChange={(value) => setNewEvent({...newEvent, responsibleDepartment: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Responsible Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Action Taken"
                      value={newEvent.actionTaken}
                      onChange={(e) => setNewEvent({...newEvent, actionTaken: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newEvent.responseDate}
                      onChange={(e) => setNewEvent({...newEvent, responseDate: e.target.value})}
                    />
                    <div className="col-span-full">
                      <Textarea
                        placeholder="Notes"
                        value={newEvent.notes}
                        onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddEvent}>Add Event</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Events List</CardTitle>
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>CRR Number</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Attachments</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sub Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Responsible Department</TableHead>
                      <TableHead>Action Taken</TableHead>
                      <TableHead>Response Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event, index) => (
                      <TableRow key={event.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{event.crrNumber}</TableCell>
                        <TableCell>{event.dateTime}</TableCell>
                        <TableCell>{event.attachments.length} files</TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{event.subType}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                        <TableCell>{event.responsibleDepartment}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.actionTaken}</TableCell>
                        <TableCell>{event.responseDate}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DailyPortEvents;
