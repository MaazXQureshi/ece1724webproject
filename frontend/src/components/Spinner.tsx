import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export const LoadingSpinner = ({ className, size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div
      className={ cn(
        "inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        sizeClasses[size],
        className
      ) }
      role="status"
    >
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  )
}

// Full page loading
interface LoadingOverlayProps {
  message?: string
  className?: string
}

export function LoadingOverlay({
                                 message = "Loading...",
                                 className
                               }: LoadingOverlayProps) {
  return (
    <div className={ cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center  ",
      className
    ) }>
      <LoadingSpinner size="lg"/>
      <p className="mt-4 text-lg font-medium text-foreground">{ message }</p>
    </div>
  )
}