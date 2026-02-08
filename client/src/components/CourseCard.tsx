import { type Course } from "@shared/schema";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, ChevronRight } from "lucide-react";

interface CourseCardProps {
  course: Course;
  progress?: number;
}

export function CourseCard({ course, progress = 0 }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute bottom-3 left-4 right-4 z-20">
            <span className="inline-block px-2 py-1 rounded-md bg-yellow-400/90 text-[#003366] text-xs font-bold backdrop-blur-sm shadow-sm mb-1">
              COURSE
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {course.description}
          </p>

          <div className="space-y-4">
            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>12 Modules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>24h Total</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-secondary" />
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button className="w-full py-2.5 rounded-lg bg-secondary text-primary font-semibold text-sm flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                Continue Learning
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
