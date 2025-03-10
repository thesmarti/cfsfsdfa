
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User } from '@/types';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedEmail = localStorage.getItem('adminEmail') || 'admin@example.com';
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    if (email === storedEmail && password === storedPassword) {
      const user: User = {
        id: 'admin-user', // Adding the required id property
        email: storedEmail,
        role: 'admin'
      };
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
      
      toast({
        title: "Success",
        description: "Logged in successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription className="space-y-2">
            <p>Default credentials:</p>
            <div className="text-sm bg-muted p-3 rounded-md space-y-1">
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
            <p className="text-sm mt-2">
              ℹ️ After logging in, you can change your credentials in the Admin Panel under the "Admin" tab.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
