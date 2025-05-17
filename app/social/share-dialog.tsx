"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Facebook, Twitter } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string | null
  onClose: () => void
}

export function ShareDialog({ open, onOpenChange, postId, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!postId) return null

  const shareUrl = `${window.location.origin}/social/post/${postId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast({
      title: "Link copied",
      description: "The post link has been copied to your clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    let shareLink = ""

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out this post on ScootX!")}`
        break
      default:
        return
    }

    window.open(shareLink, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <Button variant="outline" onClick={() => handleShare("facebook")}>
            <Facebook className="h-5 w-5 mr-2" />
            Facebook
          </Button>
          <Button variant="outline" onClick={() => handleShare("twitter")}>
            <Twitter className="h-5 w-5 mr-2" />
            Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
