import React from 'react';
import { Event, EventType } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle2, Circle, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onToggleStatus: (id: number) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const getEventTypeColor = (type: EventType | null) => {
  if (!type) return 'bg-muted text-muted-foreground';
  
  switch (type.code) {
    case 'birthday':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'work':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'holiday':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onToggleStatus, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
      event.completed && "opacity-70"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={cn(
              "text-lg mb-2 transition-colors",
              event.completed && "line-through text-muted-foreground"
            )}>
              {event.name}
            </CardTitle>
            {event.type && (
              <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                {event.type.name}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStatus(event.id)}
            className="shrink-0 ml-2"
          >
            {event.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {(event.activateDate || event.activateTime) && (
          <CardDescription className="flex items-center gap-4 mb-4 text-sm">
            {event.activateDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.activateDate).toLocaleDateString('ru-RU')}</span>
              </div>
            )}
            {event.activateTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{event.activateTime}</span>
              </div>
            )}
          </CardDescription>
        )}
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(event)}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(event.id)}
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};