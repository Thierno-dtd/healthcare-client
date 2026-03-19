import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface SettingToggle {
    id: string;
    label: string;
    description: string;
    icon: string;
    defaultValue: boolean;
}

const SETTINGS: SettingToggle[] = [
    { id: 'email_alerts', label: 'Alertes par email', description: 'Recevoir les alertes critiques par email', icon: 'fas fa-envelope', defaultValue: true },
    { id: 'push_notif', label: 'Notifications push', description: 'Activer les notifications navigateur', icon: 'fas fa-bell', defaultValue: true },
    { id: 'sound', label: 'Sons de notification', description: 'Jouer un son lors des alertes', icon: 'fas fa-volume-up', defaultValue: false },
    { id: 'auto_refresh', label: 'Actualisation auto', description: 'Actualiser les données toutes les 60 secondes', icon: 'fas fa-sync', defaultValue: true },
    { id: 'dark_mode', label: 'Mode sombre', description: 'Interface sombre (bêta)', icon: 'fas fa-moon', defaultValue: false },
];

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<Record<string, boolean>>(
        Object.fromEntries(SETTINGS.map((s) => [s.id, s.defaultValue]))
    );
    const [alertThreshold, setAlertThreshold] = useState(160);
    const [glucoseThreshold, setGlucoseThreshold] = useState(7.0);

    const handleToggle = (id: string) => {
        setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSaveThresholds = () => {
        toast.success('Seuils d\'alerte mis à jour');
    };

    return (
        <div className="content-body">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                    Paramètres
                </h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Configurez votre expérience et vos préférences
                </p>
            </div>

            <div style={{ display: 'grid', gap: 24 }}>
                {/* ── Notifications & Preferences ─────────────────── */}
                <div className="card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
                        <i className="fas fa-sliders-h" style={{ marginRight: 10, color: '#6b7280' }} />
                        Préférences générales
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {SETTINGS.map((setting) => (
                            <div
                                key={setting.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f3f4f6',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: settings[setting.id] ? '#dbeafe' : '#f3f4f6',
                                        color: settings[setting.id] ? '#2563eb' : '#9ca3af',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 16,
                                        transition: 'all 0.2s',
                                    }}>
                                        <i className={setting.icon} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                                            {setting.label}
                                        </p>
                                        <p style={{ fontSize: 12, color: '#9ca3af' }}>{setting.description}</p>
                                    </div>
                                </div>

                                {/* Toggle */}
                                <label className="toggle-switch" style={{ flexShrink: 0 }}>
                                    <input
                                        type="checkbox"
                                        checked={settings[setting.id]}
                                        onChange={() => handleToggle(setting.id)}
                                    />
                                    <span className="toggle-slider" />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Alert Thresholds ─────────────────────────────── */}
                <div className="card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: 10, color: '#d97706' }} />
                        Seuils d'alerte
                    </h3>
                    <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
                        Définissez les valeurs au-delà desquelles une alerte sera déclenchée
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                        {[
                            {
                                label: 'Tension artérielle',
                                icon: 'fas fa-tachometer-alt',
                                unit: 'mmHg',
                                value: alertThreshold,
                                onChange: setAlertThreshold,
                                min: 120,
                                max: 200,
                                color: '#dc2626',
                            },
                            {
                                label: 'Glycémie',
                                icon: 'fas fa-tint',
                                unit: 'mmol/L',
                                value: glucoseThreshold,
                                onChange: setGlucoseThreshold,
                                min: 5,
                                max: 15,
                                step: 0.5,
                                color: '#7c3aed',
                            },
                        ].map(({ label, icon, unit, value, onChange, min, max, step = 1, color }) => (
                            <div
                                key={label}
                                style={{
                                    padding: 20,
                                    background: '#f9fafb',
                                    borderRadius: 12,
                                    border: '1px solid #f3f4f6',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <i className={icon} style={{ color, fontSize: 16 }} />
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <input
                                        type="range"
                                        min={min}
                                        max={max}
                                        step={step}
                                        value={value}
                                        onChange={(e) => onChange(Number(e.target.value))}
                                        style={{ flex: 1, accentColor: color }}
                                    />
                                    <span style={{
                                        padding: '4px 10px',
                                        background: `${color}20`,
                                        color,
                                        borderRadius: 8,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        minWidth: 80,
                                        textAlign: 'center',
                                    }}>
                    {value} {unit}
                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                                    <span>{min} {unit}</span>
                                    <span>{max} {unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={handleSaveThresholds}>
                            <i className="fas fa-save" style={{ marginRight: 8 }} />
                            Sauvegarder les seuils
                        </button>
                    </div>
                </div>

                {/* ── Danger zone ──────────────────────────────────── */}
                <div className="card" style={{ padding: 28, borderColor: '#fecaca' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>
                        <i className="fas fa-exclamation-circle" style={{ marginRight: 10 }} />
                        Zone dangereuse
                    </h3>
                    <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                        Ces actions sont irréversibles. Procédez avec précaution.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            className="btn btn-sm"
                            style={{ background: 'transparent', color: '#dc2626', border: '1px solid #fecaca' }}
                            onClick={() => toast.error('Fonctionnalité non disponible en mode démo')}
                        >
                            <i className="fas fa-trash" style={{ marginRight: 6 }} />
                            Vider le cache
                        </button>
                        <button
                            className="btn btn-sm"
                            style={{ background: 'transparent', color: '#dc2626', border: '1px solid #fecaca' }}
                            onClick={() => toast.error('Fonctionnalité non disponible en mode démo')}
                        >
                            <i className="fas fa-user-times" style={{ marginRight: 6 }} />
                            Supprimer le compte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;