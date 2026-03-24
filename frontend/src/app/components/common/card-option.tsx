import { FC } from "react";

export interface CardOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  disabledMessage?: string;
}

interface CardOptionSelectorProps {
  id: string;
  options: CardOption[];
  value: string;
  onChange: (value: string) => void;
  errMsg?: string;
}

export const CardOptionSelector: FC<CardOptionSelectorProps> = ({ id, options, value, onChange, errMsg }) => {
  return (
    <div>
      <div className="d-flex gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            id={`${id}-${option.value}`}
            className={`card-option-selector ${value === option.value ? "selected" : ""}`}
            onClick={() => onChange(option.value)}
            disabled={option.disabled}
            title={option.disabled ? option.disabledMessage : undefined}
          >
            <div className="card-option-selector-content">
              {option.icon && <i className={`${option.icon} card-option-selector-icon`} />}
              <div>
                <div className="card-option-selector-label">{option.label}</div>
                {option.description && <div className="card-option-selector-description">{option.description}</div>}
              </div>
            </div>
          </button>
        ))}
      </div>
      {errMsg && <div className="error-message mt-2">{errMsg}</div>}
    </div>
  );
};
