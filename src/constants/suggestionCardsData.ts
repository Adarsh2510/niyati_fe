import {
  EDomain,
  EExperience,
  EInterviewRound,
  EProgrammingLanguage,
  ERole,
  ETargetCompany,
} from '@/constants/interview';
import { TInterviewSuggestionCard } from '@/components/InterviewSummary/SuggestedInterviews';

export const companySpecificInterviews: TInterviewSuggestionCard[] = [
  {
    title: 'Google System Design',
    subTitle: 'Senior Software Engineer',
    textLogo: 'G',
    difficulty: 'Advanced',
    link: '/',
    role: ERole.FULLSTACK,
    targetCompany: ETargetCompany.GOOGLE,
    interviewRound: EInterviewRound.SYSTEM_DESIGN,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.JAVA,
  },
  {
    title: 'Meta Frontend',
    subTitle: 'Frontend Developer',
    textLogo: 'M',
    difficulty: 'Medium',
    link: '/',
    role: ERole.FRONTEND,
    targetCompany: ETargetCompany.FACEBOOK,
    interviewRound: EInterviewRound.TECHNICAL_ROUND_1,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.JS,
  },
  {
    title: 'Amazon Behavioral',
    subTitle: 'Backend Developer',
    textLogo: 'A',
    difficulty: 'Medium',
    link: '/',
    role: ERole.BACKEND,
    targetCompany: ETargetCompany.AMAZON,
    interviewRound: EInterviewRound.BEHAVIORAL,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.JAVA,
  },
];

export const suggestedInterviewsData: TInterviewSuggestionCard[] = [
  {
    title: 'Frontend Developer Interview',
    subTitle: 'Netflix',
    difficulty: 'Intermediate',
    descriptors: [
      {
        title: '60 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'BarChart',
    link: '/',
    role: ERole.FRONTEND,
    targetCompany: ETargetCompany.NETFLIX,
    interviewRound: EInterviewRound.TECHNICAL_ROUND_1,
    language: EProgrammingLanguage.TYPESCRIPT,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
  {
    title: 'System Design Interview',
    subTitle: 'Microsoft',
    difficulty: 'Advanced',
    descriptors: [
      {
        title: '45 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'Layout',
    link: '/',
    role: ERole.FULLSTACK,
    targetCompany: ETargetCompany.MICROSOFT,
    interviewRound: EInterviewRound.SYSTEM_DESIGN,
    language: EProgrammingLanguage.CSHARP,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
  {
    title: 'Technical Round 1 Apple',
    subTitle: 'Apple',
    difficulty: 'Advanced',
    descriptors: [
      {
        title: '90 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'TreePine',
    link: '/',
    role: ERole.FULLSTACK,
    targetCompany: ETargetCompany.APPLE,
    interviewRound: EInterviewRound.TECHNICAL_ROUND_1,
    language: EProgrammingLanguage.JS,
    experience: EExperience.LEAD,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
  {
    title: 'Behavioral Interview',
    subTitle: 'Amazon',
    difficulty: 'Medium',
    descriptors: [
      {
        title: '60 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'TreePine',
    link: '/',
    role: ERole.BACKEND,
    targetCompany: ETargetCompany.AMAZON,
    interviewRound: EInterviewRound.BEHAVIORAL,
    language: EProgrammingLanguage.JAVA,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
];

export const roleInterviewData: TInterviewSuggestionCard[] = [
  {
    title: 'Frontend Developer',
    subTitle: 'Software Engineer',
    descriptors: [
      {
        title: '25 questions',
        iconName: 'Code',
      },
      {
        title: '2 hours',
        iconName: 'Clock',
      },
      {
        title: 'Medium',
        iconName: 'ChartArea',
      },
    ],
    iconName: 'Code',
    link: '/',
    role: ERole.FRONTEND,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.TYPESCRIPT,
    targetCompany: ETargetCompany.GOOGLE,
  },
  {
    title: 'Backend Developer',
    subTitle: 'Software Engineer',
    descriptors: [
      {
        title: '30 questions',
        iconName: 'Code',
      },
      {
        title: '2.5 hours',
        iconName: 'Clock',
      },
      {
        title: 'Medium',
        iconName: 'ChartArea',
      },
    ],
    iconName: 'Code',
    link: '/',
    role: ERole.BACKEND,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.PYTHON,
    targetCompany: ETargetCompany.MICROSOFT,
  },
  {
    title: 'Full Stack Developer',
    subTitle: 'Software Engineer',
    descriptors: [
      {
        title: '40 questions',
        iconName: 'Code',
      },
      {
        title: '3 hours',
        iconName: 'Clock',
      },
      {
        title: 'Advanced',
        iconName: 'ChartArea',
      },
    ],
    iconName: 'Code',
    link: '/',
    role: ERole.FULLSTACK,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.PYTHON,
    targetCompany: ETargetCompany.FACEBOOK,
  },
];
