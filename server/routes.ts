import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertSubmissionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // === API ROUTES ===

  // Courses
  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get(api.courses.get.path, async (req, res) => {
    const course = await storage.getCourse(Number(req.params.id));
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  });

  app.post(api.courses.enroll.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const courseId = Number(req.params.id);
    await storage.enrollUser(userId, courseId);
    res.json({ message: "Enrolled successfully" });
  });

  // Modules
  app.get(api.modules.listByCourse.path, async (req, res) => {
    const modules = await storage.getModulesByCourse(Number(req.params.id));
    res.json(modules);
  });

  app.get(api.modules.get.path, async (req, res) => {
    const module = await storage.getModule(Number(req.params.id));
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json(module);
  });

  // Assignments
  app.get(api.assignments.listByCourse.path, async (req, res) => {
    const assignments = await storage.getAssignmentsByCourse(Number(req.params.id));
    res.json(assignments);
  });

  app.post(api.assignments.submit.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assignmentId = Number(req.params.id);
      const content = req.body.content;

      if (!content) return res.status(400).json({ message: "Content required" });

      const submission = await storage.createSubmission({
        studentId: userId,
        assignmentId,
        content
      });

      res.status(201).json(submission);
    } catch (error) {
       res.status(500).json({ message: "Internal server error" });
    }
  });

  // Announcements
  app.get(api.announcements.list.path, async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  // Users
  app.get(api.users.online.path, async (req, res) => {
    const users = await storage.getOnlineUsers();
    res.json(users);
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const courses = await storage.getCourses();
  if (courses.length > 0) return;

  console.log("Seeding database...");

  // Create a default teacher user (mock) if not exists (Auth usually handles this on login)
  // For seeding, we'll just use a placeholder ID if needed, or rely on the first user who logs in.
  // Actually, we can create a system user for announcements.
  const systemUser = await authStorage.upsertUser({
    id: "system-admin",
    email: "admin@sti.edu",
    firstName: "System",
    lastName: "Admin",
    profileImageUrl: ""
  });

  // Create Courses
  const course1 = await storage.createCourse({
    title: "Empowerment Technologies",
    description: "Information and Communication Technologies as a tool for curating, contextualizing, collaborating, and creating content and experiences for learning in the professional tracks.",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    teacherId: systemUser.id
  });

  const course2 = await storage.createCourse({
    title: "Media and Information Literacy",
    description: "The course introduces the learners to basic understanding of media and information as channels of communication and tools for the development of individuals and societies.",
    imageUrl: "https://images.unsplash.com/photo-1557853197-aefb550b6fdc",
    teacherId: systemUser.id
  });

   const course3 = await storage.createCourse({
    title: "Introduction to World Religions",
    description: "The course explores the main tenets and practices of major world religions: Judaism, Christianity, Islam, Hinduism, Theravada Buddhism, Mahayana Buddhism, Confucianism, Taoism and Shintoism.",
    imageUrl: "https://images.unsplash.com/photo-1585675208722-19e830e20e32",
    teacherId: systemUser.id
  });

  // Create Modules for Course 1
  await storage.createModule({
    courseId: course1.id,
    title: "Module 1: ICT in the Context of Global Communication",
    content: "<p>Welcome to Module 1. In this module we will discuss...</p>",
    order: 1
  });

  await storage.createModule({
    courseId: course1.id,
    title: "Module 2: Online Safety, Security, Ethics, and Etiquette",
    content: "<p>Safety first! Here is how you stay safe online...</p>",
    order: 2
  });

  // Create Assignments for Course 1
  await storage.createAssignment({
    courseId: course1.id,
    title: "Seatwork 1: Online Safety Analysis",
    description: "Analyze the given scenario and identify potential security risks.",
    dueDate: new Date(Date.now() + 86400000 * 3) // 3 days from now
  });

   await storage.createAssignment({
    courseId: course1.id,
    title: "Performance Task 1: Create a Blog",
    description: "Create a blog post about your favorite hobby using a CMS.",
    dueDate: new Date(Date.now() + 86400000 * 7) // 7 days from now
  });

  // Create Announcements
  await storage.createAnnouncement({
    title: "Welcome to the new School Year!",
    content: "We are excited to have you back. Please check your course enrollments.",
    authorId: systemUser.id
  });

  await storage.createAnnouncement({
    title: "System Maintenance",
    content: "The LMS will be undergoing maintenance this Saturday from 10PM to 2AM.",
    authorId: systemUser.id
  });

  console.log("Database seeded successfully!");
}
