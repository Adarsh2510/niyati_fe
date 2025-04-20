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
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: FormValues) {
    const { role, experience, domain, language, targetCompany, interviewRound } = values;
    setIsLoading(true);
    try {
      const data = await initialzeInterviewForm({
        user_id: 'test_user_id',
        role,
        experience,
        domain,
        programmingLanguage: language,
        targetCompany,
        interviewRound,
      });
      if (!data.interview_id) {
        toast('Something went wrong, please try again');
      }
      console.log('data.interview_room_id', data.interview_id);
      router.push(`dashboard/interview-room/${data.interview_id}`);
    } catch (error) {
      console.error(error);
      toast('Something went wrong, please try again');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {Object.entries(FORM_FIELDS).map(([key, field]) => (
          <FormField
            key={key}
            control={form.control}
            name={field.name as keyof FormValues}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          props[key as keyof TInterviewSelectFormProps] || field.placeholder
                        }
                      />
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
              <span className="mr-2">Please wait while we prepare your interview</span>
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
