import { cn } from "@/lib/utils"

interface PlaceholderImageProps {
  width?: number
  height?: number
  className?: string
  text?: string
}

export function PlaceholderImage({ width = 500, height = 300, className, text = "Image" }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
        className,
      )}
      style={{ width, height }}
    >
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
