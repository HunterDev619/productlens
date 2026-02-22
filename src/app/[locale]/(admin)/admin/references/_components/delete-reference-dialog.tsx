'use client';

import { CircleNotch } from '@phosphor-icons/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/components/alert-dialog';

type DeleteReferenceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referenceName: string | undefined;
  isDeleting: boolean;
  onDelete: () => void;
};

export default function DeleteReferenceDialog({
  open,
  onOpenChange,
  referenceName,
  isDeleting,
  onDelete,
}: DeleteReferenceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the reference
            {' '}
            <span className="font-semibold">{referenceName}</span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting
              ? (
                  <>
                    <CircleNotch size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                )
              : (
                  'Delete'
                )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
