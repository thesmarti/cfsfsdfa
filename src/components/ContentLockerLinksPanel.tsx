
import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ContentLockerLink } from '@/types';
import { Plus, Edit, Trash2, Link, ExternalLink, AlertTriangle, Download, Upload } from 'lucide-react';

interface ContentLockerLinksPanelProps {
  links: ContentLockerLink[];
  onAddLink: (link: Omit<ContentLockerLink, 'id' | 'createdAt'>) => Promise<ContentLockerLink | null>;
  onUpdateLink: (id: string, updates: Partial<ContentLockerLink>) => Promise<ContentLockerLink | null>;
  onDeleteLink: (id: string) => Promise<boolean>;
  importLinks?: (links: Omit<ContentLockerLink, 'id' | 'createdAt'>[]) => Promise<ContentLockerLink[] | null>;
  exportLinks?: () => Omit<ContentLockerLink, 'id' | 'createdAt'>[];
}

export const ContentLockerLinksPanel = ({ 
  links, 
  onAddLink, 
  onUpdateLink, 
  onDeleteLink,
  importLinks,
  exportLinks
}: ContentLockerLinksPanelProps) => {
  const { toast } = useToast();
  
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<ContentLockerLink | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    active: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      active: true
    });
  };
  
  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddingLink(true);
  };
  
  const handleOpenEditDialog = (link: ContentLockerLink) => {
    setFormData({
      name: link.name,
      url: link.url,
      active: link.active
    });
    setEditingLink(link);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      active: checked
    }));
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingLink) {
        await onUpdateLink(editingLink.id, formData);
        setEditingLink(null);
      } else {
        await onAddLink(formData);
        setIsAddingLink(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };
  
  const handleCancelDialog = () => {
    setIsAddingLink(false);
    setEditingLink(null);
    resetForm();
  };
  
  const confirmDelete = async () => {
    if (deletingLinkId) {
      const success = await onDeleteLink(deletingLinkId);
      if (success) {
        setDeletingLinkId(null);
      }
    }
  };

  const handleExportLinks = () => {
    if (!exportLinks) return;
    
    const exportData = exportLinks();
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-locker-links-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${exportData.length} content locker links exported to JSON file.`,
    });
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!importLinks) return;
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        if (!Array.isArray(importData)) {
          throw new Error('Invalid format: Expected an array of links');
        }
        
        await importLinks(importData);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: "The selected file is not a valid links export. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Content Locker Links</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleOpenAddDialog} size="sm" className="gap-1">
            <Plus size={16} />
            Add Link
          </Button>
          {exportLinks && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleExportLinks}
            >
              <Download size={16} />
              Export
            </Button>
          )}
          {importLinks && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleImportClick}
            >
              <Upload size={16} />
              Import
            </Button>
          )}
          {importLinks && (
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No links added yet. Click "Add Link" to create one.
                </TableCell>
              </TableRow>
            ) : (
              links.map(link => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Link size={16} className="text-muted-foreground" />
                      {link.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-1">
                      <div className="max-w-[200px] truncate">
                        {link.url}
                      </div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      link.active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {link.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(link.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEditDialog(link)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingLinkId(link.id)}
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
      </CardContent>
      
      {/* Add/Edit Link Dialog */}
      <Dialog open={isAddingLink || editingLink !== null} onOpenChange={handleCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </DialogTitle>
            <DialogDescription>
              {editingLink 
                ? 'Update the content locker link details.' 
                : 'Add a new content locker link for your coupons.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Link Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Amazon Deals"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="e.g., https://amazon.com"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingLink ? 'Save Changes' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingLinkId !== null} onOpenChange={() => setDeletingLinkId(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle size={20} />
              <DialogTitle>Confirm Deletion</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete this content locker link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingLinkId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
