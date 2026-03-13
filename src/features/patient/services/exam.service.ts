import type { Exam } from '../types/exam.types';
import { MOCK_EXAMS, getExamsForPatient } from '@shared/data/mock-data';

export const examService = {
  getExams: async (patientId: string): Promise<Exam[]> => {
    await new Promise((r) => setTimeout(r, 400));
    if (patientId) return getExamsForPatient(patientId);
    return MOCK_EXAMS;
  },

  getExamById: async (id: string): Promise<Exam | undefined> => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_EXAMS.find((e) => e.id === id);
  },
};