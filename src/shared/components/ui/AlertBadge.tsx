import {AlertSeverity} from "@/data/models";
import {ALERT_SEVERITY_CONFIG} from "@core/utils";
import React from "react";

interface AlertBadgeProps {
    severity: AlertSeverity;
}
export const AlertSeverityBadge: React.FC<AlertBadgeProps> = ({ severity }) => {
    const cfg = ALERT_SEVERITY_CONFIG[severity];
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}
        >
      <i className={cfg.icon}></i>
            {cfg.label}
    </span>
    );
};