"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_COUNT } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface FreeCounterProps {
    apiLimitCount:number;
} 

const FreeCounter = ({
    apiLimitCount=0
}:FreeCounterProps) => {

 const [mounted,setMounted]=useState(false)

    useEffect(()=>{
        setMounted(true);
    },[]);

  return (
    <div className=" flex justify-center">
        <Card className="bg-white/60 border-1 w-[90%]">
            <CardContent className="py-4">
                  <div className="text-center text-sm text-black mb-4 space-y-2">
                    <p> Free Generations - {apiLimitCount} / {MAX_FREE_COUNT}</p>
                    <Progress className="h-3"
                    value={(apiLimitCount/MAX_FREE_COUNT)*100} />
                  </div>
                  <Button className="w-full" variant="preimium">
                      Upgrade
                      <Zap className="w-4 h-4 ml-2 fill-white"/>
                  </Button>
            </CardContent>
        </Card>
    </div>
  )
}

export default FreeCounter;