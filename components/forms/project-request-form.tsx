"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Textarea } from "@/components/textarea";
import { sendProjectRequest } from "@/lib/actions/send-project-request";

export default function ProjectRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pitch: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    const result = await sendProjectRequest(formDataObj);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setFormData({ name: "", email: "", pitch: "" });
    }
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div aria-live="polite">
        {error && (
          <div
            className="rounded border border-destructive/30 bg-destructive/10 p-3 text-destructive text-sm"
            role="alert"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="rounded border border-primary/30 bg-primary/10 p-3 text-primary text-sm"
            role="status"
          >
            Thank you! Your message has been sent successfully.
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label
          className="font-mono text-foreground/80 text-xs uppercase tracking-widest"
          htmlFor="project-name"
        >
          Name
        </Label>
        <Input
          id="project-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          disabled={isSubmitting}
          className="h-11 rounded border-primary/20 bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <Label
          className="font-mono text-foreground/80 text-xs uppercase tracking-widest"
          htmlFor="project-email"
        >
          Email
        </Label>
        <Input
          id="project-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          disabled={isSubmitting}
          className="h-11 rounded border-primary/20 bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <Label
          className="font-mono text-foreground/80 text-xs uppercase tracking-widest"
          htmlFor="project-pitch"
        >
          Project pitch
        </Label>
        <Textarea
          id="project-pitch"
          name="pitch"
          value={formData.pitch}
          onChange={handleChange}
          placeholder="Pitch your project idea (minimum 50 characters)"
          required
          disabled={isSubmitting}
          rows={4}
          className="min-h-32 resize-none rounded border-primary/20 bg-background/50"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full uppercase tracking-wider"
        size="lg"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </Button>
    </form>
  );
}
