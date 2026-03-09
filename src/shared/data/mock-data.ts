// ============================================================
// Mock Data typées - Données de développement
// ============================================================

import type {
  User, Medecin, Patient, Pharmacien, Admin,
} from '@shared/types/user.types';
import type {
  Notification, Examen, Medicament, PatientSummary, Etablissement,
} from '@shared/types/medical.types';
import type { DashboardCard, MenuConfig, MenuSection } from '@shared/types/common.types';

export const MOCK_USERS: Record<string, User> = {
  medecin: {
    id: 'med_001',
    nom: 'BEGNI',
    prenom: 'Touna',
    email: 'begni.touna@lamesse.com',
    role: 'medecin',
    avatar: 'BT',
    specialite: 'Cardiologie',
    telephone: '+228 91 45 38 82',
    numeroOrdre: 'ORD-12345',
  } as Medecin,
  patient: {
    id: 'pat_001',
    nom: 'BIMA',
    prenom: 'Afi',
    email: 'bima.afi@gmail.com',
    role: 'patient',
    avatar: 'BA',
    age: 35,
    dateNaissance: '1989-05-15',
    groupeSanguin: 'A+',
    numeroSecu: '1 89 05 75 123 456 78',
  } as Patient,
  pharmacien: {
    id: 'pharm_001',
    nom: 'AKOSSIWA',
    prenom: 'Mantoba',
    email: 'akossiwa.montoba@lamesse.com',
    role: 'pharmacien',
    avatar: 'AM',
    pharmacie: 'Pharmacie Centrale',
    adresse: 'B.P 2123 Tokoin, Lomé',
    numeroOrdre: 'PHARM-67890',
  } as Pharmacien,
  admin: {
    id: 'admin_001',
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@lamesse.com',
    role: 'admin',
    avatar: 'AS',
    permissions: 'all',
  } as Admin,
};

// --- Dashboard cards ---

export const DASHBOARD_CARDS: { common: DashboardCard[] } & Partial<Record<string, DashboardCard[]>> = {
  common: [
    { id: 'examens', title: 'Examens médicaux', description: "Créez, planifiez et gérez l'historique de vos examens médicaux.", icon: 'fas fa-file-medical', route: '/examens', color: 'purple', roles: ['medecin', 'patient'] },
  ],
  patient: [
    { id: 'dossier-medical', title: 'Mon dossier médical', description: 'Consultez votre historique médical complet, crypté et sécurisé.', icon: 'fas fa-folder-open', route: '/patient/dossier', color: 'blue', badge: 'Pa' },
    { id: 'etat-sante', title: 'Mon état de santé', description: "Visualisez l'état prédictif de votre santé basé sur vos analyses.", icon: 'fas fa-heartbeat', route: '/patient/etat-sante', color: 'red', badge: 'Pa' },
    { id: 'rendez-vous', title: 'Mes rendez-vous', description: 'Gérez vos consultations et suivis médicaux.', icon: 'fas fa-calendar-check', route: '/patient/rendez-vous', color: 'teal', badge: 'Pa' },
    { id: 'medicaments', title: 'Mes médicaments', description: 'Suivez vos traitements et rappels de prise.', icon: 'fas fa-pills', route: '/patient/medicaments', color: 'green', badge: 'Pa' },
    { id: 'ordonnances', title: 'Mes ordonnances', description: 'Consultez vos prescriptions et générez vos QR codes.', icon: 'fas fa-prescription', route: '/patient/ordonnances', color: 'amber', badge: 'Pa' },
    { id: 'gestion-acces', title: 'Gestion des accès', description: 'Contrôlez qui accède à votre dossier médical.', icon: 'fas fa-shield-alt', route: '/patient/gestion-acces', color: 'indigo', badge: 'Pa' },
    { id: 'disponibilites', title: 'Centres de santé', description: 'Trouvez les établissements de santé disponibles près de vous.', icon: 'fas fa-map-marker-alt', route: '/patient/disponibilites', color: 'orange', badge: 'Pa' },
    { id: 'expert-medical-patient', title: 'Expert Médical IA', description: 'Posez vos questions de santé à notre assistant intelligent.', icon: 'fas fa-robot', route: '/patient/expert-medical', color: 'green', badge: 'Pa' },
    { id: 'appel-video-patient', title: 'Appel vidéo', description: 'Rejoignez vos téléconsultations planifiées avec vos médecins.', icon: 'fas fa-video', route: '/patient/appel-video', color: 'teal', badge: 'Pa' },
  ],
  medecin: [
    { id: 'diagnostic-ia', title: 'Diagnostic IA', description: "Analysez des images médicales avec l'IA pour un diagnostic précis et rapide.", icon: 'fas fa-stethoscope', route: '/medecin/diagnostic-ia', color: 'blue', badge: 'Dr' },
    { id: 'dossiers-patients', title: 'Dossiers patients', description: 'Accédez aux dossiers médicaux de vos patients autorisés.', icon: 'fas fa-user-injured', route: '/medecin/patients', color: 'blue', badge: 'Dr' },
    { id: 'cas-speciaux', title: 'Cas spéciaux', description: "Collaborez avec d'autres experts sur des cas médicaux complexes.", icon: 'fas fa-user-friends', route: '/medecin/cas-speciaux', color: 'purple', badge: 'Dr' },
    { id: 'ordonnances', title: 'Ordonnances QR', description: 'Créez des ordonnances sécurisées avec code QR.', icon: 'fas fa-prescription', route: '/medecin/ordonnances', color: 'green', badge: 'Dr' },
    { id: 'expert-medical-medecin', title: 'Expert Médical IA', description: 'Assistant IA pour vous aider dans vos diagnostics et recherches.', icon: 'fas fa-robot', route: '/medecin/expert-medical', color: 'green', badge: 'Dr' },
    { id: 'appel-video-medecin', title: 'Appel vidéo', description: 'Lancez des téléconsultations avec vos patients autorisés.', icon: 'fas fa-video', route: '/medecin/appel-video', color: 'teal', badge: 'Dr' },
  ],
  pharmacien: [
    { id: 'dechiffrage-ordonnances', title: "Déchiffrage d'ordonnances", description: 'Scannez et déchiffrez les ordonnances QR des patients.', icon: 'fas fa-qrcode', route: '/pharmacien/scan-qr', color: 'blue', badge: 'Ph' },
    { id: 'gestion-pharmacie', title: 'Gestion pharmacie', description: 'Gérez votre stock et la disponibilité des médicaments.', icon: 'fas fa-clinic-medical', route: '/pharmacien/gestion', color: 'green', badge: 'Ph' },
  ],
  admin: [
    { id: 'users', title: 'Utilisateurs', description: 'Gérez tous les utilisateurs de la plateforme.', icon: 'fas fa-users', route: '/admin/users', color: 'blue' },
    { id: 'statistiques', title: 'Statistiques', description: "Consultez les statistiques d'utilisation de la plateforme.", icon: 'fas fa-chart-bar', route: '/admin/statistiques', color: 'purple' },
    { id: 'etablissements', title: 'Établissements', description: 'Gérez les hôpitaux, cliniques et pharmacies.', icon: 'fas fa-hospital', route: '/admin/etablissements', color: 'green' },
  ],
};

// --- Notifications ---

export const NOTIFICATIONS: Notification[] = [
  { id: 'notif_1', type: 'info', title: 'Nouvel examen disponible', message: 'Les résultats de votre examen sont disponibles', date: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false, roles: ['patient'] },
  { id: 'notif_2', type: 'warning', title: 'Rendez-vous à venir', message: 'Vous avez un rendez-vous demain à 14h', date: new Date(Date.now() - 24 * 60 * 60 * 1000), read: false, roles: ['patient', 'medecin'] },
  { id: 'notif_3', type: 'success', title: 'Prescription validée', message: 'Votre ordonnance a été validée par le médecin', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), read: true, roles: ['patient'] },
];

export const JOURNAL_ACHATS_PHARMACIE = [
  {
    id: 'journal_1',
    pharmacie: 'Pharmacie du Centre',
    date: '2024-05-18T16:45:00',
    note: 'Achat validé via QR Code',
    items: ['Amlodipine', 'Aspirine'],
  },
  {
    id: 'journal_2',
    pharmacie: 'Pharmacie de la Mairie',
    date: '2024-05-12T09:12:00',
    note: 'Renouvellement ordonnance',
    items: ['Larmes Artificielles', 'Vitamines'],
  },
  {
    id: 'journal_3',
    pharmacie: 'Pharmacie du Parc',
    date: '2024-05-10T14:20:00',
    note: 'Achat de premiers secours',
    items: ['Pansements', 'Antiseptique'],
  },
  {
    id: 'journal_4',
    pharmacie: 'Pharmacie Centrale',
    date: '2024-04-28T11:30:00',
    note: 'Achat avec ordonnance',
    items: ['Paracétamol', 'Sirop'],
  },
  {
    id: 'journal_5',
    pharmacie: 'Pharmacie Saint-Michel',
    date: '2024-04-15T15:05:00',
    note: 'Achat libre',
    items: ['Somnifères', 'Vitamine D'],
  },
];

// --- Examens ---

export const EXAMENS: Examen[] = [
  { id: 'exam_1', type: 'Radiographie', date: '2024-03-15', status: 'effectue', medecin: 'Dr. Jean Dupont', description: 'Radiographie thoracique de contrôle', resultat: 'Normal', fichiers: ['radio_thorax_001.jpg'] },
  { id: 'exam_2', type: 'Prise de sang', date: '2024-03-10', status: 'effectue', medecin: 'Dr. Marie Laurent', description: 'Bilan sanguin complet', resultat: 'En attente', fichiers: [] },
  { id: 'exam_3', type: 'IRM', date: '2024-04-05', status: 'planifie', medecin: 'Dr. Jean Dupont', description: 'IRM cérébrale', resultat: null, fichiers: [] },
];

// --- Médicaments ---

export const MEDICAMENTS: Medicament[] = [
  { id: 'med_1', nom: 'Doliprane 1000mg', dosage: '1000mg', frequence: '3 fois par jour', duree: '7 jours', debut: '2024-03-01', fin: '2024-03-08', prescripteur: 'Dr. Jean Dupont', instructions: 'À prendre après les repas' },
  { id: 'med_2', nom: 'Amoxicilline 500mg', dosage: '500mg', frequence: '2 fois par jour', duree: '10 jours', debut: '2024-03-05', fin: '2024-03-15', prescripteur: 'Dr. Jean Dupont', instructions: 'Antibiotique - Terminer le traitement complet' },
];

// --- Patients ---

export const PATIENTS: PatientSummary[] = [
  { id: 'pat_001', nom: 'Martin Marie', age: 35, groupeSanguin: 'A+', dernierExamen: '2024-03-15', status: 'Stable', avatar: 'MM' },
  { id: 'pat_002', nom: 'Bernard Pierre', age: 52, groupeSanguin: 'O+', dernierExamen: '2024-03-12', status: 'Suivi requis', avatar: 'BP' },
  { id: 'pat_003', nom: 'Dubois Sophie', age: 28, groupeSanguin: 'B+', dernierExamen: '2024-03-10', status: 'Stable', avatar: 'SD' },
];

// --- Établissements ---

export const ETABLISSEMENTS: Etablissement[] = [
  { id: 'etab_1', nom: 'Hôpital Saint-Louis', type: 'Hôpital', adresse: '1 Avenue Claude Vellefaux, 75010 Paris', telephone: '+33 1 42 49 49 49', services: ['Urgences', 'Cardiologie', 'Neurologie', 'Radiologie'], disponibilite: 'Disponible', coordinates: { lat: 48.8738, lng: 2.3701 } },
  { id: 'etab_2', nom: 'Pharmacie Centrale', type: 'Pharmacie', adresse: '12 Rue de la Santé, 75014 Paris', telephone: '+33 1 45 65 43 21', services: ['Médicaments', 'Garde 24h'], disponibilite: 'Disponible', coordinates: { lat: 48.8345, lng: 2.3387 } },
  { id: 'etab_3', nom: 'Clinique du Parc', type: 'Clinique', adresse: '45 Boulevard de la République, 92100 Boulogne', telephone: '+33 1 46 05 67 89', services: ['Consultations', 'Imagerie', 'Laboratoire'], disponibilite: 'Complet', coordinates: { lat: 48.8350, lng: 2.2399 } },
];

// --- Menu config ---

export const MENU_CONFIG: MenuConfig = {
  medecin: [
    {
      section: 'Général',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
        { id: 'diagnostic', label: 'Diagnostic IA', icon: 'fas fa-stethoscope', badge: 'Dr', route: '/medecin/diagnostic-ia' },
        { id: 'expert', label: 'Expert Médical IA', icon: 'fas fa-robot', badge: 'Dr', route: '/medecin/expert-medical' },
      ],
    },
    {
      section: 'Dossiers & Examens',
      items: [
        { id: 'patients', label: 'Dossiers patients', icon: 'fas fa-user-injured', badge: 'Dr', route: '/medecin/patients' },
        { id: 'special-cases', label: 'Cas spéciaux', icon: 'fas fa-user-friends', badge: 'Dr', route: '/medecin/cas-speciaux' },
        { id: 'examens', label: 'Examens médicaux', icon: 'fas fa-file-medical', route: '/examens' },
      ],
    },
    {
      section: 'Médicaments & Ordonnances',
      items: [
        { id: 'ordonnances', label: 'Ordonnances QR', icon: 'fas fa-prescription', route: '/medecin/ordonnances' },
      ],
    },
    {
      section: 'Santé & Disponibilités',
      items: [
        { id: 'rendez-vous', label: 'Rendez-vous', icon: 'fas fa-calendar-check', badge: 'Dr', route: '/medecin/patients' },
        { id: 'appel-video', label: 'Appel vidéo', icon: 'fas fa-video', badge: 'Dr', route: '/medecin/appel-video' },
      ],
    },
  ],
  patient: [
    {
      section: 'Général',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
        { id: 'expert', label: 'Expert Médical IA', icon: 'fas fa-robot', route: '/patient/expert-medical' },
      ],
    },
    {
      section: 'Dossiers & Examens',
      items: [
        { id: 'dossiers', label: 'Mon dossier médical', icon: 'fas fa-folder-open', badge: 'Pa', route: '/patient/dossier' },
        { id: 'examens', label: 'Mes examens', icon: 'fas fa-file-medical', route: '/examens' },
        { id: 'gestion-acces', label: 'Gestion des accès', icon: 'fas fa-shield-alt', badge: 'Pa', route: '/patient/gestion-acces' },
      ],
    },
    {
      section: 'Médicaments & Ordonnances',
      items: [
        { id: 'medicaments', label: 'Mes médicaments', icon: 'fas fa-pills', badge: 'Pa', route: '/patient/medicaments' },
        { id: 'ordonnances', label: 'Mes ordonnances', icon: 'fas fa-prescription', badge: 'Pa', route: '/patient/ordonnances' },
      ],
    },
    {
      section: 'Santé & Disponibilités',
      items: [
        { id: 'etat', label: 'Mon état de santé', icon: 'fas fa-heartbeat', badge: 'Pa', route: '/patient/etat-sante' },
        { id: 'rendez-vous', label: 'Rendez-vous', icon: 'fas fa-calendar-check', route: '/patient/rendez-vous' },
        { id: 'appel-video', label: 'Appel vidéo', icon: 'fas fa-video', route: '/patient/appel-video' },
        { id: 'disponibilites', label: 'Centres de santé', icon: 'fas fa-map-marker-alt', route: '/patient/disponibilites' },
      ],
    },
  ],
  pharmacien: [
    {
      section: 'Général',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
      ],
    },
    {
      section: 'Médicaments & Ordonnances',
      items: [
        { id: 'ordonnances', label: "Déchiffrage d'ordonnances", icon: 'fas fa-prescription', badge: 'Ph', route: '/pharmacien/scan-qr' },
      ],
    },
    {
      section: 'Gestion',
      items: [
        { id: 'pharmacies', label: 'Gestion pharmacie', icon: 'fas fa-clinic-medical', badge: 'Ph', route: '/pharmacien/gestion' },
        { id: 'stock', label: 'Gestion du stock', icon: 'fas fa-boxes', badge: 'Ph', route: '/pharmacien/stock' },
      ],
    },
  ],
  admin: [
    {
      section: 'Général',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
      ],
    },
    {
      section: 'Administration',
      items: [
        { id: 'users', label: 'Utilisateurs', icon: 'fas fa-users', route: '/admin/users' },
        { id: 'medecins', label: 'Médecins', icon: 'fas fa-user-md', route: '/admin/medecins' },
        { id: 'pharmaciens', label: 'Pharmaciens', icon: 'fas fa-prescription-bottle-alt', route: '/admin/pharmaciens' },
        { id: 'etablissements', label: 'Établissements', icon: 'fas fa-hospital', route: '/admin/etablissements' },
        { id: 'statistiques', label: 'Statistiques', icon: 'fas fa-chart-bar', route: '/admin/statistiques' },
        { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', route: '/admin/settings' },
      ],
    },
  ],
};

// --- Helpers pour le menu ---

export const getMenuForRole = (role: string): MenuSection[] => {
  return MENU_CONFIG[role as keyof MenuConfig] || [];
};

export const hasAccessToRoute = (userRole: string, route: string): boolean => {
  const menu = MENU_CONFIG[userRole as keyof MenuConfig];
  if (!menu) return false;
  for (const section of menu) {
    const hasRoute = section.items.some((item) => item.route === route);
    if (hasRoute) return true;
  }
  return false;
};
