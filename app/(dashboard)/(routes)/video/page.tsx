"use client";

import axios from "axios";
import * as z from "zod";
import Heading from "@/components/heading";
import {  Video } from "lucide-react";
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


const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string>();
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
        setVideo(undefined);
      
      const response = await axios.post('/api/video',values);
      setVideo(response.data[0]);
      // Log server response
      console.log("Server response:", response.data);


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
        title="Video-Generation"
        description="Turn prompt to Video"
        icon={Video}
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
                        placeholder="Prompt goes here"
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
          {!video && !isLoading && (
            <div>
              <Empty label="No Videos generated yet" />
            </div>
          )}
          {video && (
            <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black" >
              <source src={video}/>
            </video>

          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
