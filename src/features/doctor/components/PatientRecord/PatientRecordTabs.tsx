import React from 'react';
import type { PatientRecordTabId } from '@shared/types/patient-record.types';

export interface PatientRecordTab {
  id: PatientRecordTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PatientRecordTabsProps {
  tabs: PatientRecordTab[];
  activeTab: PatientRecordTabId;
  setActiveTab: (tab: PatientRecordTabId) => void;
}

const PatientRecordTabs: React.FC<PatientRecordTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <div className="flex flex-wrap gap-2 -mb-px">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  </div>
);

export default PatientRecordTabs;
