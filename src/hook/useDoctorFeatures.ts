import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionService } from '@/services/prescription.service';
import { measurementService } from '@/services/measurement.service';
import {RequestStatus} from "@/data/models/patienRequest.model.ts";
import {patientRequestService} from "@/services/patientrequest.service.ts";
import {doctorNotificationService} from "@/services/doctornotification.service.ts";

// ─── Patient Requests ─────────────────────────────────────────
export const REQUEST_KEYS = {
    all: ['requests'] as const,
    list: (doctorId: string, status?: RequestStatus) => ['requests', 'list', doctorId, status] as const,
    pending: (doctorId: string) => ['requests', 'pending', doctorId] as const,
};

export function usePatientRequests(doctorId: string, status?: RequestStatus) {
    return useQuery({
        queryKey: REQUEST_KEYS.list(doctorId, status),
        queryFn: () => patientRequestService.getRequests(doctorId, status),
        enabled: !!doctorId,
        staleTime: 30 * 1000,
    });
}

export function usePendingRequestCount(doctorId: string) {
    return useQuery({
        queryKey: REQUEST_KEYS.pending(doctorId),
        queryFn: () => patientRequestService.getPendingCount(doctorId),
        enabled: !!doctorId,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useApproveRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => patientRequestService.approveRequest(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: REQUEST_KEYS.all }),
    });
}

export function useRejectRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) =>
            patientRequestService.rejectRequest(id, message),
        onSuccess: () => qc.invalidateQueries({ queryKey: REQUEST_KEYS.all }),
    });
}

// ─── Prescriptions ────────────────────────────────────────────
export const PRESC_KEYS = {
    all: ['prescriptions'] as const,
    list: (patientId: string) => ['prescriptions', 'list', patientId] as const,
    detail: (id: string) => ['prescriptions', 'detail', id] as const,
    intakes: (medicationId: string) => ['prescriptions', 'intakes', medicationId] as const,
    patientIntakes: (patientId: string) => ['prescriptions', 'patient-intakes', patientId] as const,
    adherence: (patientId: string) => ['prescriptions', 'adherence', patientId] as const,
};

export function usePrescriptions(patientId: string) {
    return useQuery({
        queryKey: PRESC_KEYS.list(patientId),
        queryFn: () => prescriptionService.getPrescriptions(patientId),
        enabled: !!patientId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useIntakeHistory(medicationId: string) {
    return useQuery({
        queryKey: PRESC_KEYS.intakes(medicationId),
        queryFn: () => prescriptionService.getIntakeHistory(medicationId),
        enabled: !!medicationId,
        staleTime: 2 * 60 * 1000,
    });
}

export function usePatientIntakes(patientId: string, days = 7) {
    return useQuery({
        queryKey: [...PRESC_KEYS.patientIntakes(patientId), days],
        queryFn: () => prescriptionService.getPatientIntakes(patientId, days),
        enabled: !!patientId,
        staleTime: 60 * 1000,
    });
}

export function useMedicationAdherence(patientId: string) {
    return useQuery({
        queryKey: PRESC_KEYS.adherence(patientId),
        queryFn: () => prescriptionService.getMedicationAdherence(patientId),
        enabled: !!patientId,
        staleTime: 2 * 60 * 1000,
    });
}

// ─── Measurements ─────────────────────────────────────────────
export const MEASURE_KEYS = {
    all: ['measurements'] as const,
    list: (patientId: string, days?: number) => ['measurements', 'list', patientId, days] as const,
    recent: (patientId: string) => ['measurements', 'recent', patientId] as const,
    frequency: (patientId: string) => ['measurements', 'frequency', patientId] as const,
    compliance: (patientId: string, weekOffset?: number) => ['measurements', 'compliance', patientId, weekOffset] as const,
    doctorCompliance: (doctorId: string) => ['measurements', 'doctor-compliance', doctorId] as const,
    trend: (patientId: string) => ['measurements', 'trend', patientId] as const,
};

export function useMeasurements(patientId: string, days = 14) {
    return useQuery({
        queryKey: MEASURE_KEYS.list(patientId, days),
        queryFn: () => measurementService.getMeasurements(patientId, days),
        enabled: !!patientId,
        staleTime: 60 * 1000,
    });
}

export function useRecentMeasurements(patientId: string, limit = 10) {
    return useQuery({
        queryKey: MEASURE_KEYS.recent(patientId),
        queryFn: () => measurementService.getRecentMeasurements(patientId, limit),
        enabled: !!patientId,
        staleTime: 60 * 1000,
    });
}

export function useMeasurementFrequency(patientId: string) {
    return useQuery({
        queryKey: MEASURE_KEYS.frequency(patientId),
        queryFn: () => measurementService.getFrequency(patientId),
        enabled: !!patientId,
    });
}

export function useSetFrequency() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ patientId, doctorId, timesPerWeek }: { patientId: string; doctorId: string; timesPerWeek: number }) =>
            measurementService.setFrequency(patientId, doctorId, timesPerWeek),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: MEASURE_KEYS.frequency(vars.patientId) });
            qc.invalidateQueries({ queryKey: MEASURE_KEYS.doctorCompliance(vars.doctorId) });
        },
    });
}

export function useWeeklyCompliance(patientId: string, weekOffset = 0) {
    return useQuery({
        queryKey: MEASURE_KEYS.compliance(patientId, weekOffset),
        queryFn: () => measurementService.getWeeklyCompliance(patientId, weekOffset),
        enabled: !!patientId,
        staleTime: 2 * 60 * 1000,
    });
}

export function useDoctorPatientCompliance(doctorId: string) {
    return useQuery({
        queryKey: MEASURE_KEYS.doctorCompliance(doctorId),
        queryFn: () => measurementService.getDoctorPatientCompliance(doctorId),
        enabled: !!doctorId,
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });
}

export function useMeasurementTrend(patientId: string) {
    return useQuery({
        queryKey: MEASURE_KEYS.trend(patientId),
        queryFn: () => measurementService.getWeeklyTrend(patientId),
        enabled: !!patientId,
        staleTime: 5 * 60 * 1000,
    });
}

// ─── Doctor Notifications (to patients) ──────────────────────
export const DOCTOR_NOTIF_KEYS = {
    all: ['doctor-notifs'] as const,
    sent: (doctorId: string) => ['doctor-notifs', 'sent', doctorId] as const,
};

export function useSendMessageToPatient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ doctorId, patientId, patientName, message }: {
            doctorId: string; patientId: string; patientName: string; message: string;
        }) => doctorNotificationService.sendToPatient(doctorId, patientId, patientName, message),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: DOCTOR_NOTIF_KEYS.sent(vars.doctorId) });
        },
    });
}