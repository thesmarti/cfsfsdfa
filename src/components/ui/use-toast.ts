
import { useToast as useToastHook, toast } from "@/hooks/use-toast";

// Re-export toast functions
export const useToast = useToastHook;
export { toast };
