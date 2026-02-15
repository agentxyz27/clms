import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Catalog() {

    return (
      <div className="min-h-screen w-full bg-black">
        <iframe 
          src="miniGames/earthResources/index.html"
          className="w-full h-screen border-0"
          title="Earth Resources Game"
        />
      </div>
    );
}