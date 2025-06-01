import { Incident, Comment } from "@/types/incident";
import { userService } from "./userService";
import { toast } from "sonner";

// واجهة إحصائيات الحوادث
interface IncidentStats {
  totalIncidents: number;
  incidentsByStatus: Record<string, number>;
  incidentsByPriority: Record<string, number>;
  incidentsByCategory: Record<string, number>;
  recentIncidents: number;
  averageResolutionTime: number;
}

// واجهة بيانات الحادث للتصدير
interface IncidentExportData {
  '#': number;
  'معرف الحادث': string;
  'العنوان': string;
  'الوصف': string;
  'الحالة': string;
  'الأولوية': string;
  'الفئة': string;
  'المسؤول': string;
  'تاريخ الإنشاء': string;
  'آخر تحديث': string;
}

export interface IncidentActions {
  updateIncident: (updatedIncident: Incident) => void;
  addIncident: (newIncident: Incident) => void;
  deleteIncident: (id: string) => void;
  addComment: (incidentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  updateStatus: (incidentId: string, newStatus: string, operatorNotes?: string) => void;
  assignIncident: (incidentId: string, userId: string) => void;
  addIncidentImage: (incidentId: string, imageUrl: string) => void;
  removeIncidentImage: (incidentId: string, imageIndex: number) => void;
  getIncidentStats: () => Promise<IncidentStats>;
  exportIncidentsToExcel: () => Promise<Blob>;
  searchIncidents: (query: string) => Promise<Incident[]>;
  getIncidentsByStatus: (status: string) => Promise<Incident[]>;
  getIncidentsByPriority: (priority: string) => Promise<Incident[]>;
  getIncidentsByCategory: (category: string) => Promise<Incident[]>;
  getIncidentsByUser: (userId: string) => Promise<Incident[]>;
  getRecentIncidents: (days: number) => Promise<Incident[]>;
  bulkUpdateIncidents: (incidentIds: string[], updates: Partial<Incident>) => void;
  mergeIncidents: (sourceId: string, targetId: string) => void;
  duplicateIncident: (incidentId: string) => void;
  archiveIncident: (incidentId: string) => void;
  restoreIncident: (incidentId: string) => void;
}

export const createIncidentActions = (set: any): IncidentActions => ({
  updateIncident: (updatedIncident: Incident) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident =>
        incident.id === updatedIncident.id ? 
          { 
            ...updatedIncident,
            lastUpdated: now,
            updatedBy: updatedIncident.updatedBy || incident.updatedBy
          } : incident
      )
    }));

    toast.success('تم تحديث الحادث بنجاح');
  },

  addIncident: (newIncident: Incident) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const incidentWithMetadata = {
      ...newIncident,
      id: `inc-${Date.now()}`,
      createdAt: now,
      lastUpdated: now,
      attachments: newIncident.attachments || [],
      images: newIncident.images || [],
      priority: newIncident.priority || "متوسط",
      category: newIncident.category || "أمني",
      status: newIncident.status || "جديد",
      comments: [],
      createdBy: newIncident.createdBy,
      updatedBy: newIncident.createdBy
    };
    
    set(state => ({
      incidents: [...state.incidents, incidentWithMetadata]
    }));

    toast.success('تم إضافة الحادث بنجاح');
  },
  
  deleteIncident: (id: string) => {
    set(state => ({
      incidents: state.incidents.filter(incident => incident.id !== id)
    }));

    toast.success('تم حذف الحادث بنجاح');
  },
  
  addComment: (incidentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const newComment = {
      id: `com-${Date.now()}`,
      ...comment,
      timestamp: now
    };
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incident.id === incidentId ?
          {
            ...incident,
            comments: [...(incident.comments || []), newComment],
            lastUpdated: now,
            updatedBy: comment.userId
          } : incident
      )
    }));

    toast.success('تم إضافة التعليق بنجاح');
  },
  
  updateStatus: (incidentId: string, newStatus: string, operatorNotes?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incident.id === incidentId ?
          {
            ...incident,
            status: newStatus,
            operatorNotes: operatorNotes !== undefined ? operatorNotes : incident.operatorNotes,
            lastUpdated: now,
            statusHistory: [
              ...(incident.statusHistory || []),
              {
                status: newStatus,
                timestamp: now,
                notes: operatorNotes
              }
            ]
          } : incident
      )
    }));

    toast.success('تم تحديث حالة الحادث بنجاح');
  },
  
  assignIncident: async (incidentId: string, userId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    try {
      const user = await userService.getUserById(parseInt(userId));
      
      set(state => ({
        incidents: state.incidents.map(incident => 
          incident.id === incidentId ?
            {
              ...incident,
              assignedTo: userId,
              assignedToName: user.name,
              lastUpdated: now,
              assignmentHistory: [
                ...(incident.assignmentHistory || []),
                {
                  userId,
                  userName: user.name,
                  timestamp: now
                }
              ]
            } : incident
        )
      }));

      toast.success('تم تعيين الحادث بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تعيين الحادث');
    }
  },

  addIncidentImage: (incidentId: string, imageUrl: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incident.id === incidentId ?
          {
            ...incident,
            images: [...(incident.images || []), imageUrl],
            lastUpdated: now
          } : incident
      )
    }));

    toast.success('تم إضافة الصورة بنجاح');
  },

  removeIncidentImage: (incidentId: string, imageIndex: number) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident => {
        if (incident.id === incidentId && incident.images) {
          const updatedImages = [...incident.images];
          updatedImages.splice(imageIndex, 1);
          
          return {
            ...incident,
            images: updatedImages,
            lastUpdated: now
          };
        }
        return incident;
      })
    }));

    toast.success('تم حذف الصورة بنجاح');
  },

  getIncidentStats: async (): Promise<IncidentStats> => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return new Promise((resolve) => {
      set(state => {
        const stats: IncidentStats = {
          totalIncidents: state.incidents.length,
          incidentsByStatus: {},
          incidentsByPriority: {},
          incidentsByCategory: {},
          recentIncidents: state.incidents.filter(incident => {
            const incidentDate = new Date(incident.createdAt);
            return incidentDate >= thirtyDaysAgo;
          }).length,
          averageResolutionTime: 0
        };

        // حساب الإحصائيات
        state.incidents.forEach(incident => {
          stats.incidentsByStatus[incident.status] = (stats.incidentsByStatus[incident.status] || 0) + 1;
          stats.incidentsByPriority[incident.priority] = (stats.incidentsByPriority[incident.priority] || 0) + 1;
          stats.incidentsByCategory[incident.category] = (stats.incidentsByCategory[incident.category] || 0) + 1;
        });

        resolve(stats);
        return state;
      });
    });
  },

  exportIncidentsToExcel: async (): Promise<Blob> => {
    return new Promise((resolve) => {
      set(state => {
        const incidentsData: IncidentExportData[] = state.incidents.map((incident, index) => ({
          '#': index + 1,
          'معرف الحادث': incident.id,
          'العنوان': incident.title,
          'الوصف': incident.description,
          'الحالة': incident.status,
          'الأولوية': incident.priority,
          'الفئة': incident.category,
          'المسؤول': incident.assignedToName || 'غير معين',
          'تاريخ الإنشاء': incident.createdAt,
          'آخر تحديث': incident.lastUpdated
        }));

        const ws = XLSX.utils.json_to_sheet(incidentsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Incidents');
        
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        resolve(blob);
        return state;
      });
    });
  },

  searchIncidents: async (query: string): Promise<Incident[]> => {
    return new Promise((resolve) => {
      set(state => {
        const searchTerm = query.toLowerCase();
        const results = state.incidents.filter(incident => 
          incident.title.toLowerCase().includes(searchTerm) ||
          incident.description.toLowerCase().includes(searchTerm) ||
          incident.category.toLowerCase().includes(searchTerm) ||
          incident.status.toLowerCase().includes(searchTerm)
        );
        resolve(results);
        return state;
      });
    });
  },

  getIncidentsByStatus: async (status: string): Promise<Incident[]> => {
    return new Promise((resolve) => {
      set(state => {
        const results = state.incidents.filter(incident => incident.status === status);
        resolve(results);
        return state;
      });
    });
  },

  getIncidentsByPriority: async (priority: string): Promise<Incident[]> => {
    return new Promise((resolve) => {
      set(state => {
        const results = state.incidents.filter(incident => incident.priority === priority);
        resolve(results);
        return state;
      });
    });
  },

  getIncidentsByCategory: async (category: string): Promise<Incident[]> => {
    return new Promise((resolve) => {
      set(state => {
        const results = state.incidents.filter(incident => incident.category === category);
        resolve(results);
        return state;
      });
    });
  },

  getIncidentsByUser: async (userId: string): Promise<Incident[]> => {
    return new Promise((resolve) => {
      set(state => {
        const results = state.incidents.filter(incident => incident.assignedTo === userId);
        resolve(results);
        return state;
      });
    });
  },

  getRecentIncidents: async (days: number): Promise<Incident[]> => {
    return new Promise((resolve) => {
      set(state => {
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        
        const results = state.incidents.filter(incident => {
          const incidentDate = new Date(incident.createdAt);
          return incidentDate >= cutoffDate;
        });
        
        resolve(results);
        return state;
      });
    });
  },

  bulkUpdateIncidents: (incidentIds: string[], updates: Partial<Incident>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incidentIds.includes(incident.id) ?
          {
            ...incident,
            ...updates,
            lastUpdated: now
          } : incident
      )
    }));

    toast.success('تم تحديث الحوادث بنجاح');
  },

  mergeIncidents: (sourceId: string, targetId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => {
      const sourceIncident = state.incidents.find(inc => inc.id === sourceId);
      const targetIncident = state.incidents.find(inc => inc.id === targetId);
      
      if (!sourceIncident || !targetIncident) {
        toast.error('لم يتم العثور على الحوادث المحددة');
        return state;
      }

      // دمج التعليقات والصور
      const mergedIncident = {
        ...targetIncident,
        comments: [
          ...(targetIncident.comments || []),
          ...(sourceIncident.comments || []),
          {
            id: `com-${Date.now()}`,
            userId: 'system',
            userName: 'النظام',
            content: `تم دمج هذا الحادث مع الحادث ${sourceId}`,
            timestamp: now
          }
        ],
        images: [
          ...(targetIncident.images || []),
          ...(sourceIncident.images || [])
        ],
        lastUpdated: now
      };

      return {
        incidents: [
          ...state.incidents.filter(inc => inc.id !== sourceId && inc.id !== targetId),
          mergedIncident
        ]
      };
    });

    toast.success('تم دمج الحوادث بنجاح');
  },

  duplicateIncident: (incidentId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => {
      const incidentToDuplicate = state.incidents.find(inc => inc.id === incidentId);
      
      if (!incidentToDuplicate) {
        toast.error('لم يتم العثور على الحادث');
        return state;
      }

      const duplicatedIncident = {
        ...incidentToDuplicate,
        id: `inc-${Date.now()}`,
        title: `${incidentToDuplicate.title} (نسخة)`,
        createdAt: now,
        lastUpdated: now,
        status: 'جديد',
        comments: [],
        images: [...(incidentToDuplicate.images || [])]
      };

      return {
        incidents: [...state.incidents, duplicatedIncident]
      };
    });

    toast.success('تم نسخ الحادث بنجاح');
  },

  archiveIncident: (incidentId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incident.id === incidentId ?
          {
            ...incident,
            isArchived: true,
            archivedAt: now,
            lastUpdated: now
          } : incident
      )
    }));

    toast.success('تم أرشفة الحادث بنجاح');
  },

  restoreIncident: (incidentId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incident.id === incidentId ?
          {
            ...incident,
            isArchived: false,
            archivedAt: undefined,
            lastUpdated: now
          } : incident
      )
    }));

    toast.success('تم استعادة الحادث بنجاح');
  }
}); 