"use client"

// Instead of importing from another file, let's implement the hook directly
// This is a simplified version that re-exports from the actual location

import { useToast as useToastOriginal, toast as toastOriginal } from "../components/ui/use-toast"

export const useToast = useToastOriginal
export const toast = toastOriginal
