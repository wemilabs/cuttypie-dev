"use client";

import { useState } from "react";
import { sendProjectRequest } from "@/actions/send-project-request";

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

    // Create FormData object
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    // Send request using server action
    const result = await sendProjectRequest(formDataObj);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Reset form
      setFormData({ name: "", email: "", pitch: "" });
    }

    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error and success when user starts typing
    setError(null);
    setSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
          Thank you! Your message has been sent successfully.
        </div>
      )}
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-transparent placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-transparent placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <textarea
          name="pitch"
          value={formData.pitch}
          onChange={handleChange}
          placeholder="Pitch your project idea (minimum 50 characters)"
          required
          disabled={isSubmitting}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-transparent placeholder:text-white/30 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-yellow-200 text-black rounded-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
