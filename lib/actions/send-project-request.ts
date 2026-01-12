"use server";

import { Resend } from "resend";
import { z } from "zod";

import { EmailTemplate } from "@/components/templates/email-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

const projectRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address."),
  pitch: z.string().min(50, "Pitch must be at least 50 characters"),
});

export async function sendProjectRequest(formData: FormData) {
  try {
    const validatedData = projectRequestSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      pitch: formData.get("pitch"),
    });

    const { data, error } = await resend.emails.send({
      from: process.env.DEFAULT_SENDER_EMAIL_ADDRESS!,
      to: [process.env.DEFAULT_RECEPIENT_EMAIL_ADDRESS!],
      subject: `New Project Request: ${validatedData.name}`,
      react: EmailTemplate(validatedData),
    });

    if (error) {
      console.error("Email error:", error);
      return { error: "Failed to send the project request" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Project request error:", error);
    if (error instanceof z.ZodError) return { error: error.issues[0].message };

    return { error: "Failed to process project request" };
  }
}
