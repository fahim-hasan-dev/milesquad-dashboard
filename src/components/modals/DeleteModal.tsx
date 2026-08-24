"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export type DeleteModalProps = {
  // Controlled props
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  loading?: boolean;

  // Uncontrolled trigger props
  itemId?: string;
  triggerBtn?: React.ReactNode;
  title?: string;
  description?: string;
  actionBtnText?: string;
  action?: (id: string) => Promise<void> | void;
};

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  itemId = "",
  triggerBtn,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This item will be permanently removed.",
  actionBtnText = "Delete",
  action,
}: DeleteModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = typeof isOpen === "boolean";
  const open = isControlled ? isOpen : internalOpen;

  const handleClose = () => {
    if (onClose) onClose();
    else setInternalOpen(false);
  };

  const handleAction = async () => {
    if (onConfirm) {
      onConfirm();
    } else if (action) {
      await action(itemId);
      setInternalOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && handleClose()}>
      {triggerBtn && (
        <span onClick={() => setInternalOpen(true)} className="inline-block cursor-pointer">
          {triggerBtn}
        </span>
      )}
      <AlertDialogContent className="max-w-md bg-white rounded-3xl p-6 border-none shadow-2xl space-y-4">
        <AlertDialogHeader className="text-left space-y-2">
          <AlertDialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500 font-normal">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-3 pt-2">
          <AlertDialogCancel
            onClick={handleClose}
            disabled={loading}
            className="flex-1 h-10 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleAction();
            }}
            disabled={loading}
            className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{actionBtnText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
