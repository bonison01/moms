
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, X, User } from 'lucide-react';

const AccountInfo = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No user found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const profileData = {
        full_name: formData.full_name.trim() || null,
        phone: formData.phone.trim() || null,
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (existingProfile) {
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
      } else {
        result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            role: 'user',
            ...profileData
          });
      }

      if (result.error) {
        throw result.error;
      }

      await refreshProfile();
      setIsEditing(false);
      
      toast({
        title: "Account Updated",
        description: "Your account information has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update account",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Email</Label>
          <p className="text-gray-900 bg-gray-50 p-2 rounded">{user?.email}</p>
        </div>
        
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          {isEditing ? (
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile?.full_name || 'Not provided'}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          {isEditing ? (
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile?.phone || 'Not provided'}</p>
          )}
        </div>
        
        <div>
          <Label>Member Since</Label>
          <p className="text-gray-900 bg-gray-50 p-2 rounded">
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
          </p>
        </div>

        {isEditing && (
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountInfo;
