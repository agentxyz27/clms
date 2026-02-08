import { z } from 'zod';
import { 
  insertCourseSchema, 
  insertModuleSchema, 
  insertAssignmentSchema, 
  insertSubmissionSchema,
  insertAnnouncementSchema,
  courses,
  modules,
  assignments,
  submissions,
  announcements,
  users 
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses' as const,
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/courses/:id' as const,
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    enroll: {
      method: 'POST' as const,
      path: '/api/courses/:id/enroll' as const,
      responses: {
        200: z.object({ message: z.string() }),
        401: errorSchemas.unauthorized,
      },
    }
  },
  modules: {
    listByCourse: {
      method: 'GET' as const,
      path: '/api/courses/:id/modules' as const,
      responses: {
        200: z.array(z.custom<typeof modules.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/modules/:id' as const,
      responses: {
        200: z.custom<typeof modules.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  assignments: {
    listByCourse: {
      method: 'GET' as const,
      path: '/api/courses/:id/assignments' as const,
      responses: {
        200: z.array(z.custom<typeof assignments.$inferSelect>()),
      },
    },
    submit: {
      method: 'POST' as const,
      path: '/api/assignments/:id/submit' as const,
      input: z.object({ content: z.string() }),
      responses: {
        201: z.custom<typeof submissions.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    }
  },
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements' as const,
      responses: {
        200: z.array(z.custom<typeof announcements.$inferSelect & { author: typeof users.$inferSelect }>()),
      },
    }
  },
  users: {
     online: {
       method: 'GET' as const,
       path: '/api/users/online' as const,
       responses: {
         200: z.array(z.custom<typeof users.$inferSelect>()),
       }
     }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
