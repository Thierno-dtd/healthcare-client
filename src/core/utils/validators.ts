/** Email validation */
export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Phone validation (French format, flexible) */
export const isValidPhone = (phone: string): boolean =>
    /^(\+33|0)[0-9]{9}$/.test(phone.replace(/\s/g, ''));

/** Non-empty string */
export const isRequired = (value: string): boolean =>
    value.trim().length > 0;

/** Min length */
export const minLength = (value: string, min: number): boolean =>
    value.trim().length >= min;

/** Max length */
export const maxLength = (value: string, max: number): boolean =>
    value.trim().length <= max;

/** Password strength: at least 8 chars */
export const isValidPassword = (password: string): boolean =>
    password.length >= 8;

/** Date in ISO format or parseable string */
export const isValidDate = (date: string): boolean =>
    !isNaN(new Date(date).getTime());

/** Numeric range */
export const inRange = (value: number, min: number, max: number): boolean =>
    value >= min && value <= max;

// ─── Validation result type ───────────────────────────────────
export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

// ─── Login form validator ─────────────────────────────────────
export function validateLoginForm(email: string, password: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(email)) {
        errors.email = "L'identifiant est requis";
    } else if (!isValidEmail(email)) {
        errors.email = "Format d'email invalide";
    }

    if (!isRequired(password)) {
        errors.password = 'Le mot de passe est requis';
    } else if (!isValidPassword(password)) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Patient form validator ───────────────────────────────────
export function validatePatientForm(data: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
}): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(data.name)) errors.name = 'Le nom est requis';
    if (!isRequired(data.email)) {
        errors.email = "L'email est requis";
    } else if (!isValidEmail(data.email)) {
        errors.email = "Format d'email invalide";
    }
    if (data.phone && !isValidPhone(data.phone)) {
        errors.phone = 'Numéro de téléphone invalide';
    }
    if (!isRequired(data.dateOfBirth)) {
        errors.dateOfBirth = 'La date de naissance est requise';
    } else if (!isValidDate(data.dateOfBirth)) {
        errors.dateOfBirth = 'Date invalide';
    }

    return { valid: Object.keys(errors).length === 0, errors };
}