import React, { useState } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileSpreadsheet, FileText, Upload, Pencil, Search } from 'lucide-react';
import useDailyPortEventsStore from '@/stores/dailyPortEventsStore';
import { DailyPortEvent, EVENT_TYPES, SUB_TYPES, LOCATIONS, DEPARTMENTS } from '@/types/dailyPortEvents';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const DailyPortEvents = () => {
  const { events, addEvent, updateEvent } = useDailyPortEventsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DailyPortEvent | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
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

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setNewEvent(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...files]
      }));
      
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    setNewEvent(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const filteredEvents = events.filter(event =>
    event.crrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEvent = async () => {
    if (!newEvent.crrNumber || !newEvent.dateTime || !newEvent.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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

    await addEvent(eventToAdd);
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
    setImagePreviews([]);
    
    toast({
      title: "Success",
      description: "Event added successfully",
    });
  };

  const handleEdit = (event: DailyPortEvent) => {
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    setEditingEvent(event);
    setNewEvent({
      crrNumber: event.crrNumber,
      dateTime: event.dateTime,
      attachments: event.attachments,
      type: event.type,
      subType: event.subType,
      location: event.location,
      description: event.description,
      responsibleDepartment: event.responsibleDepartment,
      actionTaken: event.actionTaken,
      responseDate: event.responseDate,
      notes: event.notes
    });

    if (event.attachments && event.attachments.length > 0) {
      const previews = event.attachments.map(file => {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        } else if (typeof file === 'string') {
          return file;
        }
        return '';
      }).filter(url => url !== '');
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
    setShowAddForm(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !newEvent.crrNumber || !newEvent.dateTime || !newEvent.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedEvent: DailyPortEvent = {
      ...editingEvent,
      crrNumber: newEvent.crrNumber,
      dateTime: newEvent.dateTime,
      attachments: newEvent.attachments || [],
      type: newEvent.type,
      subType: newEvent.subType || '',
      location: newEvent.location || '',
      description: newEvent.description || '',
      responsibleDepartment: newEvent.responsibleDepartment || '',
      actionTaken: newEvent.actionTaken || '',
      responseDate: newEvent.responseDate || '',
      notes: newEvent.notes || ''
    };

    await updateEvent(updatedEvent);
    setEditingEvent(null);
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
    setImagePreviews([]);
    
    toast({
      title: "Success",
      description: "Event updated successfully",
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

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const exportSelectedToExcel = () => {
    if (selectedEvents.length === 0) {
      toast({
        title: "Warning",
        description: "Please select events to export",
        variant: "destructive",
      });
      return;
    }

    const selectedData = filteredEvents
      .filter(event => selectedEvents.includes(event.id))
      .map((event, index) => ({
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

    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Port Events');
    XLSX.writeFile(wb, `Daily_Port_Events_Selected_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast({
      title: "Excel Export",
      description: "Selected events exported successfully",
    });
  };

  React.useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="ltr">
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
                Export All to Excel
              </Button>
              <Button onClick={exportSelectedToExcel} variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export Selected to Excel
              </Button>
              <Button onClick={exportToPDF} variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Export to PDF
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CRR Number</label>
                      <Input
                        placeholder="Enter CRR Number"
                        value={newEvent.crrNumber}
                        onChange={(e) => setNewEvent({...newEvent, crrNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={newEvent.dateTime}
                        onChange={(e) => setNewEvent({...newEvent, dateTime: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Attachments</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          id="attachments"
                          onChange={handleImageChange}
                        />
                        <Button variant="outline" asChild className="gap-2">
                          <label htmlFor="attachments">
                            <Upload className="h-4 w-4" />
                            Add Images
                          </label>
                        </Button>
                      </div>
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {imagePreviews.map((src, index) => (
                            <div key={index} className="relative">
                              <img src={src} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Event Type</label>
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-3 pb-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-9 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search type..."
                              onChange={(e) => {
                                const searchWords = e.target.value.toLowerCase().split(' ').filter(word => word.length > 0);
                                const selectContent = e.target.closest('.select-content');
                                if (selectContent) {
                                  const items = selectContent.querySelectorAll('.select-item');
                                  items.forEach(item => {
                                    const text = item.textContent?.toLowerCase() || '';
                                    const isVisible = searchWords.every(word => text.includes(word));
                                    item.style.display = isVisible ? '' : 'none';
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {EVENT_TYPES.map(type => (
                              <SelectItem key={type} value={type} className="select-item">{type}</SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sub Type</label>
                      <Select value={newEvent.subType} onValueChange={(value) => setNewEvent({...newEvent, subType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sub Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-3 pb-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-9 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search sub type..."
                              onChange={(e) => {
                                const searchWords = e.target.value.toLowerCase().split(' ').filter(word => word.length > 0);
                                const selectContent = e.target.closest('.select-content');
                                if (selectContent) {
                                  const items = selectContent.querySelectorAll('.select-item');
                                  items.forEach(item => {
                                    const text = item.textContent?.toLowerCase() || '';
                                    const isVisible = searchWords.every(word => text.includes(word));
                                    item.style.display = isVisible ? '' : 'none';
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {SUB_TYPES.map(type => (
                              <SelectItem key={type} value={type} className="select-item">{type}</SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Select value={newEvent.location} onValueChange={(value) => setNewEvent({...newEvent, location: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center px-3 pb-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-9 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search location..."
                              onChange={(e) => {
                                const searchWords = e.target.value.toLowerCase().split(' ').filter(word => word.length > 0);
                                const selectContent = e.target.closest('.select-content');
                                if (selectContent) {
                                  const items = selectContent.querySelectorAll('.select-item');
                                  items.forEach(item => {
                                    const text = item.textContent?.toLowerCase() || '';
                                    const isVisible = searchWords.every(word => text.includes(word));
                                    item.style.display = isVisible ? '' : 'none';
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {LOCATIONS.map(location => (
                              <SelectItem key={location} value={location} className="select-item">{location}</SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Enter Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Responsible Department</label>
                      <Select value={newEvent.responsibleDepartment} onValueChange={(value) => setNewEvent({...newEvent, responsibleDepartment: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Action Taken</label>
                      <Input
                        placeholder="Enter Action Taken"
                        value={newEvent.actionTaken}
                        onChange={(e) => setNewEvent({...newEvent, actionTaken: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Response Date</label>
                      <Input
                        type="date"
                        value={newEvent.responseDate}
                        onChange={(e) => setNewEvent({...newEvent, responseDate: e.target.value})}
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea
                        placeholder="Enter Notes"
                        value={newEvent.notes}
                        onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                      {editingEvent ? 'Update Event' : 'Add Event'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowAddForm(false);
                      setEditingEvent(null);
                      setImagePreviews([]);
                    }}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Events List</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedEvents.length === filteredEvents.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event, index) => (
                      <TableRow 
                        key={event.id}
                        className={selectedEvents.includes(event.id) ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedEvents.includes(event.id)}
                            onCheckedChange={() => handleSelectEvent(event.id)}
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{event.crrNumber}</TableCell>
                        <TableCell>{event.dateTime}</TableCell>
                        <TableCell>
                          {event.attachments && event.attachments.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span>{event.attachments.length} files</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  event.attachments.forEach(file => {
                                    if (typeof file === 'string') {
                                      window.open(file, '_blank');
                                    }
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            "No attachments"
                          )}
                        </TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{event.subType}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                        <TableCell>{event.responsibleDepartment}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.actionTaken}</TableCell>
                        <TableCell>{event.responseDate}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.notes}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(event)}
                            title="Edit event"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
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
