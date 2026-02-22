import React, { useState } from 'react';

interface SettingsState {
  // Paramètres généraux
  appName: string;
  appDescription: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;

  // Paramètres de sécurité
  passwordMinLength: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
  ipWhitelist: string;

  // Paramètres des notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notifyAdminOnNewUser: boolean;
  notifyAdminOnError: boolean;

  // Paramètres d'upload
  maxFileSize: number;
  allowedFileTypes: string;

  // Paramètres IA
  diagnosticAIEnabled: boolean;
  chatbotEnabled: boolean;
  imageAnalysisEnabled: boolean;

  // Paramètres de sauvegarde
  autoBackup: boolean;
  backupFrequency: string;
  backupRetention: number;
}

type SettingsTab = 'general' | 'security' | 'notifications' | 'uploads' | 'ai' | 'backup' | 'maintenance';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [settings, setSettings] = useState<SettingsState>({
        // Paramètres généraux
        appName: 'LAMESSE DAMA',
        appDescription: 'Plateforme de santé intelligente',
        supportEmail: 'support@lamessedama.tg',
        supportPhone: '+228 91 45 48 82',
        maintenanceMode: false,

        // Paramètres de sécurité
        passwordMinLength: 8,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        twoFactorAuth: false,
        ipWhitelist: '',

        // Paramètres des notifications
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notifyAdminOnNewUser: true,
        notifyAdminOnError: true,

        // Paramètres d'upload
        maxFileSize: 10,
        allowedFileTypes: 'jpg,png,pdf,dicom',

        // Paramètres IA
        diagnosticAIEnabled: true,
        chatbotEnabled: true,
        imageAnalysisEnabled: true,

        // Paramètres de sauvegarde
        autoBackup: true,
        backupFrequency: 'daily',
        backupRetention: 30
    });

    const [saved, setSaved] = useState<boolean>(false);

    const handleChange = (field: keyof SettingsState, value: string | number | boolean) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
        setSaved(false);
    };

    const handleSave = () => {
        // Simuler la sauvegarde
        console.log('Paramètres sauvegardés:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
            setSettings({
                appName: 'LAMESSE DAMA',
                appDescription: 'Plateforme de santé intelligente',
                supportEmail: 'support@lamessedama.tg',
                supportPhone: '+228 91 45 48 82',
                maintenanceMode: false,
                passwordMinLength: 8,
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                twoFactorAuth: false,
                ipWhitelist: '',
                emailNotifications: true,
                smsNotifications: false,
                pushNotifications: true,
                notifyAdminOnNewUser: true,
                notifyAdminOnError: true,
                maxFileSize: 10,
                allowedFileTypes: 'jpg,png,pdf,dicom',
                diagnosticAIEnabled: true,
                chatbotEnabled: true,
                imageAnalysisEnabled: true,
                autoBackup: true,
                backupFrequency: 'daily',
                backupRetention: 30
            });
        }
    };

    const handleTestEmail = () => {
        alert('Email de test envoyé à ' + settings.supportEmail);
    };

    const handleBackupNow = () => {
        alert('Sauvegarde en cours...');
    };

    const handleClearCache = () => {
        if (window.confirm('Êtes-vous sûr de vouloir vider le cache système ?')) {
            alert('Cache système vidé avec succès');
        }
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(99, 102, 241, 0.8), rgba(99, 102, 241, 0.9)), url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Paramètres Système</h1>
                        <p>Configurez et gérez les paramètres de la plateforme</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Alert de sauvegarde */}
                {saved && (
                    <div className="alert alert-success mb-6 animate-fade-in">
                        <i className="fas fa-check-circle"></i>
                        <span>Paramètres enregistrés avec succès</span>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar avec tabs */}
                    <div className="col-span-3">
                        <div className="content-card-app sticky top-4">
                            <nav className="space-y-2">
                                <button
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        activeTab === 'general' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveTab('general')}
                                >
                                    <i className="fas fa-cog mr-3"></i>
                                    Général
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        activeTab === 'security' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveTab('security')}
                                >
                                    <i className="fas fa-shield-alt mr-3"></i>
                                    Sécurité
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveTab('notifications')}
                                >
                                    <i className="fas fa-bell mr-3"></i>
                                    Notifications
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        activeTab === 'uploads' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveTab('uploads')}
                                >
                                    <i className="fas fa-upload mr-3"></i>
                                    Uploads
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        activeTab === 'ai' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveTab('ai')}
                                >
                                    <i className="fas fa-robot mr-3"></i>
                                    Intelligence Artificielle
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        activeTab === 'backup' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveTab('backup')}
                                >
                                    <i className="fas fa-database mr-3"></i>
                                    Sauvegarde
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        activeTab === 'maintenance' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveTab('maintenance')}
                                >
                                    <i className="fas fa-wrench mr-3"></i>
                                    Maintenance
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Contenu des tabs */}
                    <div className="col-span-9">
                        <div className="content-card-app">
                            {/* Général */}
                            {activeTab === 'general' && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">Paramètres généraux</h3>

                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label>Nom de l'application</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={settings.appName}
                                                onChange={(e) => handleChange('appName', e.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={settings.appDescription}
                                                onChange={(e) => handleChange('appDescription', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-group">
                                                <label>Email de support</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={settings.supportEmail}
                                                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Téléphone de support</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={settings.supportPhone}
                                                    onChange={(e) => handleChange('supportPhone', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.maintenanceMode}
                                                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                                />
                                                <span>Mode maintenance</span>
                                            </label>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Active le mode maintenance pour effectuer des opérations de maintenance
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sécurité */}
                            {activeTab === 'security' && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">Paramètres de sécurité</h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-group">
                                                <label>Longueur minimale du mot de passe</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={settings.passwordMinLength}
                                                    onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
                                                    min={6}
                                                    max={20}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Timeout de session (minutes)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={settings.sessionTimeout}
                                                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                                                    min={5}
                                                    max={120}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Tentatives de connexion max</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={settings.maxLoginAttempts}
                                                    onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                                                    min={3}
                                                    max={10}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.twoFactorAuth}
                                                    onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                                                />
                                                <span>Authentification à deux facteurs</span>
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label>Liste blanche d'adresses IP (une par ligne)</label>
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                value={settings.ipWhitelist}
                                                onChange={(e) => handleChange('ipWhitelist', e.target.value)}
                                                placeholder={"192.168.1.1\n192.168.1.2"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications */}
                            {activeTab === 'notifications' && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">Paramètres des notifications</h3>

                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-semibold">Notifications par email</div>
                                                    <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="toggle-switch"
                                                    checked={settings.emailNotifications}
                                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                                />
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-semibold">Notifications SMS</div>
                                                    <p className="text-sm text-gray-600">Recevoir des notifications par SMS</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="toggle-switch"
                                                    checked={settings.smsNotifications}
                                                    onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                                />
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-semibold">Notifications push</div>
                                                    <p className="text-sm text-gray-600">Recevoir des notifications push</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="toggle-switch"
                                                    checked={settings.pushNotifications}
                                                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                                                />
                                            </label>
                                        </div>

                                        <hr className="my-6" />

                                        <div className="form-group">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.notifyAdminOnNewUser}
                                                    onChange={(e) => handleChange('notifyAdminOnNewUser', e.target.checked)}
                                                />
                                                <span>Notifier l'admin lors d'une nouvelle inscription</span>
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.notifyAdminOnError}
                                                    onChange={(e) => handleChange('notifyAdminOnError', e.target.checked)}
                                                />
                                                <span>Notifier l'admin en cas d'erreur système</span>
                                            </label>
                                        </div>

                                        <button className="btn btn-outline" onClick={handleTestEmail}>
                                            <i className="fas fa-envelope"></i> Envoyer un email de test
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Uploads */}
                            {activeTab === 'uploads' && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">Paramètres d'upload</h3>

                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label>Taille maximale des fichiers (Mo)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={settings.maxFileSize}
                                                onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value))}
                                                min={1}
                                                max={100}
                                            />
                                            <p className="text-sm text-gray-600 mt-2">
                                                Limite actuelle: {settings.maxFileSize} Mo
                                            </p>
                                        </div>

                                        <div className="form-group">
                                            <label>Types de fichiers autorisés</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={settings.allowedFileTypes}
                                                onChange={(e) => handleChange('allowedFileTypes', e.target.value)}
                                                placeholder="jpg,png,pdf,dicom"
                                            />
                                            <p className="text-sm text-gray-600 mt-2">
                                                Séparez les extensions par des virgules
                                            </p>
                                        </div>

                                        <div className="alert alert-info">
                                            <i className="fas fa-info-circle"></i>
                                            <span>Les fichiers uploadés sont automatiquement scannés pour les virus et malwares</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* IA */}
                            {activeTab === 'ai' && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">Intelligence Artificielle</h3>

                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-semibold">Diagnostic IA</div>
                                                    <p className="text-sm text-gray-600">Activer l'analyse d'images médicales par IA</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="toggle-switch"
                                                    checked={settings.diagnosticAIEnabled}
                                                    onChange={(e) => handleChange('diagnosticAIEnabled', e.target.checked)}
                                                />
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-semibold">Chatbot médical</div>
                                                    <p className="text-sm text-gray-600">Activer l'assistant conversationnel IA</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="toggle-switch"
                                                    checked={settings.chatbotEnabled}
                                                    onChange={(e) => handleChange('chatbotEnabled', e.target.checked)}
                                                />
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-semibold">Analyse d'images</div>
                                                    <p className="text-sm text-gray-600">Activer l'analyse automatique des images médicales</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="toggle-switch"
                                                    checked={settings.imageAnalysisEnabled}
                                                    onChange={(e) => handleChange('imageAnalysisEnabled', e.target.checked)}
                                                />
                                            </label>
                                        </div>

                                        <div className="alert alert-warning">
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>Les fonctionnalités IA nécessitent une connexion active au serveur d'IA</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sauvegarde */}
                            {activeTab === 'backup' && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">Paramètres de sauvegarde</h3>

                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.autoBackup}
                                                    onChange={(e) => handleChange('autoBackup', e.target.checked)}
                                                />
                                                <span>Sauvegarde automatique</span>
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label>Fréquence de sauvegarde</label>
                                            <select
                                                className="form-control"
                                                value={settings.backupFrequency}
                                                onChange={(e) => handleChange('backupFrequency', e.target.value)}
                                                disabled={!settings.autoBackup}
                                            >
                                                <option value="hourly">Toutes les heures</option>
                                                <option value="daily">Quotidienne</option>
                                                <option value="weekly">Hebdomadaire</option>
                                                <option value="monthly">Mensuelle</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Durée de rétention (jours)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={settings.backupRetention}
                                                onChange={(e) => handleChange('backupRetention', parseInt(e.target.value))}
                                                min={7}
                                                max={365}
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button className="btn btn-primary" onClick={handleBackupNow}>
                                                <i className="fas fa-database"></i> Sauvegarder maintenant
                                            </button>
                                            <button className="btn btn-outline">
                                                <i className="fas fa-download"></i> Télécharger la dernière sauvegarde
                                            </button>
                                        </div>

                                        <div className="alert alert-info">
                                            <i className="fas fa-info-circle"></i>
                                            <div>
                                                <strong>Dernière sauvegarde:</strong> 15 Mars 2024 à 03:00
                                                <br />
                                                <strong>Taille:</strong> 2.4 Go
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Maintenance */}
                            {activeTab === 'maintenance' && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">Maintenance système</h3>

                                    <div className="space-y-4">
                                        <div className="content-card-app bg-yellow-50 border-yellow-200">
                                            <h4 className="font-semibold mb-2">
                                                <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                                                Actions de maintenance
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Ces actions peuvent affecter le fonctionnement de la plateforme
                                            </p>

                                            <div className="space-y-3">
                                                <button className="btn btn-outline w-full" onClick={handleClearCache}>
                                                    <i className="fas fa-broom"></i> Vider le cache système
                                                </button>
                                                <button className="btn btn-outline w-full">
                                                    <i className="fas fa-sync"></i> Reindexer la base de données
                                                </button>
                                                <button className="btn btn-outline w-full">
                                                    <i className="fas fa-file-export"></i> Exporter les logs système
                                                </button>
                                                <button className="btn btn-danger w-full">
                                                    <i className="fas fa-power-off"></i> Redémarrer le serveur
                                                </button>
                                            </div>
                                        </div>

                                        <div className="info-card">
                                            <h4>Informations système</h4>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Version</p>
                                                    <p className="font-semibold">1.0.0</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Uptime</p>
                                                    <p className="font-semibold">15 jours 4h 32min</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Espace disque</p>
                                                    <p className="font-semibold">45.2 Go / 100 Go</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Mémoire utilisée</p>
                                                    <p className="font-semibold">2.8 Go / 8 Go</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Boutons de sauvegarde */}
                        <div className="flex gap-3 mt-6">
                            <button className="btn btn-primary" onClick={handleSave}>
                                <i className="fas fa-save"></i> Enregistrer les modifications
                            </button>
                            <button className="btn btn-outline" onClick={handleReset}>
                                <i className="fas fa-undo"></i> Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
