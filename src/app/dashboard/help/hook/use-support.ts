import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SupportTicketData {
  subject: string;
  message: string;
}

export const useSupportTicket = () => {
  return useMutation({
    mutationFn: async (data: SupportTicketData) => {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Message sent successfully", {
        description: "Our support team will get back to you shortly.",
      });
    },
    onError: () => {
      toast.error("Failed to send message", {
        description: "Please try again later or contact us via email.",
      });
    },
  });
};