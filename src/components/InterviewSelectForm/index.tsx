'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FORM_FIELDS, formSchema } from '@/constants/startInterviewForm';
import { TInterviewSelectFormProps } from './types';
import { ArrowRight } from 'lucide-react';
import { Loader } from '@/components/common/loader';
import { initialzeInterviewForm } from './util';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EDomain } from '@/constants/interview';
import { useSession } from 'next-auth/react';

type FormValues = {
  role: string;
  experience: string;
  domain: string;
  language: string;
  targetCompany: string;
  interviewRound: string;
};

export default function StartInterviewForm(props: TInterviewSelectFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: EDomain.SOFTWARE_ENGINEER,
      role: props.role || '',
      experience: props.experience || '',
      language: props.language || '',
      targetCompany: props.targetCompany || '',
      interviewRound: props.interviewRound || '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  async function onSubmit(values: FormValues) {
    const { role, experience, domain, language, targetCompany, interviewRound } = values;
    setIsLoading(true);
    try {
      const data = await initialzeInterviewForm({
        user_id: session!.user.id,
        role,
        experience,
        domain,
        programmingLanguage: language,
        targetCompany,
        interviewRound,
      });
      if (!data.interview_id) {
        toast.error('Failed to create interview session');
        return;
      }
      router.push(`dashboard/interview-room/${data.interview_id}`);
    } catch (error) {
      console.error('Interview initialization error:', error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredFormFields = Object.entries(FORM_FIELDS).filter(([key]) => key !== 'domain'); // TODO: Re-access this after more options are added

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {filteredFormFields.map(([key, field]) => (
          <FormField
            key={key}
            control={form.control}
            name={field.name as keyof FormValues}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={
                    formField.value || props[key as keyof TInterviewSelectFormProps] || ''
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? (
            <>
              <span className="mr-2">Preparing your interview, can take up to 2 minutes...</span>
              <Loader />
            </>
          ) : (
            <>
              Start Interview <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
