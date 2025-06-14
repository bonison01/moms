
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, X, MapPin, User } from 'lucide-react';

interface ProfileEditFormProps {
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
}

const ProfileEditForm = ({ isEditing, onEditToggle, onSave }: ProfileEditFormProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address_line_1: profile?.address_line_1 || '',
    address_line_2: profile?.address_line_2 || '',
    city: profile?.city || '',
    state: profile?.state || '',
    postal_code: profile?.postal_code || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      console.log('Updating profile for user:', user.id);
      console.log('Profile data:', formData);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim() || null,
          phone: formData.phone.trim() || null,
          address_line_1: formData.address_line_1.trim() || null,
          address_line_2: formData.address_line_2.trim() || null,
          city: formData.city.trim() || null,
          state: formData.state.trim() || null,
          postal_code: formData.postal_code.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      await refreshProfile();
      onSave();
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully",
      });

      console.log('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile values
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address_line_1: profile?.address_line_1 || '',
      address_line_2: profile?.address_line_2 || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postal_code: profile?.postal_code || '',
    });
    onEditToggle();
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
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
              <Button variant="outline" size="sm" onClick={onEditToggle}>
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
              <p className="text-gray-900">{profile?.full_name || 'Not provided'}</p>
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
              <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <Label>Member Since</Label>
            <p className="text-gray-900">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Saved Address</span>
          </CardTitle>
          <CardDescription>Your default delivery address for checkout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address_line_1">Address Line 1</Label>
            {isEditing ? (
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                placeholder="Street address, building name"
              />
            ) : (
              <p className="text-gray-900">{profile?.address_line_1 || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="address_line_2">Address Line 2</Label>
            {isEditing ? (
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                placeholder="Apartment, suite, unit (optional)"
              />
            ) : (
              <p className="text-gray-900">{profile?.address_line_2 || 'Not provided'}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              ) : (
                <p className="text-gray-900">{profile?.city || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              {isEditing ? (
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              ) : (
                <p className="text-gray-900">{profile?.state || 'Not provided'}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            {isEditing ? (
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="Postal Code"
              />
            ) : (
              <p className="text-gray-900">{profile?.postal_code || 'Not provided'}</p>
            )}
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
    </div>
  );
};

export default ProfileEditForm;
