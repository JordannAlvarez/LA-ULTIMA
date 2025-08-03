
'use client';

import { useState } from 'react';

interface Materia {
  id: string;
  nombre: string;
  creditos: number;
  nota: number;
}

interface Semestre {
  id: string;
  nombre: string;
  materias: Materia[];
}

export default function Historial() {
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [nuevoSemestre, setNuevoSemestre] = useState('');
  const [nuevaMateria, setNuevaMateria] = useState({
    semestreId: '',
    nombre: '',
    creditos: '',
    nota: ''
  });
  const [mostrarFormularioSemestre, setMostrarFormularioSemestre] = useState(false);
  const [mostrarFormularioMateria, setMostrarFormularioMateria] = useState('');
  const [editandoMateria, setEditandoMateria] = useState({
    semestreId: '',
    materiaId: '',
    campo: '',
    valor: ''
  });
  const [menuAbierto, setMenuAbierto] = useState('');

  const calcularPAPA = () => {
    let totalCreditos = 0;
    let totalPuntos = 0;

    semestres.forEach(semestre => {
      semestre.materias.forEach(materia => {
        totalCreditos += materia.creditos;
        totalPuntos += materia.nota * materia.creditos;
      });
    });

    return totalCreditos > 0 ? totalPuntos / totalCreditos : 0;
  };

  const calcularPAPI = () => {
    if (semestres.length === 0) return 0;

    const ultimoSemestre = semestres[semestres.length - 1];
    let totalCreditos = 0;
    let totalPuntos = 0;

    ultimoSemestre.materias.forEach(materia => {
      totalCreditos += materia.creditos;
      totalPuntos += materia.nota * materia.creditos;
    });

    return totalCreditos > 0 ? totalPuntos / totalCreditos : 0;
  };

  const agregarSemestre = () => {
    if (nuevoSemestre.trim()) {
      const semestre: Semestre = {
        id: Date.now().toString(),
        nombre: nuevoSemestre,
        materias: []
      };
      setSemestres([...semestres, semestre]);
      setNuevoSemestre('');
      setMostrarFormularioSemestre(false);
    }
  };

  const agregarMateria = (semestreId: string) => {
    if (nuevaMateria.nombre && nuevaMateria.creditos && nuevaMateria.nota) {
      const materia: Materia = {
        id: Date.now().toString(),
        nombre: nuevaMateria.nombre,
        creditos: parseInt(nuevaMateria.creditos),
        nota: parseFloat(nuevaMateria.nota)
      };

      setSemestres(semestres.map(semestre =>
        semestre.id === semestreId
          ? { ...semestre, materias: [...semestre.materias, materia] }
          : semestre
      ));

      setNuevaMateria({ semestreId: '', nombre: '', creditos: '', nota: '' });
      setMostrarFormularioMateria('');
    }
  };

  const eliminarMateria = (semestreId: string, materiaId: string) => {
    setSemestres(semestres.map(semestre =>
      semestre.id === semestreId
        ? { ...semestre, materias: semestre.materias.filter(materia => materia.id !== materiaId) }
        : semestre
    ));
  };

  const editarMateria = (semestreId: string, materiaId: string, campo: string, valor: string | number) => {
    setSemestres(semestres.map(semestre =>
      semestre.id === semestreId
        ? {
            ...semestre,
            materias: semestre.materias.map(materia =>
              materia.id === materiaId ? { ...materia, [campo]: valor } : materia
            )
          }
        : semestre
    ));
  };

  const iniciarEdicion = (semestreId: string, materiaId: string, campo: string, valorActual: string) => {
    setEditandoMateria({
      semestreId,
      materiaId,
      campo,
      valor: valorActual
    });
  };

  const guardarEdicion = () => {
    if (editandoMateria.semestreId && editandoMateria.materiaId && editandoMateria.campo) {
      const valor = editandoMateria.campo === 'creditos'
        ? parseInt(editandoMateria.valor)
        : editandoMateria.campo === 'nota'
        ? parseFloat(editandoMateria.valor)
        : editandoMateria.valor;

      editarMateria(editandoMateria.semestreId, editandoMateria.materiaId, editandoMateria.campo, valor);
      setEditandoMateria({ semestreId: '', materiaId: '', campo: '', valor: '' });
    }
  };

  const cancelarEdicion = () => {
    setEditandoMateria({ semestreId: '', materiaId: '', campo: '', valor: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      guardarEdicion();
    }
  };

  const papa = calcularPAPA();
  const papi = calcularPAPI();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-4 pb-4">
        <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Academic History</h1>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-xs text-gray-600 mb-1">PAPA</div>
              <div className="text-2xl md:text-3xl font-bold text-green-600">{papa.toFixed(2)}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-xs text-gray-600 mb-1">PAPI</div>
              <div className="text-2xl md:text-3xl font-bold text-green-600">{papi.toFixed(2)}</div>
            </div>
          </div>

          <button
            onClick={() => setMostrarFormularioSemestre(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-2 text-sm"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line"></i>
            </div>
            New Semester
          </button>

          {mostrarFormularioSemestre && (
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 mx-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3">New Semester</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ex: 2025-2"
                  value={nuevoSemestre}
                  onChange={(e) => setNuevoSemestre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={agregarSemestre}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormularioSemestre(false);
                      setNuevoSemestre('');
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {semestres.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-50 rounded-full">
              <i className="ri-graduation-cap-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your academic history is empty</h3>
            <p className="text-gray-500 text-sm mb-4">Start by adding your first semester to calculate your PAPA and PAPI</p>
            <button
              onClick={() => setMostrarFormularioSemestre(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-add-line"></i>
              </div>
              Add First Semester
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {semestres.slice().reverse().map((semestre) => (
              <div key={semestre.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{semestre.nombre}</h3>

                <div className="space-y-3">
                  {semestre.materias.map(materia => (
                    <div key={materia.id} className="bg-gray-50 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {editandoMateria.materiaId === materia.id && editandoMateria.campo === 'nombre' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editandoMateria.valor}
                                onChange={(e) => setEditandoMateria({ ...editandoMateria, valor: e.target.value })}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                              <button
                                onClick={guardarEdicion}
                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 cursor-pointer"
                              >
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-check-line"></i>
                                </div>
                              </button>
                              <button
                                onClick={cancelarEdicion}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 cursor-pointer"
                              >
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-close-line"></i>
                                </div>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800 text-sm truncate pr-2">{materia.nombre}</span>
                              <div className="relative">
                                <button
                                  onClick={() => setMenuAbierto(menuAbierto === materia.id ? '' : materia.id)}
                                  className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-200 cursor-pointer flex-shrink-0"
                                >
                                  <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-more-2-line"></i>
                                  </div>
                                </button>

                                {menuAbierto === materia.id && (
                                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                                    <button
                                      onClick={() => {
                                        iniciarEdicion(semestre.id, materia.id, 'nombre', materia.nombre);
                                        setMenuAbierto('');
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                                    >
                                      <div className="w-4 h-4 flex items-center justify-center">
                                        <i className="ri-edit-line"></i>
                                      </div>
                                      Edit name
                                    </button>
                                    <button
                                      onClick={() => {
                                        eliminarMateria(semestre.id, materia.id);
                                        setMenuAbierto('');
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                                    >
                                      <div className="w-4 h-4 flex items-center justify-center">
                                        <i className="ri-delete-bin-line"></i>
                                      </div>
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Credits</div>
                          {editandoMateria.materiaId === materia.id && editandoMateria.campo === 'creditos' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editandoMateria.valor}
                                onChange={(e) => setEditandoMateria({ ...editandoMateria, valor: e.target.value })}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                              <button
                                onClick={guardarEdicion}
                                className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 cursor-pointer"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <i className="ri-check-line text-xs"></i>
                                </div>
                              </button>
                              <button
                                onClick={cancelarEdicion}
                                className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 cursor-pointer"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <i className="ri-close-line text-xs"></i>
                                </div>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-800">{materia.creditos}</span>
                              <button
                                onClick={() => iniciarEdicion(semestre.id, materia.id, 'creditos', materia.creditos.toString())}
                                className="bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-600 cursor-pointer"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <i className="ri-edit-line text-xs"></i>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Grade</div>
                          {editandoMateria.materiaId === materia.id && editandoMateria.campo === 'nota' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={editandoMateria.valor}
                                onChange={(e) => setEditandoMateria({ ...editandoMateria, valor: e.target.value })}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                              <button
                                onClick={guardarEdicion}
                                className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 cursor-pointer"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <i className="ri-check-line text-xs"></i>
                                </div>
                              </button>
                              <button
                                onClick={cancelarEdicion}
                                className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 cursor-pointer"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <i className="ri-close-line text-xs"></i>
                                </div>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-600">{materia.nota.toFixed(1)}</span>
                              <button
                                onClick={() => iniciarEdicion(semestre.id, materia.id, 'nota', materia.nota.toString())}
                                className="bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-600 cursor-pointer"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <i className="ri-edit-line text-xs"></i>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {mostrarFormularioMateria === semestre.id ? (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-800 text-sm">New Subject</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Subject name"
                        value={nuevaMateria.nombre}
                        onChange={(e) => setNuevaMateria({ ...nuevaMateria, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Credits"
                          value={nuevaMateria.creditos}
                          onChange={(e) => setNuevaMateria({ ...nuevaMateria, creditos: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Grade (0-5)"
                          step="0.1"
                          min="0"
                          max="5"
                          value={nuevaMateria.nota}
                          onChange={(e) => setNuevaMateria({ ...nuevaMateria, nota: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => agregarMateria(semestre.id)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setMostrarFormularioMateria('');
                            setNuevaMateria({ semestreId: '', nombre: '', creditos: '', nota: '' });
                          }}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setMostrarFormularioMateria(semestre.id)}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-add-line"></i>
                    </div>
                    Add Subject
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}