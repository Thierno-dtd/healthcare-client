import { useQuery } from '@tanstack/react-query';
import type { Exam } from '../types/exam.types';
import { examService } from '../services/exam.service';

export const examKeys = {
  all: ['exams'] as const,
  list: (patientId: string) => [...examKeys.all, 'list', patientId] as const,
  detail: (id: string) => [...examKeys.all, 'detail', id] as const,
};

export const useExams = (patientId: string | undefined) => {
  return useQuery<Exam[]>({
    queryKey: examKeys.list(patientId ?? ''),
    queryFn: () => examService.getExams(patientId!),
    enabled: !!patientId,
  });
};

export const useExamDetail = (id: string | undefined) => {
  return useQuery<Exam | undefined>({
    queryKey: examKeys.detail(id ?? ''),
    queryFn: () => examService.getExamById(id!),
    enabled: !!id,
  });
};