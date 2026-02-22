import React, { useState } from 'react';

interface UserData {
  id: number;
  nom: string;
  email: string;
  role: string;
  statut: string;
  inscription: string;
}

const Users: React.FC = () => {
  const [users] = useState<UserData[]>([
    { id: 1, nom: 'BIMA Afi', email: 'bima.afi@gmail.com', role: 'patient', statut: 'actif', inscription: '2024-01-15' },
    { id: 2, nom: 'BEGNI Touna', email: 'begni.touna@lamesse.com', role: 'medecin', statut: 'actif', inscription: '2023-11-20' },
    { id: 3, nom: 'AKOSSIWA Mantoba', email: 'akossiwa.montoba@lamesse.com', role: 'pharmacien', statut: 'actif', inscription: '2024-02-10' },
  ]);

  const getRoleBadge = (role: string): string => {
    const badges: Record<string, string> = {
      patient: 'badge-info',
      medecin: 'badge-success',
      pharmacien: 'badge-warning',
      admin: 'badge-danger'
    };
    return badges[role] || 'badge-info';
  };

  return (
    <div className="page-content">
      <div className="content-body" style={{padding: '30px'}}>
        <div className="flex justify-between items-center mb-6">
          <h2>Gestion des utilisateurs</h2>
          <button className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Nouvel utilisateur
          </button>
        </div>

        <div className="content-card-app">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="form-control flex-1"
            />
            <select className="form-control w-48">
              <option>Tous les rôles</option>
              <option>Patients</option>
              <option>Médecins</option>
              <option>Pharmaciens</option>
            </select>
          </div>

          <table className="w-full">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">{user.nom.split(' ').map(n => n[0]).join('')}</div>
                      <span className="font-semibold">{user.nom}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadge(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">Actif</span>
                  </td>
                  <td>{user.inscription}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
