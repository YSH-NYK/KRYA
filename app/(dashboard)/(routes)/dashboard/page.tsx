"use client";
import { Card } from "@/components/ui/card";
import { ArrowRight,MessageSquare } from "lucide-react";
import { Code, ImageIcon, LayoutDashboard, Music, Settings, VideoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-black-500",
    bgColor: "bg-white-500/100",
    href:"/conversation"
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href:"/image",
    color:"text-white-500",
   },
   {
    label: "Video Generation",
    icon: VideoIcon,
    href:"/video",
    color:"text-white-500",
   },
   {
    label: "Music Generation",
    icon: Music,
    href:"/music",
    color:"text-white-500",
   },
   {
    label: "Code Generation",
    icon: Code,
    href:"/code",
    color:"text-white-500",
   }
]

const DashboardPage = () => {

  const router = useRouter();
  return (
    <div>
      <div className='mb-8 space-y-4'>
        <h2 className='text-2xl md:text-4xl font-bold text-center'>
          Dive into AI Innovations
        </h2>
        <p className='text-muted-foreground font-light text-sm md:text-lg text-center'>
          Speak with KRYA AI - Experience the Difference
        </p>
      </div>
      <br />
      <div className='px-4 md:pc-20 lg:px-32 space-y-4'>
          {tools.map((tool)=>(
              <Card 
              onClick={() => router.push(tool.href)}
              key={tool.href}
              className="p-4 border-black/5 flex item-center
              justify-between hover:shadow-md transistion
              cursor-pointer"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md",tool
                   .bgColor)}>
                      <tool.icon className={cn("w-8 h-8",tool.color)}/>
                  </div>
                  <div className="font-semibold">
                    {tool.label}
                  </div>
                </div>
                <ArrowRight className="w-5 h-10"/>
              </Card>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage;
