import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      // Return a mock user for testing to avoid login redirects
      const mockUser = {
        id: "mock-student-id",
        email: "student@example.edu",
        firstName: "Mock",
        lastName: "Student",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MockStudent",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(mockUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
