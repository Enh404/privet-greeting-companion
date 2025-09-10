import React, { useState, useEffect } from 'react';
import { Event, EventType, CreateEventRequest, UpdateEventRequest } from '@/types/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface EventFormProps {
  event?: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState<number | undefined>(undefined);
  const [activateDate, setActivateDate] = useState('');
  const [activateTime, setActivateTime] = useState('');
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setName(event.name);
      setTypeId(event.type?.id);
      setActivateDate(event.activateDate || '');
      setActivateTime(event.activateTime || '');
    } else {
      setName('');
      setTypeId(undefined);
      setActivateDate('');
      setActivateTime('');
    }
  }, [event, open]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const types = await apiClient.getEventTypes();
        setEventTypes(types);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить типы событий',
          variant: 'destructive',
        });
      }
    };

    if (open) {
      fetchEventTypes();
    }
  }, [open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const activateAt = activateDate && activateTime 
        ? `${activateDate} ${activateTime}`
        : activateDate || undefined;

      if (event) {
        const updateData: UpdateEventRequest = {
          name,
          type_id: typeId,
          activate_at: activateAt,
        };
        await apiClient.updateEvent(event.id, updateData);
        toast({
          title: 'Успешно',
          description: 'Событие обновлено',
        });
      } else {
        const createData: CreateEventRequest = {
          name,
          type_id: typeId,
          activate_at: activateAt,
        };
        await apiClient.createEvent(createData);
        toast({
          title: 'Успешно',
          description: 'Событие создано',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: event ? 'Не удалось обновить событие' : 'Не удалось создать событие',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Редактировать событие' : 'Создать событие'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название события"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Тип события</Label>
            <Select value={typeId?.toString()} onValueChange={(value) => setTypeId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип события" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Без типа</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Дата
              </Label>
              <Input
                id="date"
                type="date"
                value={activateDate}
                onChange={(e) => setActivateDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Время
              </Label>
              <Input
                id="time"
                type="time"
                value={activateTime}
                onChange={(e) => setActivateTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : (event ? 'Сохранить' : 'Создать')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};