
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coupon, ContentLockerLink } from '@/types';
import { X, Upload, Image as ImageIcon, Link, Plus, Star } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface AdminCouponFormProps {
  editCoupon?: Coupon;
  onSubmit: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const AdminCouponForm = ({ editCoupon, onSubmit, onCancel }: AdminCouponFormProps) => {
  const { toast } = useToast();
  const { links, addLink } = useCoupons();
  
  const [formData, setFormData] = useState<Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>>({
    store: '',
    code: '',
    description: '',
    discount: '',
    expiryDate: '',
    category: 'COUPON CODE',
    featured: false,
    lastVerified: new Date().toISOString().split('T')[0],
    status: 'active',
    image: '',
    contentLockerLinkId: undefined,
    rating: 4.5,
    usedCount: 0
  });
  
  const [showNewLinkDialog, setShowNewLinkDialog] = useState(false);
  const [newLink, setNewLink] = useState<Omit<ContentLockerLink, 'id' | 'createdAt'>>({
    name: '',
    url: '',
    active: true
  });
  
  useEffect(() => {
    if (editCoupon) {
      const { id, createdAt, updatedAt, ...rest } = editCoupon;
      setFormData(rest);
    }
  }, [editCoupon]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleRatingChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, rating: value[0] }));
  };
  
  const handleUsedCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setFormData(prev => ({ ...prev, usedCount: value }));
    }
  };
  
  const handleNewLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLink(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateLink = async () => {
    if (!newLink.name || !newLink.url) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and URL fields.",
        variant: "destructive",
      });
      return;
    }
    
    const createdLink = await addLink(newLink);
    if (createdLink) {
      setFormData(prev => ({ ...prev, contentLockerLinkId: createdLink.id }));
      setShowNewLinkDialog(false);
      setNewLink({ name: '', url: '', active: true });
      
      toast({
        title: "Success",
        description: "Content locker link created and selected.",
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.store || !formData.code || !formData.description || !formData.discount || !formData.expiryDate || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(formData);
  };
  
  const activeLinks = links.filter(link => link.active);
  
  return (
    <div className="bg-background/80 backdrop-blur-md p-6 rounded-lg border border-border shadow-float relative animate-fade-in">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2" 
        onClick={onCancel}
      >
        <X size={18} />
      </Button>
      
      <h2 className="text-xl font-display font-semibold mb-4">
        {editCoupon ? 'Edit Coupon' : 'Add New Coupon'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store">Store</Label>
            <Input
              id="store"
              name="store"
              value={formData.store}
              onChange={handleChange}
              placeholder="e.g. Amazon"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. SAVE20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="e.g. 20% OFF"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GAME CODE">GAME CODE</SelectItem>
                <SelectItem value="DISCOUNT CODE">DISCOUNT CODE</SelectItem>
                <SelectItem value="COUPON CODE">COUPON CODE</SelectItem>
                <SelectItem value="FREE CODE">FREE CODE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate.split('T')[0]}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value as 'active' | 'expired' | 'upcoming')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentLockerLink">Content Locker Link</Label>
            <div className="flex gap-2">
              <Select
                value={formData.contentLockerLinkId || "none"}
                onValueChange={(value) => handleSelectChange('contentLockerLinkId', value === "none" ? "" : value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select content locker link" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {activeLinks.map(link => (
                    <SelectItem key={link.id} value={link.id}>
                      {link.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => setShowNewLinkDialog(true)}
                className="shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="usedCount">Users Used Count</Label>
            <Input
              id="usedCount"
              name="usedCount"
              type="number"
              min="0"
              value={formData.usedCount || 0}
              onChange={handleUsedCountChange}
              placeholder="e.g. 250"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rating">Rating ({formData.rating?.toFixed(1)} stars)</Label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.floor(formData.rating || 0) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : star <= (formData.rating || 0) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <Slider
            defaultValue={[formData.rating || 4.5]}
            max={5}
            step={0.5}
            value={[formData.rating || 4.5]}
            onValueChange={handleRatingChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Coupon Image</Label>
          <div className="flex flex-col space-y-2">
            {formData.image ? (
              <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={formData.image} 
                  alt="Coupon preview" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center bg-gray-50">
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload size={16} className="mr-1" />
                    Upload Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the coupon deal..."
            rows={3}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Featured Coupon
          </Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editCoupon ? 'Update Coupon' : 'Add Coupon'}
          </Button>
        </div>
      </form>

      <Dialog open={showNewLinkDialog} onOpenChange={setShowNewLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Content Locker Link</DialogTitle>
            <DialogDescription>
              Create a new link that users must complete before accessing the coupon code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="linkName">Link Name</Label>
              <Input
                id="linkName"
                name="name"
                value={newLink.name}
                onChange={handleNewLinkChange}
                placeholder="e.g. Amazon Shop"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                name="url"
                value={newLink.url}
                onChange={handleNewLinkChange}
                placeholder="e.g. https://example.com"
              />
              <p className="text-xs text-muted-foreground">
                Users will need to visit this URL before seeing the coupon code.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLink}>
              Create Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
