import React, { useState, useEffect } from 'react';
import { Event, Goal, EventType } from '@/types/api';
import { Header } from '@/components/layout/Header';
import { EventCard } from '@/components/events/EventCard';
import { GoalCard } from '@/components/goals/GoalCard';
import { EventForm } from '@/components/events/EventForm';
import { GoalForm } from '@/components/goals/GoalForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar as CalendarIcon, Target } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      let data;
      const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
      
      if (selectedEventType === 'all') {
        data = await apiClient.getEvents(dateParam);
      } else {
        data = await apiClient.getEventsByType(selectedEventType, dateParam);
      }
      setEvents(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить события',
        variant: 'destructive',
      });
    }
  };

  const fetchEventTypes = async () => {
    try {
      const data = await apiClient.getEventTypes();
      setEventTypes(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить типы событий',
        variant: 'destructive',
      });
    }
  };

  const fetchGoals = async () => {
    try {
      const data = await apiClient.getGoals();
      setGoals(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить цели',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchGoals();
    fetchEventTypes();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedEventType, selectedDate]);

  const handleEventToggleStatus = async (id: number) => {
    try {
      await apiClient.toggleEventStatus(id);
      await fetchEvents();
      toast({
        title: 'Успешно',
        description: 'Статус события изменен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус события',
        variant: 'destructive',
      });
    }
  };

  const handleGoalToggleStatus = async (id: number) => {
    try {
      await apiClient.toggleGoalStatus(id);
      await fetchGoals();
      toast({
        title: 'Успешно',
        description: 'Статус цели изменен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус цели',
        variant: 'destructive',
      });
    }
  };

  const handleEventDelete = async (id: number) => {
    try {
      await apiClient.deleteEvent(id);
      await fetchEvents();
      toast({
        title: 'Успешно',
        description: 'Событие удалено',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить событие',
        variant: 'destructive',
      });
    }
  };

  const handleGoalDelete = async (id: number) => {
    try {
      await apiClient.deleteGoal(id);
      await fetchGoals();
      toast({
        title: 'Успешно',
        description: 'Цель удалена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить цель',
        variant: 'destructive',
      });
    }
  };

  const openEventForm = (event?: Event) => {
    setSelectedEvent(event);
    setEventFormOpen(true);
  };

  const openGoalForm = (goal?: Goal) => {
    setSelectedGoal(goal);
    setGoalFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Управление жизнью</h2>
          <p className="text-muted-foreground">
            Организуйте события и достигайте целей
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
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
          
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  События
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Цели
                </TabsTrigger>
              </TabsList>

          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Мои события</h3>
              <div className="flex items-center gap-3">
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
                <Button onClick={() => openEventForm()} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить событие
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onToggleStatus={handleEventToggleStatus}
                  onEdit={openEventForm}
                  onDelete={handleEventDelete}
                />
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Пока нет событий</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Мои цели</h3>
              <Button onClick={() => openGoalForm()} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Добавить цель
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onToggleStatus={handleGoalToggleStatus}
                  onEdit={openGoalForm}
                  onDelete={handleGoalDelete}
                />
              ))}
            </div>

            {goals.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Пока нет целей</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
          </div>
        </div>
      </main>

      <EventForm
        event={selectedEvent}
        open={eventFormOpen}
        onOpenChange={setEventFormOpen}
        onSuccess={() => {
          fetchEvents();
          setSelectedEvent(undefined);
        }}
      />

      <GoalForm
        goal={selectedGoal}
        open={goalFormOpen}
        onOpenChange={setGoalFormOpen}
        onSuccess={() => {
          fetchGoals();
          setSelectedGoal(undefined);
        }}
      />
    </div>
  );
};