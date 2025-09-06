import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string, imagePath: string) => void;
  currentImageUrl?: string;
  session: any;
}

export function ImageUpload({ onImageUploaded, currentImageUrl, session }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a JPEG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-213a9f17/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        onImageUploaded(data.imageUrl, data.imagePath);
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    }
    setUploading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onImageUploaded('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {currentImageUrl ? (
        <div className="relative">
          <div className="aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <img
              src={currentImageUrl}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragOver
              ? 'border-green-500 bg-green-50'
              : uploading
              ? 'border-green-300 bg-green-25'
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-green-600 font-medium">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-4 relative">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Upload className="h-3 w-3 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Add Product Image
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop an image here, or click to browse
              </p>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
              
              <div className="mt-4 text-xs text-gray-400">
                <p>Supported formats: JPEG, PNG, WebP</p>
                <p>Maximum size: 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}