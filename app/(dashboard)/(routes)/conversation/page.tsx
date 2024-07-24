"use client";

import axios from "axios";
import * as z from "zod";
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

interface ChatCompletionRequestMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface ChatCompletionResponseMessage {
  role: 'assistant';
  content: string;
}

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];
      const response = await axios.post('/api/conversation', { messages: newMessages });

      // Log server response
      console.log("Server response:", response.data);

      if (response.data && response.data.openai) {
        const generatedText = response.data.openai.generated_text;
        if (generatedText) {
          const assistantMessage: ChatCompletionResponseMessage = {
            role: 'assistant',
            content: generatedText
          };
          setMessages([...newMessages, assistantMessage]);
        } else {
          console.error("No generated text found in response:", response.data);
        }
      } else {
        console.error("Invalid response format:", response.data);
      }

      form.reset();
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);
      } else {
        console.error("Error message:", (error as Error).message);
      }
    } finally {
      setIsLoading(false);
      router.refresh();  // Optional: refresh the page if needed
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our Top-Tier Conversational Engine."
        icon={MessageSquare}
        iconColor="text-white-500"
        bgColor="bg-white-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg
                border
                w-full 
                p-4
                px-3md:px-6
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
                bg-white
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="
                          border-0
                          outline-none
                          focus-visible:ring-0
                          focus-visible:ring-transparent
                        "
                        disabled={isLoading}
                        placeholder="Message KRYA-Gpt"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="bg-black hover:bg-gray-300 hover:text-black col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-[#F3F4F6]">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label="No Conversation Started Yet" />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className={cn("text-sm")}>
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
