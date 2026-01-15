import { z } from "zod";

export const parcelSchema = z.object({
  // Sender Information
  senderName: z.string().min(3, "Sender name must be at least 3 characters"),
  senderAddress: z.string().min(5, "Pickup address is too short"),
  senderPhone: z
    .string()
    .min(11, "Valid phone number is required (min 11 digits)"),
  senderEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  // Receiver Information
  receiverName: z
    .string()
    .min(3, "Receiver name must be at least 3 characters"),
  receiverAddress: z.string().min(5, "Delivery address is too short"),
  receiverPhone: z
    .string()
    .min(11, "Receiver phone is required (min 11 digits)"),
  receiverEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  // Parcel Details
  description: z.string().min(5, "Please provide a short description"),
  cost: z.number().min(1, "Cost must be at least 1"),
});
