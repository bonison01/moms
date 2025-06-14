
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, X, MapPin } from 'lucide-react';

const SavedAddress = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
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
        address_line_1: formData.address_line_1.trim() || null,
        address_line_2: formData.address_line_2.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        postal_code: formData.postal_code.trim() || null,
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
        title: "Address Updated",
        description: "Your address has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update address",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      address_line_1: profile?.address_line_1 || '',
      address_line_2: profile?.address_line_2 || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postal_code: profile?.postal_code || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Saved Address</span>
            </CardTitle>
            <CardDescription>Your default delivery address for checkout</CardDescription>
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
          <Label htmlFor="address_line_1">Address Line 1</Label>
          {isEditing ? (
            <Input
              id="address_line_1"
              value={formData.address_line_1}
              onChange={(e) => handleInputChange('address_line_1', e.target.value)}
              placeholder="Street address, building name"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile?.address_line_1 || 'Not provided'}</p>
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
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile?.address_line_2 || 'Not provided'}</p>
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
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile?.city || 'Not provided'}</p>
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
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile?.state || 'Not provided'}</p>
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
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile?.postal_code || 'Not provided'}</p>
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
  );
};

export default SavedAddress;
