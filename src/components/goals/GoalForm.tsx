import React, { useState, useEffect } from 'react';
import { Goal, CreateGoalRequest, UpdateGoalRequest } from '@/types/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface GoalFormProps {
  goal?: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ 
  goal, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (goal) {
      setName(goal.name);
    } else {
      setName('');
    }
  }, [goal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (goal) {
        const updateData: UpdateGoalRequest = { name };
        await apiClient.updateGoal(goal.id, updateData);
        toast({
          title: 'Успешно',
          description: 'Цель обновлена',
        });
      } else {
        const createData: CreateGoalRequest = { name };
        await apiClient.createGoal(createData);
        toast({
          title: 'Успешно',
          description: 'Цель создана',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: goal ? 'Не удалось обновить цель' : 'Не удалось создать цель',
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
            {goal ? 'Редактировать цель' : 'Создать цель'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название цели</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название цели"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : (goal ? 'Сохранить' : 'Создать')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};