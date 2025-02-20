import { z } from "zod"

export const FORM_FIELDS = {
  role: {
    name: "role",
    label: "Role",
    placeholder: "Select Role",
    validation: z.string({
      required_error: "Please select a role.",
    }),
    options: [
      { value: "frontend", label: "Frontend Developer" },
      { value: "backend", label: "Backend Developer" },
      { value: "fullstack", label: "Fullstack Developer" },
      { value: "devops", label: "DevOps Engineer" },
    ],
  },
  experience: {
    name: "experience",
    label: "Experience",
    placeholder: "Select Experience",
    validation: z.string({
      required_error: "Please select experience level.",
    }),
    options: [
      { value: "entry", label: "Entry Level (0-2 years)" },
      { value: "mid", label: "Mid Level (2-5 years)" },
      { value: "senior", label: "Senior Level (5+ years)" },
    ],
  },
  domain: {
    name: "domain",
    label: "Domain",
    placeholder: "Select Domain",
    validation: z.string({
      required_error: "Please select a domain.",
    }),
    options: [
      { value: "web", label: "Web Development" },
      { value: "mobile", label: "Mobile Development" },
      { value: "cloud", label: "Cloud Computing" },
      { value: "ai", label: "AI/ML" },
    ],
  },
  language: {
    name: "language",
    label: "Programming Language",
    placeholder: "Select Language",
    validation: z.string({
      required_error: "Please select a programming language.",
    }),
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
    ],
  },
  targetCompany: {
    name: "targetCompany",
    label: "Target Company",
    placeholder: "Select Target Company",
    validation: z.string({
      required_error: "Please select a target company.",
    }),
    options: [
      { value: "google", label: "Google" },
      { value: "microsoft", label: "Microsoft" },
      { value: "amazon", label: "Amazon" },
      { value: "meta", label: "Meta" },
    ],
  },
}

export const formSchema = z.object(
  Object.entries(FORM_FIELDS).reduce((acc, [key, field]) => ({
    ...acc,
    [key]: field.validation,
  }), {})
)