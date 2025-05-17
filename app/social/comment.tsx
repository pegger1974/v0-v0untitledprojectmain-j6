import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export interface Comment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  updated_at: string
  profile?: {
    id: string
    username?: string
    full_name?: string
    avatar_url?: string
  }
}

interface CommentProps {
  comment: Comment
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="flex space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={comment.profile?.avatar_url || "/images/avatars/default-avatar.png"}
          alt={comment.profile?.username || "User"}
        />
        <AvatarFallback>{(comment.profile?.username || "User").substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <div className="font-medium text-sm">
            {comment.profile?.full_name || comment.profile?.username || "Anonymous User"}
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}

export function CommentsList({
  postId,
  comments,
  currentUserId,
  onDeleteComment,
}: {
  postId: string
  comments: Comment[]
  currentUserId?: string
  onDeleteComment: (commentId: string) => void
}) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
