import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  Printer,
  Save,
  Stethoscope
} from "lucide-react";

interface MedicamentForm {
  nom: string;
  dosage: string;
  forme: string;
  posologie: string;
  duree: string;
  quantite: string;
}

interface AnalyseForm {
  type: string;
  urgence: string;
  instructions: string;
}

const NouvelleConsultation: React.FC = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [showOrdonnance, setShowOrdonnance] = useState(false);
  const [showAnalyses, setShowAnalyses] = useState(false);
  const [hospitaliser, setHospitaliser] = useState(false);

  const [medicaments, setMedicaments] = useState<MedicamentForm[]>([
    { nom: "", dosage: "", forme: "Comprimé", posologie: "", duree: "", quantite: "" }
  ]);

  const [demandedAnalyses, setDemandedAnalyses] = useState<AnalyseForm[]>([
    { type: "", urgence: "Normal", instructions: "" }
  ]);

  const addMedicament = () =>
    setMedicaments([
      ...medicaments,
      { nom: "", dosage: "", forme: "Comprimé", posologie: "", duree: "", quantite: "" }
    ]);

  const removeMedicament = (i: number) =>
    setMedicaments(medicaments.filter((_, idx) => idx !== i));

  const addAnalyse = () =>
    setDemandedAnalyses([
      ...demandedAnalyses,
      { type: "", urgence: "Normal", instructions: "" }
    ]);

  const removeAnalyse = (i: number) =>
    setDemandedAnalyses(demandedAnalyses.filter((_, idx) => idx !== i));

  return (
    
      <div className="page-content">
        {/* HEADER */}
      <div className="content-header-app">
        <div
          className="header-image bg-gradient-to-r from-green-600 to-green-700 text-white"
          
        >
          <button
            onClick={() =>
              navigate(
                patientId
                  ? `/medecin/patients/${patientId}/consultations`
                  : "/medecin/patients"
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          
          <div className="header-overlay">
            <h1>Dossiers Patients</h1>
            <p>Accédez aux dossiers médicaux de vos patients autorisés</p>
          </div>
        </div>
      </div>


      
      
      {/* CONTENU */}
      
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="max-w-4xl mx-auto space-y-6">

          {/* Informations de base */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

            <h3 className="font-semibold flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-green-600" />
              Informations de base
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Patient
                </label>

                <input
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  value={patientId || ""}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Type d'arrivée
                </label>

                <select className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
                  <option>Sur rendez-vous</option>
                  <option>Sans rendez-vous</option>
                  <option>Urgence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Date
                </label>

                <input
                  type="date"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Heure
                </label>

                <input
                  type="time"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Motif de consultation
              </label>

              <input
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Douleurs abdominales..."
              />
            </div>

          </div>

          {/* Anamnèse */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

            <h3 className="font-semibold">Anamnèse</h3>

            <textarea
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
              placeholder="Histoire de la maladie..."
            />

          </div>

          {/* Examen clinique */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

            <h3 className="font-semibold">Examen clinique</h3>

            <textarea
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
              placeholder="Détaillez l'examen..."
            />

          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

            <h3 className="font-semibold">Actions</h3>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() => setShowOrdonnance(true)}
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Générer une ordonnance
              </button>

              <button
                onClick={() => setShowAnalyses(true)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Demander des analyses
              </button>

              <label className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg cursor-pointer">

                <input
                  type="checkbox"
                  checked={hospitaliser}
                  onChange={(e) => setHospitaliser(e.target.checked)}
                />

                Hospitaliser le patient

              </label>

            </div>

          </div>

          {/* Ordonnance */}
          {showOrdonnance && (

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

              <h3 className="font-semibold mb-3">Ordonnance</h3>

              {medicaments.map((m, i) => (

                <div key={i} className="grid md:grid-cols-6 gap-3 mb-3">

                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Médicament" />
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Dosage" />
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Posologie" />
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Durée" />

                  <button
                    onClick={() => removeMedicament(i)}
                    className="text-red-500"
                  >
                    <Trash2 />
                  </button>

                </div>

              ))}

              <button
                onClick={addMedicament}
                className="flex items-center gap-2 text-green-600"
              >
                <Plus className="w-4 h-4" />
                Ajouter un médicament
              </button>

            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-4">

            <button className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2">

              <Save className="w-4 h-4" />

              Enregistrer la consultation

            </button>

            <button className="px-6 py-3 border border-green-600 text-green-600 rounded-lg">

              Générer le résumé

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NouvelleConsultation;