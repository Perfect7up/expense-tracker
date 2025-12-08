import { create } from "zustand";
import { z } from "zod";
import { Message } from "../types/types";
import { INITIAL_WELCOME_MESSAGE } from "../constants/constants";

const ChatSchema = z.object({
  open: z.boolean().default(false),
  input: z.string().default(""),
  messages: z.array(z.any()).default([INITIAL_WELCOME_MESSAGE]),
  loading: z.boolean().default(false),
  success: z.boolean().default(false),
  messageCounter: z.number().default(1),
});

type ChatState = z.infer<typeof ChatSchema>;

export const useChatStore = create<
  ChatState & {
    setOpen: (open: boolean) => void;
    setInput: (input: string) => void;
    addMessage: (msg: Message) => void;
    clearMessages: () => void;
    incrementCounter: () => void;
    setLoading: (loading: boolean) => void;
    setSuccess: (success: boolean) => void;
  }
>((set, get) => ({
  ...ChatSchema.parse({}),
  setOpen: (open) => set({ open }),
  setInput: (input) => set({ input }),
  addMessage: (msg) => set({ messages: [...get().messages, msg] }),
  clearMessages: () =>
    set({ messages: [INITIAL_WELCOME_MESSAGE], messageCounter: 1 }),
  incrementCounter: () => set({ messageCounter: get().messageCounter + 1 }),
  setLoading: (loading) => set({ loading }),
  setSuccess: (success) => set({ success }),
}));
