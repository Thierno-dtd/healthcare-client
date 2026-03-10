import React from 'react';
import type { TabId } from '../types/dossiersPatients.types';
import { TABS } from '../services/dossiersPatients.constants';

interface TabsBarProps {
  activeTab: TabId;
  // eslint-disable-next-line no-unused-vars
  setActiveTab: (tab: TabId) => void;
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  setSearchQuery: (_value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onTabChange?: (_tab: TabId) => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, onTabChange }) => {
  const [tabHover, setTabHover] = React.useState<TabId | null>(null);

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <>
      <div className="flex gap-1 bg-muted rounded-lg p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isHover = tabHover === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              onMouseEnter={() => setTabHover(tab.id)}
              onMouseLeave={() => setTabHover(null)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-card text-primary shadow-sm'
                  : isHover
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <i className={tab.icon} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab !== 'historique' && (
        <div className="relative mb-6 max-w-md">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-10 py-2 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>
      )}
    </>
  );
};

export default TabsBar;
