"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const LandingContent = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 pb-10 sm:pb-15 md:pb-20">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl text-white font-extrabold mb-6 sm:mb-8 md:mb-10">
        Developers
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-9 m-2">
        <Card className="bg-white/10 border-none text-white mb-6 md:mb-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-x-2">
              <img src="/krishna.jpg" alt="Krishna Biliye" className="w-12 md:w-16 lg:w-20 rounded-full" />
              <div>
                <p className="text-md md:text-lg">Krishna Biliye</p>
                <p className="text-white-400 text-xs md:text-sm">Software Developer</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white/10 border-none text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-x-2">
              <img src="/Yash.png" alt="Yash Naik" className="w-12 md:w-16 lg:w-20 rounded-full" />
              <div>
                <p className="text-md md:text-lg">Yash Naik</p>
                <p className="text-white-400 text-xs md:text-sm">Software Developer</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export default LandingContent;
