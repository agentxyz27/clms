import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Resources(){
    return (
      <div className="min-h-screen w-full bg-black">
        <iframe 
          src="miniGames/earthLayerzz/index.html"
          className="w-full h-screen border-0"
          title="Earth Layers Game"
        />
      </div>
    );
}