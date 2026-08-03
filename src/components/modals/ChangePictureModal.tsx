"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface ChangePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPicture?: string | null;
  onUpdatePicture?: (newPictureUrl: string | null) => void;
}

export default function ChangePictureModal({
  isOpen,
  onClose,
  currentPicture = null,
  onUpdatePicture,
}: ChangePictureModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentPicture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Profile picture removed");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onUpdatePicture) {
      onUpdatePicture(selectedImage);
    }
    toast.success("Profile picture updated successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-6 md:p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Change Profile Picture
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium">
                Upload a new avatar or profile image
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="size-24 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                />
              ) : (
                <div className="size-24 rounded-full bg-[#10B981] text-white font-extrabold text-3xl flex items-center justify-center border-4 border-emerald-100 shadow-md">
                  D
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 size-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-md hover:bg-[#059669] transition-all cursor-pointer"
                title="Upload Photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {selectedImage ? "Custom Image Uploaded" : "Default Avatar"}
            </span>
          </div>

          {/* Upload Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-[#10B981] bg-[#F8FAFC] hover:bg-emerald-50/30 rounded-2xl p-6 text-center transition-all cursor-pointer space-y-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="size-10 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
              <Upload className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">
                Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                PNG, JPG, WEBP or GIF (max 5MB)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {selectedImage && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex-1 h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </button>
            )}
            <button
              type="submit"
              className="flex-1 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm rounded-xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Save Picture</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
