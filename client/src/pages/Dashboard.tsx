import { useAuth } from "@/hooks/use-auth";
import { useCourses } from "@/hooks/use-courses";
import { CourseCard } from "@/components/CourseCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Trophy, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: courses, isLoading: isCoursesLoading } = useCourses();

  if (isAuthLoading || isCoursesLoading) {
    return <DashboardSkeleton />;
  }


  // Calculate random progress for demo purposes
  const getProgress = (id: number) => ((id * 17) % 100);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003366] to-[#004d99] text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-400/10 -skew-x-12 transform origin-bottom-right" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-yellow-300 text-sm font-semibold backdrop-blur-md border border-white/10">
              <span>Keep up the great work!</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight">
              Welcome back, <br/>
              <span className="text-yellow-400">{user?.firstName || "Stupidents"}!</span>
            </h1>
            <p className="text-blue-100 text-lg">
              You have <span className="font-bold text-white">4 pending assignments</span> and <span className="font-bold text-white">2 quizzes</span> due this week.
            </p>
          </div>
          
          {/* Decorative Illustration placeholder */}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatsCard icon={BookOpen} label="Enrolled Courses" value={courses?.length || 0} color="bg-blue-500" />
         <StatsCard icon={Clock} label="Hours Spent" value="24.5" color="bg-green-500" />
         <StatsCard icon={Trophy} label="Completed" value="2" color="bg-yellow-500" />
      </div>

      {/* Courses Section */}
      <div className="space-y-6">
        <Tabs defaultValue="enrolled" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-[#003366]">My Courses</h2>
            <TabsList className="bg-white border border-border p-1 h-10 rounded-xl">
              <TabsTrigger value="enrolled" className="rounded-lg data-[state=active]:bg-[#003366] data-[state=active]:text-white">Enrolled</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-[#003366] data-[state=active]:text-white">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="enrolled" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard course={course} progress={getProgress(course.id)} />
                </motion.div>
              ))}
              {(!courses || courses.length === 0) && (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-border">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No courses enrolled</h3>
                  <p className="text-muted-foreground">Browse the catalog to start learning.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
             <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-border">
               <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-foreground">No completed courses yet</h3>
               <p className="text-muted-foreground">Keep learning to earn certificates!</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-${color.replace('bg-', '')}`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <h4 className="text-2xl font-bold text-foreground">{value}</h4>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
