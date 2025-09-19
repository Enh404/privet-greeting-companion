import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { User } from '@/types/api';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    birthday: user?.birthday || '',
    telegram: user?.telegram || '',
    height: user?.height || '',
    weight: user?.weight || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        birthday: user.birthday || '',
        telegram: user.telegram || '',
        height: user.height || '',
        weight: user.weight || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [isLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        birthday: formData.birthday || undefined,
        telegram: formData.telegram || undefined,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
      };
      await apiClient.updateProfile(submitData);
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Профиль пользователя</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div>
                <Label>Имя</Label>
                <Input value={user?.user.name || ''} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.user.email || ''} disabled />
              </div>
            </div>
            
            {!isEditing && (
              <div className="mb-6">
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="birthday">День рождения</Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="height">Рост (см)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="180"
                />
              </div>
              <div>
                <Label htmlFor="weight">Вес (кг)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="70"
                />
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <>
                    <Button type="submit">Сохранить</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          birthday: user?.birthday || '',
                          telegram: user?.telegram || '',
                          height: user?.height || '',
                          weight: user?.weight || '',
                        });
                      }}
                    >
                      Отмена
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;