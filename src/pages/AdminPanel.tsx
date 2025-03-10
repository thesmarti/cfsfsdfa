import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from '@/components/CustomNavbar';
import { LoginForm } from '@/components/LoginForm';
import { AdminCouponForm } from '@/components/AdminCouponForm';
import { ContentLockerLinksPanel } from '@/components/ContentLockerLinksPanel';
import { SiteSettingsPanel } from '@/components/SiteSettingsPanel';
import { ThemeSettingsTab } from '@/components/ThemeSettingsTab';
import { TextContentTab } from '@/components/TextContentTab';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Coupon } from '@/types';
import { useCoupons } from '@/hooks/useCoupons';
import { 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  MoreHorizontal, 
  Star, 
  Link,
  ChevronDown,
  Settings,
  Palette,
  Type
} from 'lucide-react';

const AdminPanel = () => {
  const { toast } = useToast();
  const { 
    coupons, 
    links,
    loading, 
    addCoupon, 
    updateCoupon, 
    deleteCoupon,
    bulkUpdateCoupons,
    bulkDeleteCoupons,
    refreshCoupons,
    addLink,
    updateLink,
    deleteLink
  } = useCoupons();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [adminSection, setAdminSection] = useState<'coupons' | 'links' | 'settings' | 'theme' | 'text'>('coupons');
  
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [bulkActionType, setBulkActionType] = useState<'status' | 'category' | 'featured' | 'delete' | null>(null);
  const [bulkActionValue, setBulkActionValue] = useState<string>('');
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoupons(coupons);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredCoupons(
        coupons.filter(
          coupon =>
            coupon.store.toLowerCase().includes(lowercaseSearch) ||
            coupon.description.toLowerCase().includes(lowercaseSearch) ||
            coupon.code.toLowerCase().includes(lowercaseSearch)
        )
      );
    }
  }, [searchTerm, coupons]);
  
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredCoupons(coupons);
    } else if (activeTab === "active") {
      setFilteredCoupons(coupons.filter(coupon => coupon.status === "active"));
    } else if (activeTab === "expired") {
      setFilteredCoupons(coupons.filter(coupon => coupon.status === "expired"));
    } else if (activeTab === "featured") {
      setFilteredCoupons(coupons.filter(coupon => coupon.featured));
    }
  }, [activeTab, coupons]);
  
  useEffect(() => {
    setSelectedCoupons([]);
  }, [filteredCoupons]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };
  
  const handleAddCoupon = async (couponData: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await addCoupon(couponData);
    if (result) {
      setIsAddingCoupon(false);
    }
  };
  
  const handleUpdateCoupon = async (couponData: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCoupon) {
      const result = await updateCoupon(editingCoupon.id, couponData);
      if (result) {
        setEditingCoupon(null);
      }
    }
  };
  
  const confirmDelete = async () => {
    if (deletingCouponId) {
      const result = await deleteCoupon(deletingCouponId);
      if (result) {
        setDeletingCouponId(null);
      }
    }
  };
  
  const handleSelectAllCoupons = (checked: boolean) => {
    if (checked) {
      setSelectedCoupons(filteredCoupons.map(coupon => coupon.id));
    } else {
      setSelectedCoupons([]);
    }
  };
  
  const handleSelectCoupon = (couponId: string, checked: boolean) => {
    if (checked) {
      setSelectedCoupons(prev => [...prev, couponId]);
    } else {
      setSelectedCoupons(prev => prev.filter(id => id !== couponId));
    }
  };
  
  const handleBulkAction = async () => {
    if (!bulkActionType || selectedCoupons.length === 0) return;
    
    try {
      if (bulkActionType === 'delete') {
        await bulkDeleteCoupons(selectedCoupons);
      } else {
        let updates: Partial<Coupon> = {};
        
        if (bulkActionType === 'status') {
          updates.status = bulkActionValue as 'active' | 'expired' | 'upcoming';
        } else if (bulkActionType === 'category') {
          updates.category = bulkActionValue as 'GAME CODE' | 'DISCOUNT CODE' | 'COUPON CODE' | 'FREE CODE';
        } else if (bulkActionType === 'featured') {
          updates.featured = bulkActionValue === 'true';
        }
        
        await bulkUpdateCoupons(selectedCoupons, updates);
      }
      
      setSelectedCoupons([]);
      setIsBulkActionDialogOpen(false);
      setBulkActionType(null);
      setBulkActionValue('');
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };
  
  const openBulkActionDialog = (actionType: 'status' | 'category' | 'featured' | 'delete') => {
    if (selectedCoupons.length === 0) {
      toast({
        title: "No Coupons Selected",
        description: "Please select at least one coupon to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }
    
    setBulkActionType(actionType);
    setIsBulkActionDialogOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (!user) {
    return <LoginForm onLoginSuccess={setUser} />;
  }
  
  const allSelected = filteredCoupons.length > 0 && selectedCoupons.length === filteredCoupons.length;
  const someSelected = selectedCoupons.length > 0 && selectedCoupons.length < filteredCoupons.length;
  
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your coupons and site settings
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{coupons.length}</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {coupons.filter(c => c.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Featured Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {coupons.filter(c => c.featured).length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <div className="flex space-x-2 flex-wrap gap-2">
              <Button 
                variant={adminSection === 'coupons' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAdminSection('coupons')}
                className="gap-1"
              >
                <Star size={16} />
                Coupons
              </Button>
              <Button 
                variant={adminSection === 'links' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAdminSection('links')}
                className="gap-1"
              >
                <Link size={16} />
                Content Locker Links
              </Button>
              <Button 
                variant={adminSection === 'settings' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAdminSection('settings')}
                className="gap-1"
              >
                <Settings size={16} />
                Site Settings
              </Button>
              <Button 
                variant={adminSection === 'theme' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAdminSection('theme')}
                className="gap-1"
              >
                <Palette size={16} />
                Theme
              </Button>
              <Button 
                variant={adminSection === 'text' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAdminSection('text')}
                className="gap-1"
              >
                <Type size={16} />
                Text Content
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {adminSection === 'coupons' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      onClick={() => setIsAddingCoupon(true)}
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Add New Coupon
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => refreshCoupons()}
                      disabled={loading}
                    >
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search coupons..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All Coupons</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab} className="mt-0">
                    <Card>
                      {selectedCoupons.length > 0 && (
                        <div className="p-4 bg-muted border-b flex items-center justify-between">
                          <div>
                            <span className="font-medium">{selectedCoupons.length}</span> coupons selected
                          </div>
                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Bulk Actions <ChevronDown size={14} className="ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openBulkActionDialog('status')}>
                                  Change Status
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openBulkActionDialog('category')}>
                                  Change Category
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openBulkActionDialog('featured')}>
                                  Set Featured
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => openBulkActionDialog('delete')}
                                  className="text-destructive focus:text-destructive"
                                >
                                  Delete Selected
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCoupons([])}
                            >
                              Clear Selection
                            </Button>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-0">
                        <div className="relative overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px]">
                                  <Checkbox 
                                    checked={allSelected} 
                                    indeterminate={someSelected}
                                    onCheckedChange={handleSelectAllCoupons}
                                    aria-label="Select all"
                                  />
                                </TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {loading ? (
                                <TableRow>
                                  <TableCell colSpan={8} className="text-center py-8">
                                    Loading coupons...
                                  </TableCell>
                                </TableRow>
                              ) : filteredCoupons.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={8} className="text-center py-8">
                                    No coupons found
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredCoupons.map((coupon) => (
                                  <TableRow key={coupon.id}>
                                    <TableCell>
                                      <Checkbox 
                                        checked={selectedCoupons.includes(coupon.id)}
                                        onCheckedChange={(checked) => handleSelectCoupon(coupon.id, !!checked)}
                                        aria-label={`Select ${coupon.store} coupon`}
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        {coupon.store}
                                        {coupon.featured && (
                                          <Star size={14} className="text-amber-500 fill-amber-500" />
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <code className="bg-secondary px-2 py-1 rounded text-sm">
                                        {coupon.code}
                                      </code>
                                    </TableCell>
                                    <TableCell>{coupon.discount}</TableCell>
                                    <TableCell>{coupon.category}</TableCell>
                                    <TableCell>{formatDate(coupon.expiryDate)}</TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          coupon.status === 'active'
                                            ? 'default'
                                            : coupon.status === 'expired'
                                            ? 'destructive'
                                            : 'outline'
                                        }
                                      >
                                        {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <MoreHorizontal size={16} />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-[180px]" align="end">
                                            <div className="grid gap-2">
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start font-normal"
                                                onClick={() => setEditingCoupon(coupon)}
                                              >
                                                <Edit size={14} className="mr-2" /> Edit
                                              </Button>
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => setDeletingCouponId(coupon.id)}
                                              >
                                                <Trash2 size={14} className="mr-2" /> Delete
                                              </Button>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {adminSection === 'links' && (
              <ContentLockerLinksPanel
                links={links}
                onAddLink={addLink}
                onUpdateLink={updateLink}
                onDeleteLink={deleteLink}
              />
            )}
            
            {adminSection === 'settings' && (
              <SiteSettingsPanel />
            )}
            
            {adminSection === 'theme' && (
              <ThemeSettingsTab />
            )}
            
            {adminSection === 'text' && (
              <TextContentTab />
            )}
          </div>
        </div>
      </main>
      
      {(isAddingCoupon || editingCoupon) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AdminCouponForm
            editCoupon={editingCoupon ?? undefined}
            onSubmit={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
            onCancel={() => {
              setIsAddingCoupon(false);
              setEditingCoupon(null);
            }}
          />
        </div>
      )}
      
      <Dialog open={deletingCouponId !== null} onOpenChange={() => setDeletingCouponId(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle size={20} />
              <DialogTitle>Confirm Deletion</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCouponId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkActionType === 'delete' 
                ? 'Confirm Bulk Delete' 
                : `Bulk Update Coupons`}
            </DialogTitle>
            <DialogDescription>
              {bulkActionType === 'delete'
                ? `Are you sure you want to delete ${selectedCoupons.length} coupons? This action cannot be undone.`
                : `Update ${selectedCoupons.length} coupons at once.`}
            </DialogDescription>
          </DialogHeader>
          
          {bulkActionType && bulkActionType !== 'delete' && (
            <div className="py-4">
              {bulkActionType === 'status' && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
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
              )}
              
              {bulkActionType === 'category' && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAME CODE">GAME CODE</SelectItem>
                      <SelectItem value="DISCOUNT CODE">DISCOUNT CODE</SelectItem>
                      <SelectItem value="COUPON CODE">COUPON CODE</SelectItem>
                      <SelectItem value="FREE CODE">FREE CODE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {bulkActionType === 'featured' && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Featured</label>
                  <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Set featured status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsBulkActionDialogOpen(false);
                setBulkActionType(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant={bulkActionType === 'delete' ? 'destructive' : 'default'}
              onClick={handleBulkAction}
            >
              {bulkActionType === 'delete' ? 'Delete Coupons' : 'Update Coupons'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
