'use client';

import type { CreateReferencePayload } from '@/services/admin/references/create';
import { CircleNotch } from '@phosphor-icons/react';
import { Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui';

type CreateReferenceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateReferencePayload;
  onFormDataChange: (data: CreateReferencePayload) => void;
  categoryOptions: Array<{ label: string; value: string }>;
  isCategoriesLoading: boolean;
  isCreating: boolean;
  onCreate: () => void;
  onReset: () => void;
};

export default function CreateReferenceDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  categoryOptions,
  isCategoriesLoading,
  isCreating,
  onCreate,
  onReset,
}: CreateReferenceDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
    onReset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Reference</DialogTitle>
          <DialogDescription>
            Add a new reference with category, name, description, and URL
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={value => onFormDataChange({ ...formData, categoryId: value })}
              disabled={isCategoriesLoading}
            >
              <SelectTrigger id="categoryId">
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
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Reference name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => onFormDataChange({ ...formData, description: e.target.value })}
              placeholder="Reference description"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url || ''}
              onChange={e => onFormDataChange({ ...formData, url: e.target.value || null })}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access">Access</Label>
            <Input
              id="access"
              value={formData.access}
              onChange={e => onFormDataChange({ ...formData, access: e.target.value })}
              placeholder="Access level or type"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={checked => onFormDataChange({ ...formData, isPublic: checked === true })}
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
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
            onClick={onCreate}
            disabled={isCreating || !formData.name.trim() || !formData.categoryId}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isCreating
              ? (
                  <>
                    <CircleNotch size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                )
              : (
                  'Create'
                )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
