
// Re-export toast functions from the hook
import { useToast as useToastHook, toast } from "@/hooks/use-toast";

export const useToast = useToastHook;
export { toast };
