import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Variables
const tipoValido = ["image/jpeg", "image/jpg", "image/png"];

function App() {
  const [planetas, setPlanetas] = useState(
    JSON.parse(localStorage.getItem("planetas")) || []
  );
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const inputImagenRef = useRef(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [indiceEditar, setIndiceEditar] = useState(null);

  useEffect(() => {
    localStorage.setItem("planetas", JSON.stringify(planetas));
  }, [planetas]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || (modoEdicion ? false : !imagen)) {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text: "Todos los campos son obligatorios",
      });
      return;
    }

    if (imagen && !tipoValido.includes(imagen.type)) {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text: "Tipo de archivo no permitido (Aceptados: PNG, JPG, JPEG)",
      });
      return;
    }

    let imagenBase64 = imagen
      ? await convertirBase64(imagen)
      : planetas[indiceEditar]?.imagen;

    const nuevoPlaneta = {
      nombre,
      descripcion,
      imagen: imagenBase64,
    };

    if (modoEdicion) {
      const planetasActualizados = [...planetas];
      planetasActualizados[indiceEditar] = nuevoPlaneta;
      setPlanetas(planetasActualizados);
      setModoEdicion(false);
      setIndiceEditar(null);
    } else {
      setPlanetas([...planetas, nuevoPlaneta]);
    }

    setNombre("");
    setDescripcion("");
    setImagen(null);
    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  const handleDelete = (index) => {
    Swal.fire({
      title: "Alerta",
      text: "¿Está seguro que desea eliminar el planeta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((res) => {
      if (res.isConfirmed) {
        const nuevosPlanetas = [...planetas];
        nuevosPlanetas.splice(index, 1);
        setPlanetas(nuevosPlanetas);
      }
    });
  };

  const handleEdit = (index) => {
    const planeta = planetas[index];
    setNombre(planeta.nombre);
    setDescripcion(planeta.descripcion);
    setImagen(null);
    setModoEdicion(true);
    setIndiceEditar(index);

    if (inputImagenRef.current) {
      inputImagenRef.current.value = ""; // Limpiar el input de imagen
    }
  };

  const convertirBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <h1>Bitácora de Exploración</h1>

      <form onSubmit={handleSubmit} id="form-principal">
        <label>
          <span>Nombre del planeta:</span>
          <input
            id="nombrePlaneta"
            type="text"
            placeholder="Nombre del planeta"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Descripción:</span>
          <textarea
            id="descripcionPlaneta"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            required
          />
        </label>

        <label>
          <span>Archivo:</span>
          <input
            id="archivoPlaneta"
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            ref={inputImagenRef}
            accept=".jpg, .jpeg, .png"
          />
        </label>

        <button type="submit" id="guardarBtn">
          {modoEdicion ? "Actualizar" : "Guardar"}
        </button>
      </form>

      <h2>Planetas Registrados</h2>
      <ul>
        {planetas.map((planeta, index) => (
          <li key={index}>
            <h3>{planeta.nombre}</h3>
            {planeta.imagen && (
              <img src={planeta.imagen} alt={planeta.nombre} />
            )}
            <p>{planeta.descripcion}</p>

            <div className="btn-container">
              <button id="editarBtn" onClick={() => handleEdit(index)}>
                <i className="fa-solid fa-pencil"></i>
                Editar
              </button>
              <button id="eliminarBtn" onClick={() => handleDelete(index)}>
                <i className="fa-solid fa-trash"></i>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
