import React from 'react';
import { Goal } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Trash2, Edit, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
  onToggleStatus: (id: number) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onToggleStatus, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
      goal.completed && "opacity-70"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className={cn(
                "text-lg transition-colors",
                goal.completed && "line-through text-muted-foreground"
              )}>
                {goal.name}
              </CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStatus(goal.id)}
            className="shrink-0 ml-2"
          >
            {goal.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal)}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(goal.id)}
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};