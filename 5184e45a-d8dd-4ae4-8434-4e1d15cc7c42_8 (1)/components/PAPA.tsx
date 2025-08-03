
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

export default function PAPA() {
  const [semestres, setSemestres] = useState<Semestre[]>([
    {
      id: '1',
      nombre: '2024-1',
      materias: [
        { id: '1', nombre: 'Cálculo I', creditos: 4, nota: 4.2 },
        { id: '2', nombre: 'Álgebra Lineal', creditos: 3, nota: 3.8 },
        { id: '3', nombre: 'Programación', creditos: 3, nota: 4.5 }
      ]
    }
  ]);

  const [nuevoSemestre, setNuevoSemestre] = useState('');
  const [nuevaMateria, setNuevaMateria] = useState({
    semestreId: '',
    nombre: '',
    creditos: '',
    nota: ''
  });

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

  const agregarSemestre = () => {
    if (nuevoSemestre.trim()) {
      const semestre: Semestre = {
        id: Date.now().toString(),
        nombre: nuevoSemestre,
        materias: []
      };
      setSemestres([...semestres, semestre]);
      setNuevoSemestre('');
    }
  };

  const agregarMateria = () => {
    if (nuevaMateria.semestreId && nuevaMateria.nombre && nuevaMateria.creditos && nuevaMateria.nota) {
      const materia: Materia = {
        id: Date.now().toString(),
        nombre: nuevaMateria.nombre,
        creditos: parseInt(nuevaMateria.creditos),
        nota: parseFloat(nuevaMateria.nota)
      };

      setSemestres(semestres.map(semestre => 
        semestre.id === nuevaMateria.semestreId 
          ? { ...semestre, materias: [...semestre.materias, materia] }
          : semestre
      ));

      setNuevaMateria({ semestreId: '', nombre: '', creditos: '', nota: '' });
    }
  };

  const eliminarMateria = (semestreId: string, materiaId: string) => {
    setSemestres(semestres.map(semestre => 
      semestre.id === semestreId 
        ? { ...semestre, materias: semestre.materias.filter(materia => materia.id !== materiaId) }
        : semestre
    ));
  };

  const papa = calcularPAPA();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-graduation-cap-line text-lg text-gray-600"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 ml-2">PAPA (Promedio Académico Ponderado Acumulado)</h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">PAPA Actual</div>
            <div className="text-2xl font-bold text-blue-600">{papa.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: 2025-1"
              value={nuevoSemestre}
              onChange={(e) => setNuevoSemestre(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={agregarSemestre}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Añadir Semestre
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <select
              value={nuevaMateria.semestreId}
              onChange={(e) => setNuevaMateria({...nuevaMateria, semestreId: e.target.value})}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="">Seleccionar semestre</option>
              {semestres.map(semestre => (
                <option key={semestre.id} value={semestre.id}>{semestre.nombre}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Nombre de materia"
            value={nuevaMateria.nombre}
            onChange={(e) => setNuevaMateria({...nuevaMateria, nombre: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="number"
            placeholder="Créditos"
            value={nuevaMateria.creditos}
            onChange={(e) => setNuevaMateria({...nuevaMateria, creditos: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="number"
            placeholder="Nota (0-5)"
            step="0.1"
            value={nuevaMateria.nota}
            onChange={(e) => setNuevaMateria({...nuevaMateria, nota: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={agregarMateria}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Añadir Materia
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {semestres.map(semestre => (
          <div key={semestre.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Semestre {semestre.nombre}</h3>
            
            {semestre.materias.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No hay materias registradas</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-700">Materia</th>
                      <th className="text-center py-2 font-medium text-gray-700">Créditos</th>
                      <th className="text-center py-2 font-medium text-gray-700">Nota</th>
                      <th className="text-center py-2 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semestre.materias.map(materia => (
                      <tr key={materia.id} className="border-b border-gray-100">
                        <td className="py-3 text-gray-800">{materia.nombre}</td>
                        <td className="py-3 text-center text-gray-600">{materia.creditos}</td>
                        <td className="py-3 text-center font-medium text-gray-800">{materia.nota.toFixed(1)}</td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => eliminarMateria(semestre.id, materia.id)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer"
                          >
                            <div className="w-4 h-4 flex items-center justify-center">
                              <i className="ri-delete-bin-line text-sm"></i>
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
