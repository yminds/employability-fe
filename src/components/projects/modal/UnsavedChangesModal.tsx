import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UnsavedChangesModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  onStay: () => void;
}

const UnsavedChangesModal = ({ 
  open, 
  onClose, 
  onProceed, 
  onStay 
}:UnsavedChangesModalProps)  => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have uploaded files that haven't been saved yet. Click "Next" to save your changes, or "Leave" to discard them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onProceed}>Leave</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onStay}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Stay and Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsavedChangesModal;