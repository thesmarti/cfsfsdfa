
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { AdminCouponForm } from '@/components/AdminCouponForm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Coupon } from '@/types';
import { useCoupons } from '@/hooks/useCoupons';
import { LogOut, Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';

const AdminPanel = () => {
  const { toast } = useToast();
  const { 
    coupons, 
    loading, 
    addCoupon, 
    updateCoupon, 
    deleteCoupon, 
    refreshCoupons 
  } = useCoupons();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Check if user is already logged in
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
  
  // Apply search filter on coupons
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
  
  // Filter coupons based on active tab
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // If not logged in, show login form
  if (!user) {
    return <LoginForm onLoginSuccess={setUser} />;
  }
  
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
                Manage your coupons and offers
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
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
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
                            <TableCell colSpan={7} className="text-center py-8">
                              Loading coupons...
                            </TableCell>
                          </TableRow>
                        ) : filteredCoupons.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              No coupons found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCoupons.map((coupon) => (
                            <TableRow key={coupon.id}>
                              <TableCell className="font-medium">
                                {coupon.store}
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
                                {coupon.featured && (
                                  <Badge variant="outline" className="ml-2 bg-primary/10">
                                    Featured
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setEditingCoupon(coupon)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => setDeletingCouponId(coupon.id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
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
      </main>
      
      {/* Add/Edit Coupon Dialog */}
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
      
      {/* Delete Confirmation Dialog */}
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
    </div>
  );
};

export default AdminPanel;
