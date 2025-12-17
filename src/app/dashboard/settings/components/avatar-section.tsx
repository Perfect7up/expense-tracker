"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import { Button } from "@/app/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/core/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/core/components/ui/dialog";
import { Slider } from "@/app/core/components/ui/slider";
import {
  Camera,
  Upload,
  User,
  Trash2,
  Edit,
  X,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";
import { updateUser } from "../lib/api";
import { User as UserType } from "../types";
import { canvasPreview } from "../lib/image-utils";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface AvatarSectionProps {
  user: UserType;
}

export default function AvatarSection({ user }: AvatarSectionProps) {
  const queryClient = useQueryClient();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // Refs for Media
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Live preview for crop
  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
    }
  }, [completedCrop, scale, rotate]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: { avatar: File }) => updateUser(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      setAvatarPreview(data.user.avatarUrl || null);
      setSelectedFile(null);
      setIsCropping(false);
      setCrop(undefined);
      setScale(1);
      setRotate(0);
      toast.success("Profile picture updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMutation = useMutation({
    mutationFn: () => updateUser({ avatar: null }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      setAvatarPreview(null);
      setSelectedFile(null);
      toast.success("Profile picture removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // 1. File Selection Logic
  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setIsCropping(true);
    setScale(1);
    setRotate(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  // 2. Camera Logic
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      toast.error("Unable to access camera. Check permissions.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          handleFileSelect(file);
          closeCamera();
        }
      }, "image/jpeg", 0.9);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraOpen(false);
  };

  // 3. Crop Logic
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidth = Math.min(width, height) * 0.8;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: "px", width: cropWidth }, ASPECT_RATIO, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const getCroppedImage = async (): Promise<File | null> => {
    if (!imgRef.current || !completedCrop || !selectedFile) return null;
    const canvas = document.createElement("canvas");
    await canvasPreview(imgRef.current, canvas, completedCrop, scale, rotate);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], selectedFile.name, { type: selectedFile.type }));
        } else {
          resolve(null);
        }
      }, selectedFile.type);
    });
  };

  const handleCropComplete = async () => {
    const croppedFile = await getCroppedImage();
    if (croppedFile) updateMutation.mutate({ avatar: croppedFile });
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setCrop(undefined);
    setSelectedFile(null);
    setAvatarPreview(user.avatarUrl || null);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 h-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id="avatar-upload"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Avatar Area */}
      <div className="relative group cursor-pointer">
        {/* The Image Circle */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:ring-blue-400/30">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Profile"
              fill
              className="object-cover transition-transform duration-500"
              sizes="(max-width: 768px) 160px, 192px"
              unoptimized={avatarPreview.startsWith("blob:")}
              priority
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <User className="w-20 h-20 text-blue-400" />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg font-semibold border border-white/50"
                >
                  <Edit className="w-4 h-4 mr-2 text-blue-600" />
                  Edit Photo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 mt-2">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer py-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 mr-3">
                    <Upload className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Upload New</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={openCamera} className="cursor-pointer py-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 mr-3">
                     <Camera className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Take Photo</span>
                </DropdownMenuItem>
                
                {avatarPreview && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => removeMutation.mutate()}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer py-3"
                      disabled={removeMutation.isPending}
                    >
                       <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 mr-3">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="font-medium">Remove</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Loading Spinner Overlay */}
        {updateMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-white/60 rounded-full blur-sm" />
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent relative z-10" />
          </div>
        )}

        {/* Camera Active Indicator */}
        {isCameraOpen && (
          <div className="absolute top-0 right-0 animate-pulse z-20">
            <span className="relative flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-white"></span>
            </span>
          </div>
        )}
      </div>
      
      <p className="mt-6 text-sm text-center text-slate-500 font-medium max-w-[200px]">
        {avatarPreview ? "Tap to update your photo" : "Add a profile picture"}
      </p>

      {/* --- Dialogs (Crop & Camera) remain mostly same but cleaner --- */}
      
      {/* Cropping Dialog */}
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogDescription>
              Crop and adjust your photo for the best fit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center min-h-[300px]">
                {avatarPreview && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={ASPECT_RATIO}
                    minWidth={MIN_DIMENSION}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      src={avatarPreview}
                      alt="Crop preview"
                      style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                      onLoad={onImageLoad}
                      className="max-h-[50vh] object-contain"
                    />
                  </ReactCrop>
                )}
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3"/> Zoom</span>
                    <span>{scale.toFixed(1)}x</span>
                  </div>
                  <Slider value={[scale]} min={0.5} max={3} step={0.1} onValueChange={([v]) => setScale(v)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><RotateCw className="w-3 h-3"/> Rotate</span>
                    <span>{rotate}°</span>
                  </div>
                  <Slider value={[rotate]} min={-180} max={180} step={90} onValueChange={([v]) => setRotate(v)} />
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col items-center justify-center space-y-6 bg-slate-50 rounded-xl p-6 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Result Preview</span>
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-200">
                <canvas ref={previewCanvasRef} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                 <p className="text-xs text-slate-500">This is how your profile<br/>will look to others.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleCancelCrop}>Cancel</Button>
            <Button onClick={handleCropComplete} disabled={updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={closeCamera}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-black border-slate-800">
           <div className="relative h-[500px] w-full">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
               <div className="w-64 h-64 rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
            </div>
            
            <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
               <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full w-12 h-12" onClick={closeCamera}>
                 <X className="w-6 h-6" />
               </Button>
               <Button 
                  size="icon" 
                  className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 hover:bg-slate-200 hover:scale-105 transition-all"
                  onClick={capturePhoto} 
                >
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-800" />
               </Button>
               <div className="w-12" /> {/* Spacer */}
            </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}