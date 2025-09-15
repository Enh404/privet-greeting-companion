import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { EventCard } from '@/components/events/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Event } from '@/types/api';

export const CompletedEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompletedEvents = async () => {
    try {
      const data = await apiClient.getCompletedEvents();
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

  useEffect(() => {
    fetchCompletedEvents();
  }, []);

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Выполненные события
            </CardTitle>
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
      </main>
    </div>
  );
};

export default CompletedEvents;