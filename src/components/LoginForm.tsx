
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Get stored admin credentials on component mount
  useState(() => {
    const storedAdminEmail = localStorage.getItem('adminEmail');
    const storedAdminPassword = localStorage.getItem('adminPassword');
    
    if (storedAdminEmail) setAdminEmail(storedAdminEmail);
    else {
      // Set default admin credentials if none exist
      setAdminEmail('admin@example.com');
      localStorage.setItem('adminEmail', 'admin@example.com');
    }
    
    if (storedAdminPassword) setAdminPassword(storedAdminPassword);
    else {
      // Set default admin password if none exists
      setAdminPassword('admin123');
      localStorage.setItem('adminPassword', 'admin123');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get the current admin credentials from localStorage
      const currentAdminEmail = localStorage.getItem('adminEmail') || 'admin@example.com';
      const currentAdminPassword = localStorage.getItem('adminPassword') || 'admin123';

      // Check against the stored admin credentials
      if (email === currentAdminEmail && password === currentAdminPassword) {
        // Simulate successful login
        const user: User = {
          id: '1',
          email: email,
          role: 'admin'
        };
        
        // Store in local storage for persistence
        localStorage.setItem('user', JSON.stringify(user));
        
        toast({
          title: "Success",
          description: "Welcome back, admin!",
        });
        
        onLoginSuccess(user);
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    // Validate passwords match
    if (adminPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    // Save the new admin credentials
    localStorage.setItem('adminEmail', adminEmail);
    localStorage.setItem('adminPassword', adminPassword);

    toast({
      title: "Success",
      description: "Admin credentials updated.",
    });

    setIsSettingsOpen(false);
  };

  const openSettings = () => {
    // Get current admin credentials before opening settings
    const currentAdminEmail = localStorage.getItem('adminEmail') || 'admin@example.com';
    const currentAdminPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    setAdminEmail(currentAdminEmail);
    setAdminPassword(currentAdminPassword);
    setConfirmPassword(currentAdminPassword);
    setIsSettingsOpen(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md glass-card animate-scale-in">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openSettings}
              title="Change Admin Credentials"
            >
              <Settings size={18} />
            </Button>
          </div>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Default credentials:</p>
              <p>Email: {localStorage.getItem('adminEmail') || 'admin@example.com'}</p>
              <p>Password: {localStorage.getItem('adminPassword') ? '••••••••' : 'admin123'}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full button-press" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Admin Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Credentials</DialogTitle>
            <DialogDescription>
              Update your admin email and password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">New Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="New password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
