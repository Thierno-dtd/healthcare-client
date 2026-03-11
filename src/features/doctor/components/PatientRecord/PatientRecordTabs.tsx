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

const PatientRecordTabs: React.FC<PatientRecordTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tabs-container mb-6">
      <div className="tabs">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              className={`tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="w-4 h-4 mr-2 inline" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PatientRecordTabs;