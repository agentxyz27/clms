import { db } from "./db";
import { 
  courses, modules, assignments, submissions, enrollments, announcements, users,
  type InsertCourse, type InsertModule, type InsertAssignment, type InsertSubmission, type InsertAnnouncement,
  type Course, type Module, type Assignment, type Submission, type Announcement, type User
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Modules
  getModulesByCourse(courseId: number): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;

  // Assignments
  getAssignmentsByCourse(courseId: number): Promise<Assignment[]>;
  getAssignment(id: number): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;

  // Submissions
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]>;
  getSubmission(assignmentId: number, studentId: string): Promise<Submission | undefined>;

  // Enrollments
  enrollUser(userId: string, courseId: number): Promise<void>;
  getUserEnrollments(userId: string): Promise<number[]>; // returns course IDs

  // Announcements
  getAnnouncements(): Promise<(Announcement & { author: User })[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  // Users (Online - Mock/Real)
  getOnlineUsers(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async getModulesByCourse(courseId: number): Promise<Module[]> {
    return await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(modules.order);
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(insertModule).returning();
    return module;
  }

  async getAssignmentsByCourse(courseId: number): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.courseId, courseId));
  }

  async getAssignment(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db.insert(assignments).values(insertAssignment).returning();
    return assignment;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db.insert(submissions).values(insertSubmission).returning();
    return submission;
  }

  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
  }

  async getSubmission(assignmentId: number, studentId: string): Promise<Submission | undefined> {
    const [submission] = await db.select()
      .from(submissions)
      .where(eq(submissions.assignmentId, assignmentId))
      .where(eq(submissions.studentId, studentId));
    return submission;
  }

  async enrollUser(userId: string, courseId: number): Promise<void> {
    await db.insert(enrollments).values({ userId, courseId });
  }

  async getUserEnrollments(userId: string): Promise<number[]> {
    const results = await db.select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
    return results.map(r => r.courseId);
  }

  async getAnnouncements(): Promise<(Announcement & { author: User })[]> {
    // Join with users to get author info
    const result = await db.select({
      announcement: announcements,
      author: users
    })
    .from(announcements)
    .innerJoin(users, eq(announcements.authorId, users.id))
    .orderBy(desc(announcements.createdAt));

    return result.map(row => ({ ...row.announcement, author: row.author }));
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }

  async getOnlineUsers(): Promise<User[]> {
    // Mock implementation for now, or fetch recent active users
    return await db.select().from(users).limit(5);
  }
}

export const storage = new DatabaseStorage();
