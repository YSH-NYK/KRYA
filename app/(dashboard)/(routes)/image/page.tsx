"use client";

import axios from "axios";
import * as z from "zod";
import Heading from "@/components/heading";
import { Music2 } from "lucide-react";
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

const ImagePage = () => {
  const router = useRouter();
  const [image, setImage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      seed: "",
      guidanceScale: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setImage(undefined);

      const response = await axios.post<{ id: string }>('/api/prediction', values);
      const { id } = response.data;

      let status = "pending";
      while (status === "pending") {
        const result = await axios.get<{ output: string[]; status: string }>(`/api/prediction/${id}`);
        status = result.data.status;
        if (status === "succeeded") {
          setImage(result.data.output[0]);
          break;
        } else if (status === "failed") {
          setIsLoading(false);
          console.error("Prediction failed");
          break;
        }
        await new Promise(res => setTimeout(res, 1000));
      }

      form.reset();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Image-Generator"
        description="Turn prompt to Image"
        icon={Music2}
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
              <FormField
                name="seed"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-5">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="
                          border-0
                          outline-none
                          focus-visible:ring-0
                          focus-visible:ring-transparent
                        "
                        disabled={isLoading}
                        placeholder="Seed (optional)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="guidanceScale"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-5">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="
                          border-0
                          outline-none
                          focus-visible:ring-0
                          focus-visible:ring-transparent
                        "
                        disabled={isLoading}
                        placeholder="Guidance Scale (optional)"
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
          {!image && !isLoading && (
            <div>
              <Empty label="No Images generated yet" />
            </div>
          )}
          {image && (
            <div className="w-full mt-8">
              <img src={image} alt="Generated" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
