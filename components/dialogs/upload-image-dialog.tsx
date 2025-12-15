"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { apiPut } from "@/lib/api-client"
import { Loader2, Camera, Upload } from "lucide-react"
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"

interface UploadImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "avatar" | "coverImage"
  currentImage?: string | null
}

export function UploadImageDialog({ open, onOpenChange, type, currentImage }: UploadImageDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result === "string") {
        setPreview(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!preview || preview === currentImage) {
      onOpenChange(false)
      return
    }

    setLoading(true)

    try {
      const updateData = type === "avatar" 
        ? { avatar: preview }
        : { coverImage: preview }

      await apiPut("/api/users/profile", updateData)

      toast({
        title: "Success",
        description: `${type === "avatar" ? "Profile picture" : "Cover photo"} updated successfully`,
      })

      router.refresh()
      onOpenChange(false)
      setPreview(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPreview(currentImage || null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "avatar" ? "Update Profile Picture" : "Update Cover Photo"}
          </DialogTitle>
          <DialogDescription>
            {type === "avatar" 
              ? "Upload a new profile picture (JPG, PNG, or WebP up to 10MB)"
              : "Upload a new cover photo (JPG, PNG, or WebP up to 10MB). Recommended: 1200x400px"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/20">
            {type === "avatar" ? (
              <div className="relative h-64 w-full flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center space-y-3">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No image selected</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-48 w-full flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center space-y-3">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No image selected</p>
                  </div>
                )}
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute bottom-3 right-3"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Camera className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !preview || preview === currentImage}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

