import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth/AuthProvider';
import { LogOut, User, Sparkles, Home, CheckCircle2, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Life Simplifier
            </h1>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/">
                <Button 
                  variant={location.pathname === '/' ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Главная
                </Button>
              </Link>
              <Link to="/events/completed">
                <Button 
                  variant={location.pathname === '/events/completed' ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  События
                </Button>
              </Link>
              <Link to="/goals/completed">
                <Button 
                  variant={location.pathname === '/goals/completed' ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <Target className="h-4 w-4" />
                  Цели
                </Button>
              </Link>
            </nav>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Привет, {user.user.name}!
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full">
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </Link>
                </DropdownMenuItem>
                <div className="md:hidden">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer flex w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Главная
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/events/completed" className="cursor-pointer flex w-full">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Выполненные события
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/goals/completed" className="cursor-pointer flex w-full">
                      <Target className="mr-2 h-4 w-4" />
                      Выполненные цели
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};