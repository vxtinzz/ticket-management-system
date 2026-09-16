import { z } from "zod";

const idSchema = z
  .string()
  .trim()
  .min(1, "Invalid ID");

const titleSchema = z
  .string()
  .trim()
  .min(3, "Title must have at least 3 characters")
  .max(100, "Title must have at most 100 characters");

const descriptionSchema = z
  .string()
  .trim()
  .min(5, "Description must have at least 5 characters")
  .max(1000, "Description must have at most 1000 characters");

const prioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH"
]);

const statusSchema = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED"
]);

const responsibleNameSchema = z
  .string()
  .trim()
  .min(2, "Responsible name must have at least 2 characters")
  .max(100, "Responsible name must have at most 100 characters")
  .regex(
    /^[\p{L}\s'-]+$/u,
    "Responsible name contains invalid characters"
  );


export const ticketCreateSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  responsibleId: idSchema.optional()
});

export const ticketUpdateSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  responsibleId: idSchema.optional()
});

export const ticketIdSchema = z.object({
  id: idSchema
});

export const responsibleNameSchema = z.object({
    name: responsibleNameSchema
})

export const ticketPaginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  sortBy: z
    .enum(["createdAt", "priority", "status"])
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc")
});