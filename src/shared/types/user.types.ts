// ============================================================
// Types utilisateur - Fondation du système de rôles
// ============================================================

export type UserRole = 'medecin' | 'patient' | 'pharmacien' | 'admin';

/** Propriétés communes à tous les utilisateurs */
export interface BaseUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  avatar: string;
  displayName?: string;
  loginTime?: string;
}

/** Médecin */
export interface Medecin extends BaseUser {
  role: 'medecin';
  specialite: string;
  telephone: string;
  numeroOrdre: string;
}

/** Patient */
export interface Patient extends BaseUser {
  role: 'patient';
  age: number;
  dateNaissance: string;
  groupeSanguin: GroupeSanguin;
  numeroSecu: string;
}

/** Pharmacien */
export interface Pharmacien extends BaseUser {
  role: 'pharmacien';
  pharmacie: string;
  adresse: string;
  numeroOrdre: string;
}

/** Admin */
export interface Admin extends BaseUser {
  role: 'admin';
  permissions: string;
}

/** Union discriminée de tous les types utilisateur */
export type User = Medecin | Patient | Pharmacien | Admin;

/** Groupes sanguins */
export type GroupeSanguin = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

/** Credentials de connexion */
export interface LoginCredentials {
  identifier: string;
  password: string;
}

/** Réponse de l'authentification */
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}
