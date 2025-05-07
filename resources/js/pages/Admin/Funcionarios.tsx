import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { AxiosError } from "axios";

// Interfaces
interface Funcionario {
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string; 
}

interface Empleo {
  opec: string;
  codemp: string;
  vinculo: string;
  adscrito_id: number;
  resnombramiento: string;
  acta: string;
  resfunciones: string;
  fecha_ingreso: string;
  fecha_final: string;
  coordinador: boolean;
}

interface Salario {
  codemp: string;
  salario: string;
}

interface Adscrito {
  id: number;
  nombre: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

const Funcionarios: React.FC = () => {
  const [funcionarioData, setFuncionarioData] = useState<Funcionario>({
    identificacion: "",
    nombres: "",
    apellidos: "",
    email: "",
   
  });

  const [empleoData, setEmpleoData] = useState<Empleo>({
    opec: "",
    codemp: "",
    vinculo: "",
    adscrito_id: 0,
    resnombramiento: "",
    acta: "",
    resfunciones: "",
    fecha_ingreso: "",
    fecha_final: "",
    coordinador: false,
  });

  const [salarios, setSalarios] = useState<Salario[]>([]);
  const [adscritos, setAdscritos] = useState<Adscrito[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const [salariosRes, adscritosRes] = await Promise.all([
          api.get("/api/codigos-salario"),
          api.get("/api/adscritos"),
        ]);

        const salariosData = Array.isArray(salariosRes.data)
          ? salariosRes.data
          : salariosRes.data.data ?? [];

        const adscritosData = Array.isArray(adscritosRes.data)
          ? adscritosRes.data
          : adscritosRes.data.data ?? [];

        setSalarios(salariosData);
        setAdscritos(adscritosData);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      console.error("❌ Error al obtener datos:", error.response?.data || error.message);
      const errorData = error.response?.data;
      if (errorData?.errors) {
        let errorMessage = "❌ Errores de validación: ";
        for (const field in errorData.errors) {
          errorMessage += `${field}: ${errorData.errors[field].join(", ")}; `;
        }
        setMessage(errorMessage);
      } else {
        setMessage("❌ Error al cargar datos.");
      }
    } else if (error instanceof Error) {
      console.error("❌ Error inesperado:", error.message);
      setMessage("❌ Error inesperado.");
    } else {
      console.error("❌ Error desconocido:", error);
      setMessage("❌ Error desconocido.");
    }
  };

  const handleFuncionarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFuncionarioData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmpleoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setEmpleoData((prev) => ({
      ...prev,
      [name]: name === "adscrito_id" ? Number(newValue) : newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }

      const payload = {
        funcionario: funcionarioData,
        empleo: empleoData,
        creado_por: user?.id,
      };

      await api.post("/api/funcionarios-con-empleo", payload);
      setMessage("✅ Funcionario y empleo registrados con éxito.");

      setFuncionarioData({
        identificacion: "",
        nombres: "",
        apellidos: "",
        email: "",
       
      });

      setEmpleoData({
        opec: "",
        codemp: "",
        vinculo: "",
        adscrito_id: 0,
        resnombramiento: "",
        acta: "",
        resfunciones: "",
        fecha_ingreso: "",
        fecha_final: "",
        coordinador: false,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role.name !== "admin") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          No tienes permiso para acceder a esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Registro de Funcionario</h2>

      <div className="alert alert-secondary mb-3">
        Bienvenido, <strong>{user.name}</strong> ({user.role.name})
      </div>

      <form onSubmit={handleSubmit}>
        {/* Datos Funcionario */}
        <div className="row mb-3">
          <div className="col">
            <input type="text" className="form-control" name="identificacion" placeholder="Identificación" value={funcionarioData.identificacion} onChange={handleFuncionarioChange} required />
          </div>
          <div className="col">
            <input type="text" className="form-control" name="nombres" placeholder="Nombres" value={funcionarioData.nombres} onChange={handleFuncionarioChange} required />
          </div>
          <div className="col">
            <input type="text" className="form-control" name="apellidos" placeholder="Apellidos" value={funcionarioData.apellidos} onChange={handleFuncionarioChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <input type="email" className="form-control" name="email" placeholder="Correo electrónico" value={funcionarioData.email} onChange={handleFuncionarioChange} />
          </div>
          <div className="col">
            <input type="text" className="form-control" name="opec" placeholder="OPEC" value={empleoData.opec} onChange={handleEmpleoChange} />
          </div>
        </div>

        {/* Datos Empleo */}
        <div className="row mb-3">
          <div className="col">
            <select name="codemp" className="form-control" value={empleoData.codemp} onChange={handleEmpleoChange} required>
              <option value="">Seleccione Código de Empleo</option>
              {salarios.map((salario) => (
                <option key={salario.codemp} value={salario.codemp}>
                  {salario.codemp}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input type="text" className="form-control" name="vinculo" placeholder="Vínculo" value={empleoData.vinculo} onChange={handleEmpleoChange} />
          </div>
          <div className="col">
            <select name="adscrito_id" className="form-control" value={empleoData.adscrito_id} onChange={handleEmpleoChange} required>
              <option value="">Seleccione Adscrito A</option>
              {adscritos.map((adscrito) => (
                <option key={adscrito.id} value={adscrito.id}>
                  {adscrito.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <input type="text" className="form-control" name="resnombramiento" placeholder="Resolución de nombramiento" value={empleoData.resnombramiento} onChange={handleEmpleoChange} />
          </div>
          <div className="col">
            <input type="text" className="form-control" name="acta" placeholder="Acta" value={empleoData.acta} onChange={handleEmpleoChange} />
          </div>
          <div className="col">
            <input type="text" className="form-control" name="resfunciones" placeholder="Resolución de funciones" value={empleoData.resfunciones} onChange={handleEmpleoChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>Fecha de ingreso</label>
            <input type="date" className="form-control" name="fecha_ingreso" value={empleoData.fecha_ingreso} onChange={handleEmpleoChange} />
          </div>
          <div className="col">
            <label>Fecha final</label>
            <input type="date" className="form-control" name="fecha_final" value={empleoData.fecha_final} onChange={handleEmpleoChange} />
          </div>
          <div className="col d-flex align-items-center">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" name="coordinador" checked={empleoData.coordinador} onChange={handleEmpleoChange} />
              <label className="form-check-label">Coordinador</label>
            </div>
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cargando..." : "Registrar Funcionario"}
        </button>
      </form>
    </div>
  );
};

export default Funcionarios;
