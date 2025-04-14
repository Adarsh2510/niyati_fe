import { z } from 'zod';
import { EDomain, EExperience, EProgrammingLanguage, ERole, ETargetCompany } from './interview';

export const FORM_FIELDS = {
  role: {
    name: 'role',
    label: 'Role',
    placeholder: 'Select Role',
    validation: z.string({
      required_error: 'Please select a role.',
    }),
    options: [
      { value: ERole.BACKEND, label: 'Backend Engineer' },
      { value: ERole.FRONTEND, label: 'Frontend Engineer' },
      { value: ERole.FULLSTACK, label: 'Fullstack Engineer' },
      { value: ERole.DEVOPS, label: 'DevOps Engineer' },
    ],
  },
  experience: {
    name: 'experience',
    label: 'Experience',
    placeholder: 'Select Experience',
    validation: z.string({
      required_error: 'Please select experience level.',
    }),
    options: [
      { value: EExperience.INTERN, label: 'Entry Level (0-2 years)' },
      { value: EExperience.JUNIOR, label: 'Mid Level (2-5 years)' },
      { value: EExperience.SENIOR, label: 'Senior Level (5+ years)' },
      { value: EExperience.LEAD, label: 'Lead Level (10+ years)' },
      { value: EExperience.MANAGER, label: 'Manager Level (15+ years)' },
    ],
  },
  domain: {
    name: 'domain',
    label: 'Domain',
    placeholder: 'Select Domain',
    validation: z.string({
      required_error: 'Please select a domain.',
    }),
    options: [
      { value: EDomain.SOFTWARE_ENGINEER, label: 'Software Engineer' },
      { value: EDomain.DEVOPS_ENGINEER, label: 'DevOps Engineer' },
    ],
  },
  language: {
    name: 'language',
    label: 'Programming Language',
    placeholder: 'Select Language',
    validation: z.string({
      required_error: 'Please select a programming language.',
    }),
    options: [
      { value: EProgrammingLanguage.JS, label: 'JavaScript' },
      { value: EProgrammingLanguage.PYTHON, label: 'Python' },
      { value: EProgrammingLanguage.JAVA, label: 'Java' },
    ],
  },
  targetCompany: {
    name: 'targetCompany',
    label: 'Target Company',
    placeholder: 'Select Target Company',
    validation: z.string({
      required_error: 'Please select a target company.',
    }),
    options: [
      { value: ETargetCompany.GOOGLE, label: 'Google' },
      { value: ETargetCompany.MICROSOFT, label: 'Microsoft' },
      { value: ETargetCompany.FACEBOOK, label: 'Facebook' },
    ],
  },
};

export const formSchema = z.object({
  role: z.string(),
  experience: z.string(),
  domain: z.string(),
  language: z.string(),
  targetCompany: z.string(),
});
