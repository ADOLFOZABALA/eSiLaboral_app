import React from "react";

interface CoordinadorCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Cambiado aquí
}

const CoordinadorCheckbox: React.FC<CoordinadorCheckboxProps> = ({ checked, onChange }) => {
  return (
    <div className="form-check">
      <input
        type="checkbox"
        id="coordinador"
        className="form-check-input"
        checked={checked}
        onChange={onChange} // No hay cambio aquí
      />
      <label htmlFor="coordinador" className="form-check-label">
        Coordinador
      </label>
    </div>
  );
};

export default CoordinadorCheckbox;
