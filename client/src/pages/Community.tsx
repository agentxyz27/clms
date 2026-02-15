import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Community() {

    return (
      <div className="min-h-screen w-full bg-black">
        <iframe 
          src="miniGames/mineralCollector/index.html"
          className="w-full h-screen border-0"
          title="Mineral Collector Game"
        />
      </div>
    );
}