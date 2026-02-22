'use client';

import type { CreateReferencePayload } from '@/services/admin/references/create';
import { CircleNotch } from '@phosphor-icons/react';
import { Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui';

type EditReferenceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateReferencePayload;
  onFormDataChange: (data: CreateReferencePayload) => void;
  categoryOptions: Array<{ label: string; value: string }>;
  isCategoriesLoading: boolean;
  isUpdating: boolean;
  onUpdate: () => void;
  onReset: () => void;
};

export default function EditReferenceDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  categoryOptions,
  isCategoriesLoading,
  isUpdating,
  onUpdate,
  onReset,
}: EditReferenceDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
    onReset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Reference</DialogTitle>
          <DialogDescription>
            Update reference information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-categoryId">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={value => onFormDataChange({ ...formData, categoryId: value })}
              disabled={isCategoriesLoading}
            >
              <SelectTrigger id="edit-categoryId">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={e => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Reference name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={e => onFormDataChange({ ...formData, description: e.target.value })}
              placeholder="Reference description"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              type="url"
              value={formData.url || ''}
              onChange={e => onFormDataChange({ ...formData, url: e.target.value || null })}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-access">Access</Label>
            <Input
              id="edit-access"
              value={formData.access}
              onChange={e => onFormDataChange({ ...formData, access: e.target.value })}
              placeholder="Access level or type"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-isPublic"
              checked={formData.isPublic}
              onCheckedChange={checked => onFormDataChange({ ...formData, isPublic: checked === true })}
            />
            <Label htmlFor="edit-isPublic" className="cursor-pointer">
              Public reference
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={onUpdate}
            disabled={isUpdating || !formData.name.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isUpdating
              ? (
                  <>
                    <CircleNotch size={16} className="mr-2 animate-spin" />
                    Updating...
                  </>
                )
              : (
                  'Update'
                )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
