import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, Shield, Moon, Sun, Globe, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const SettingsPage: React.FC = () => {
  const { logout } = useAuth();

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // Notification States
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('emailNotifications');
    return saved !== 'false';
  });
  const [smsNotifications, setSmsNotifications] = useState(() => {
    const saved = localStorage.getItem('smsNotifications');
    return saved === 'true';
  });
  const [reservationReminders, setReservationReminders] = useState(() => {
    const saved = localStorage.getItem('reservationReminders');
    return saved !== 'false';
  });
  const [promotionalEmails, setPromotionalEmails] = useState(() => {
    const saved = localStorage.getItem('promotionalEmails');
    return saved !== 'false';
  });

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Language & Region States
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem('timezone') || 'America/Lima';
  });
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'PEN';
  });

  // Apply theme on mount and when changed
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('emailNotifications', emailNotifications.toString());
    localStorage.setItem('smsNotifications', smsNotifications.toString());
    localStorage.setItem('reservationReminders', reservationReminders.toString());
    localStorage.setItem('promotionalEmails', promotionalEmails.toString());
    toast.success('Notification preferences saved');
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setChangingPassword(true);
      // TODO: Implement password change API call when backend endpoint is ready
      // await UserService.changePassword({ currentPassword, newPassword });

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Password changed successfully. Please login again.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Logout after password change
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveLanguagePreferences = () => {
    localStorage.setItem('language', language);
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('currency', currency);
    toast.success('Language preferences saved');
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement account deletion API call when backend endpoint is ready
      // await UserService.deleteAccount();
      toast.success('Account deletion requested. Logging out...');
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the application looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={handleToggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reservation Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming reservations
                </p>
              </div>
              <Switch
                checked={reservationReminders}
                onCheckedChange={setReservationReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Promotional Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about special offers and updates
                </p>
              </div>
              <Switch
                checked={promotionalEmails}
                onCheckedChange={setPromotionalEmails}
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications}>
            Save Notification Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <Button onClick={handlePasswordChange} disabled={changingPassword}>
            {changingPassword ? 'Changing Password...' : 'Change Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>
            Control your privacy and data preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Account Visibility</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your profile is visible to technicians when you make a reservation
              </p>
              <p className="text-xs text-muted-foreground">
                This setting cannot be changed as it's required for service delivery
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Data Export</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Download a copy of your data including reservations and reviews
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Data export feature coming soon')}
              >
                Request Data Export
              </Button>
            </div>

            <div className="p-4 border rounded-lg border-destructive/50">
              <h4 className="font-medium mb-2 text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Personal information</li>
                        <li>Reservation history</li>
                        <li>Payment records</li>
                        <li>Reviews and ratings</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Set your preferred language and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="America/Lima">America/Lima (GMT-5)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
              <option value="America/Chicago">America/Chicago (GMT-6)</option>
              <option value="America/Denver">America/Denver (GMT-7)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="PEN">PEN (S/)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <Button onClick={handleSaveLanguagePreferences}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
