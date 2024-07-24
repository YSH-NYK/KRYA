"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger,SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { getAPiLimitCount } from "@/lib/api-limit"


const Mobilesidebar = async() => {
    const [isMounted,setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);
    if(!isMounted){
        return null;
    }
    const apiLimitCount = await getAPiLimitCount();
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
        
        <Sidebar apiLimitCount = {apiLimitCount}/>
            </SheetContent>
        </Sheet>
    )
}

export default Mobilesidebar;