import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useOnlineUsers } from "@/hooks/use-online-users";
import { Bell, User, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

export function RightSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: announcements } = useAnnouncements();
  const { data: onlineUsers } = useOnlineUsers();

  return (
    <div className="w-[320px] h-screen bg-white border-l border-border fixed right-0 top-0 overflow-y-auto custom-scrollbar hidden xl:block p-6 space-y-8">
      
      {/* User Profile Summary */}
      <div className="flex items-center justify-end gap-4 mb-8">
        <div className="relative">
          <Bell className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </div>
      </div>

      {/* Calendar Widget */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Schedule
        </h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-none w-full flex justify-center p-0"
        />
      </div>

      {/* To-Do List Widget */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Tasks
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, title: "Submit IT101 Assignment", due: "Today, 5:00 PM", urgency: "high" },
            { id: 2, title: "Review Module 3 Quiz", due: "Tomorrow", urgency: "medium" },
            { id: 3, title: "Group Project Meeting", due: "Fri, 2:00 PM", urgency: "low" },
          ].map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
              <div className={`w-2 h-2 mt-1.5 rounded-full ${
                task.urgency === 'high' ? 'bg-red-500' : task.urgency === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.due}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements Widget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Announcements</h3>
          <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
        </div>
        <div className="space-y-4">
          {announcements?.slice(0, 3).map((announcement) => (
            <div key={announcement.id} className="group relative pl-4 border-l-2 border-border hover:border-primary transition-colors">
              <p className="text-xs text-muted-foreground mb-1">{format(new Date(), "MMM dd, yyyy")}</p>
              <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {announcement.title}
              </h4>
            </div>
          )) || (
            <p className="text-sm text-muted-foreground italic">No announcements yet.</p>
          )}
        </div>
      </div>

      {/* Online Users Widget */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Online Now
        </h3>
        <div className="flex flex-wrap gap-2">
          {onlineUsers?.length ? onlineUsers.map((user) => (
            <div key={user.id} className="relative group cursor-pointer" title={`${user.firstName} ${user.lastName}`}>
               <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
               </div>
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
          )) : (
            [1,2,3,4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
            ))
          )}
        </div>
      </div>

    </div>
  );
}
