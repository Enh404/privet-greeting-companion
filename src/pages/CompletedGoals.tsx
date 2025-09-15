import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { GoalCard } from '@/components/goals/GoalCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Goal } from '@/types/api';

export const CompletedGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompletedGoals = async () => {
    try {
      const data = await apiClient.getCompletedGoals();
      setGoals(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить выполненные цели",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedGoals();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      await apiClient.toggleGoalStatus(id);
      toast({
        title: "Статус изменен",
        description: "Цель перемещена в активные",
      });
      fetchCompletedGoals();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус цели",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteGoal(id);
      toast({
        title: "Цель удалена",
        description: "Цель успешно удалена",
      });
      fetchCompletedGoals();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить цель",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (goal: Goal) => {
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
              Выполненные цели
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Нет выполненных целей
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
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

export default CompletedGoals;