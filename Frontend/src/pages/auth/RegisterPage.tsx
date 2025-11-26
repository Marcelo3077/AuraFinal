import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();

  const [activeTab, setActiveTab] = useState<'user' | 'technician'>('user');
  const [isLoading, setIsLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [technicianForm, setTechnicianForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    description: '',
    specialties: '',
  });

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await register({
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone,
      }, Role.USER);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTechnicianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await register({
        firstName: technicianForm.firstName,
        lastName: technicianForm.lastName,
        email: technicianForm.email,
        password: technicianForm.password,
        phone: technicianForm.phone,
        description: technicianForm.description,
        specialties: technicianForm.specialties.split(',').map(s => s.trim())
      }, Role.TECHNICIAN);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
              A
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Choose how you want to join Aura
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'user' | 'technician')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user">As Client</TabsTrigger>
              <TabsTrigger value="technician">As Technician</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-firstName">First Name</Label>
                    <Input
                      id="user-firstName"
                      value={userForm.firstName}
                      onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-lastName">Last Name</Label>
                    <Input
                      id="user-lastName"
                      value={userForm.lastName}
                      onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-phone">Phone</Label>
                  <Input
                    id="user-phone"
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="technician">
              <form onSubmit={handleTechnicianSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tech-firstName">First Name</Label>
                    <Input
                      id="tech-firstName"
                      value={technicianForm.firstName}
                      onChange={(e) => setTechnicianForm(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-lastName">Last Name</Label>
                    <Input
                      id="tech-lastName"
                      value={technicianForm.lastName}
                      onChange={(e) => setTechnicianForm(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tech-email">Email</Label>
                  <Input
                    id="tech-email"
                    type="email"
                    value={technicianForm.email}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tech-phone">Phone</Label>
                  <Input
                    id="tech-phone"
                    type="tel"
                    value={technicianForm.phone}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tech-password">Password</Label>
                  <Input
                    id="tech-password"
                    type="password"
                    value={technicianForm.password}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tech-description">Professional Description</Label>
                  <Input
                    id="tech-description"
                    value={technicianForm.description}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tech-specialties">Specialties (comma separated)</Label>
                  <Input
                    id="tech-specialties"
                    placeholder="e.g. Plumbing, Electrical, Carpentry"
                    value={technicianForm.specialties}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, specialties: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Technician Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
