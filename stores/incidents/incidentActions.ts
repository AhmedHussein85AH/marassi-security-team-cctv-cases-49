
import { Incident, Comment } from "@/types/incident";

export interface IncidentActions {
  updateIncident: (updatedIncident: Incident) => void;
  addIncident: (newIncident: Incident) => void;
  deleteIncident: (id: string) => void;
  addComment: (incidentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  updateStatus: (incidentId: string, newStatus: string, operatorNotes?: string) => void;
  assignIncident: (incidentId: string, userId: string) => void;
  addIncidentImage: (incidentId: string, imageUrl: string) => void;
  removeIncidentImage: (incidentId: string, imageIndex: number) => void;
}

export const createIncidentActions = (set: any): IncidentActions => ({
  updateIncident: (updatedIncident: Incident) => {
    set(state => ({
      incidents: state.incidents.map(incident =>
        incident.id === updatedIncident.id ? 
          { 
            ...updatedIncident,
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16) 
          } : incident
      )
    }));
  },

  addIncident: (newIncident: Incident) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const incidentWithMetadata = {
      ...newIncident,
      createdAt: now,
      lastUpdated: now,
      attachments: newIncident.attachments || [],
      images: newIncident.images || [],
      priority: newIncident.priority || "متوسط",
      category: newIncident.category || "أمني"
    };
    
    set(state => ({
      incidents: [...state.incidents, incidentWithMetadata]
    }));
  },
  
  deleteIncident: (id: string) => {
    set(state => ({
      incidents: state.incidents.filter(incident => incident.id !== id)
    }));
  },
  
  addComment: (incidentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const newComment = {
      id: `com-${Date.now()}`,
      ...comment,
      timestamp: now.split(' ')[1]
    };
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incident.id === incidentId ?
          {
            ...incident,
            comments: [...incident.comments, newComment],
            lastUpdated: now
          } : incident
      )
    }));
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
            lastUpdated: now
          } : incident
      )
    }));
  },
  
  assignIncident: (incidentId: string, userId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    set(state => ({
      incidents: state.incidents.map(incident => 
        incident.id === incidentId ?
          {
            ...incident,
            assignedTo: userId,
            lastUpdated: now
          } : incident
      )
    }));
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
  }
});
