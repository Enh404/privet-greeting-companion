import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { EventCard } from '@/components/events/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Event, EventType } from '@/types/api';

export const CompletedEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompletedEvents = async () => {
    try {
      let data;
      const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
      
      if (selectedEventType === 'all') {
        data = await apiClient.getCompletedEvents(dateParam);
      } else {
        data = await apiClient.getCompletedEventsByType(selectedEventType, dateParam);
      }
      setEvents(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить выполненные события",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const data = await apiClient.getEventTypes();
      setEventTypes(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить типы событий",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCompletedEvents();
    fetchEventTypes();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchCompletedEvents();
  }, [selectedEventType, selectedDate]);

  const handleToggleStatus = async (id: number) => {
    try {
      await apiClient.toggleEventStatus(id);
      toast({
        title: "Статус изменен",
        description: "Событие перемещено в активные",
      });
      fetchCompletedEvents();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус события",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteEvent(id);
      toast({
        title: "Событие удалено",
        description: "Событие успешно удалено",
      });
      fetchCompletedEvents();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить событие",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: Event) => {
    // For now, just show a message that editing is not available on this page
    toast({
      title: "Редактирование недоступно",
      description: "Перейдите на главную страницу для редактирования",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Фильтр по дате</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              {selectedDate && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedDate(undefined)}
                  className="w-full mt-2"
                >
                  Сбросить дату
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Выполненные события
                </CardTitle>
                <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Все типы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.id} value={type.code}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Нет выполненных событий
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CompletedEvents;