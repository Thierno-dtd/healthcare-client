import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { getMenuForRole, MOCK_ALERTS, MOCK_MEASUREMENTS, MOCK_PATIENTS } from '@/data/mocks/mock-data';
import { ROLE_LABELS, getAvatarGradient, getInitials } from '@/core/utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

// ─── Semaine courante (lundi → dimanche) ─────────────────────
function isThisWeek(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const start = new Date(now);
    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return date >= start && date <= end;
}

// Seuils identiques à alert.service.ts
const THRESHOLDS: Record<string, number> = {
    blood_pressure: 160,
    glucose: 7.0,
    heart_rate: 100,
};

// ─── Compte les alertes non lues de la semaine pour un docteur ─
function getWeekUnreadAlertCount(doctorId: string): number {
    // Alertes manuelles (MOCK_ALERTS)
    const manualAlerts = MOCK_ALERTS.filter(a =>
        a.doctorId === doctorId &&
        !a.isRead &&
        !a.isResolved &&
        isThisWeek(a.createdAt)
    );

    // Alertes auto générées depuis MOCK_MEASUREMENTS
    const doctorPatientIds = new Set(
        MOCK_PATIENTS.filter(p => p.doctorId === doctorId).map(p => p.id)
    );
    // Clés déjà couvertes par les alertes manuelles
    const manualKeys = new Set(
        MOCK_ALERTS
            .filter(a => a.doctorId === doctorId)
            .map(a => `${a.patientId}_${a.type}_${a.createdAt.slice(0, 10)}`)
    );

    const autoAlerts = MOCK_MEASUREMENTS.filter(m => {
        if (!doctorPatientIds.has(m.patientId)) return false;
        const threshold = THRESHOLDS[m.type];
        if (!threshold || m.value <= threshold) return false;
        if (!isThisWeek(m.recordedAt)) return false;
        const key = `${m.patientId}_${m.type}_${m.recordedAt.slice(0, 10)}`;
        return !manualKeys.has(key);
    });

    return manualAlerts.length + autoAlerts.length;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuthStore();
    const { collapsedSections, toggleSection } = useUIStore();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const doctorId = user.role === 'doctor' ? 'd_001' : null;
    const weekAlertCount = doctorId ? getWeekUnreadAlertCount(doctorId) : 0;

    const menuSections = getMenuForRole(user.role);

    const handleNavigate = (route: string) => {
        navigate(route);
        onClose();
    };

    const isActive = (route: string): boolean =>
        location.pathname === route || location.pathname.startsWith(route + '/');

    const gradient = getAvatarGradient(user.name);
    const initials = user.avatar ?? getInitials(user.name);

    const getBadgeCount = (itemId: string): number | null => {
        if (itemId === 'alerts') return weekAlertCount > 0 ? weekAlertCount : null;
        return null;
    };

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation">

                <div className="sidebar-header">
                    <div className="app-logo">
                        <i className="fas fa-heartbeat" style={{ color: '#4a9d7c' }} />
                        LAMESSE<span>DAMA</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuSections.map((section, idx) => (
                        <div
                            key={idx}
                            className={`nav-section ${collapsedSections[idx] ? 'collapsed' : ''}`}
                        >
                            <div
                                className="nav-title"
                                onClick={() => toggleSection(idx)}
                                role="button"
                                aria-expanded={!collapsedSections[idx]}
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && toggleSection(idx)}
                            >
                                <span>{section.section}</span>
                                <i className="fas fa-chevron-down toggle-icon" />
                            </div>

                            <div className="nav-links-app">
                                {section.items.map((item) => {
                                    const badgeCount = getBadgeCount(item.id);
                                    return (
                                        <a
                                            key={item.id}
                                            href="#"
                                            className={`nav-link-app ${isActive(item.route) ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavigate(item.route);
                                            }}
                                            aria-current={isActive(item.route) ? 'page' : undefined}
                                        >
                                            <i className={item.icon} />
                                            <span>{item.label}</span>
                                            {badgeCount !== null && (
                                                <span style={{
                                                    marginLeft: 'auto',
                                                    background: '#e63946',
                                                    color: 'white',
                                                    fontSize: 11,
                                                    padding: '2px 8px',
                                                    borderRadius: 12,
                                                    fontWeight: 700,
                                                    minWidth: 20,
                                                    textAlign: 'center',
                                                }}>
                          {badgeCount}
                        </span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div
                            className="user-avatar"
                            style={{
                                background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: 14,
                            }}
                        >
                            {initials}
                        </div>
                        <div className="user-info">
                            <h4 title={user.name}>{user.name}</h4>
                            <p>{ROLE_LABELS[user.role] ?? user.role}</p>
                        </div>
                        <button
                            className="user-menu"
                            onClick={() => logout()}
                            title="Déconnexion"
                            aria-label="Se déconnecter"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: 18,
                                padding: '8px',
                                borderRadius: 6,
                                transition: 'color 0.2s',
                            }}
                        >
                            <i className="fas fa-sign-out-alt" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;