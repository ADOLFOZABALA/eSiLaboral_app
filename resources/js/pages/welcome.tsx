// resources/js/pages/welcome.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/welcome.css";

function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Agrega clase al body al montar
    document.body.classList.add("welcome-body");

    // Limpia la clase al desmontar
    return () => {
      document.body.classList.remove("welcome-body");
    };
  }, []);

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">e-SiLaboral 🌿</h1>
      <p className="welcome-text">Gestiona tu certificado laboral.</p>
      <button className="welcome-button" onClick={handleStart}>
        Empezar
      </button>
    </div>
  );
}

export default Welcome;
