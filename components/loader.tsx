import Image from "next/image";

export const Loader = () => {

return(
    <div className="h-full  flex flex-col items-center justify-center">
        <div className="relative h-10 w-10 animate-spin">
            <Image src="/Loader.gif" alt="logo" fill/>
        </div>
        <p className="text-muted-foreground text-sm">
            KRYA AI is Loading...
        </p>
    </div>
);
}