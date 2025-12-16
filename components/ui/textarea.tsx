import * as React from 'react'

import { cn } from '@/lib/utils'

// Define the Textarea component function
// It accepts optional className and uses React.ComponentProps<'textarea'>
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base Styling: Mimics the Input component's general appearance
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

        // Specific Textarea adjustments: Typically needs min height
        'min-h-[80px]',

        // Focus State: Matches the Input's focus ring/border color
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',

        // Error State: Matches the Input's error (aria-invalid) styling
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

        // Allow user-provided classes to override defaults
        className,
      )}
      {...props}
    />
  )
}

// Ensure the component can be imported
export { Textarea }