import { useParams, useLocation } from "wouter";
import { useCourse } from "@/hooks/use-courses";
import { useModules } from "@/hooks/use-modules";
import { useAssignments } from "@/hooks/use-assignments";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  PlayCircle, 
  CheckCircle,
  Clock,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSubmitAssignment } from "@/hooks/use-assignments";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const courseId = Number(id);
  
  const { data: course, isLoading: loadingCourse } = useCourse(courseId);
  const { data: modules, isLoading: loadingModules } = useModules(courseId);
  const { data: assignments, isLoading: loadingAssignments } = useAssignments(courseId);

  if (loadingCourse || loadingModules || loadingAssignments) {
    return <CourseDetailSkeleton />;
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Button 
          variant="ghost" 
          className="w-fit pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-8 z-20 max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-yellow-400 text-[#003366] text-xs font-bold px-3 py-1 rounded-full">
                COURSE
              </span>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" /> 4 weeks duration
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl text-white mb-2">{course.title}</h1>
            <p className="text-white/80 text-lg leading-relaxed">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modules List (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-[#003366]">Course Content</h2>
            <span className="text-sm text-muted-foreground font-medium">
              {modules?.length} Modules • {assignments?.length} Assignments
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {modules?.map((module, index) => (
                <AccordionItem key={module.id} value={`item-${module.id}`} className="border-b last:border-0">
                  <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#003366] flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{module.title}</h3>
                        <p className="text-sm text-muted-foreground font-normal">3 Topics • 1 Assignment</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 bg-slate-50/50">
                    <div className="space-y-3 pt-2">
                      <div className="p-4 rounded-xl bg-white border border-border flex items-start gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
                        <PlayCircle className="w-5 h-5 text-primary mt-0.5 group-hover:text-yellow-500 transition-colors" />
                        <div>
                          <h4 className="font-medium text-foreground">Video Lecture</h4>
                          <p className="text-sm text-muted-foreground">15 mins</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-white border border-border flex items-start gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
                        <FileText className="w-5 h-5 text-primary mt-0.5 group-hover:text-yellow-500 transition-colors" />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">Reading Material</h4>
                          <div 
                            className="text-sm text-muted-foreground mt-1 line-clamp-3 prose prose-sm max-w-none" 
                            dangerouslySetInnerHTML={{ __html: module.content }} 
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Assignments Sidebar (Right 1/3) */}
        <div className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-[#003366]">Assignments</h2>
          
          <div className="space-y-4">
            {assignments?.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
            {(!assignments || assignments.length === 0) && (
               <div className="p-6 text-center border border-dashed rounded-xl border-border bg-white">
                 <CheckCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                 <p className="text-sm text-muted-foreground">No assignments yet</p>
               </div>
            )}
          </div>

          {/* Resources Widget */}
          <div className="bg-[#003366] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <h3 className="font-display font-bold text-lg mb-4 relative z-10">Course Resources</h3>
            <div className="space-y-3 relative z-10">
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Syllabus</span>
                <span className="text-xs opacity-70">PDF</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Reference Guide</span>
                <span className="text-xs opacity-70">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const { mutate, isPending } = useSubmitAssignment();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    mutate(
      { id: assignment.id, content },
      {
        onSuccess: () => {
          setIsOpen(false);
          setContent("");
          toast({
            title: "Assignment Submitted",
            description: "Your work has been successfully uploaded.",
            variant: "default",
          });
        },
        onError: () => {
          toast({
            title: "Submission Failed",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-foreground line-clamp-1">{assignment.title}</h4>
        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Due Soon</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{assignment.description}</p>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-[#003366] hover:bg-[#002244] text-white">
            View & Submit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{assignment.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h5 className="text-sm font-semibold mb-1">Instructions:</h5>
              <p className="text-sm text-muted-foreground">{assignment.description}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Submission (Link or Text)</label>
              <Textarea 
                placeholder="Paste your Google Drive link or type your answer..." 
                className="min-h-[120px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isPending || !content.trim()}
                className="bg-[#003366] text-white"
              >
                {isPending ? "Submitting..." : "Submit Assignment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="col-span-1 space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
