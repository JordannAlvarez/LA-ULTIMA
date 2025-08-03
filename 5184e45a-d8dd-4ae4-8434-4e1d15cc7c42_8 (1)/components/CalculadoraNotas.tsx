
'use client';

import { useState } from 'react';

interface Nota {
  id: string;
  nombre: string;
  porcentaje: number;
  calificacion: number;
}

export default function CalculadoraNotas() {
  const [notas, setNotas] = useState<Nota[]>([]);
  
  const [nuevaNota, setNuevaNota] = useState({
    nombre: '',
    porcentaje: '',
    calificacion: ''
  });
  
  const [notaMinima, setNotaMinima] = useState('3');

  const calcularResultados = () => {
    const porcentajeTotal = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
    const notaPonderada = notas.reduce((sum, nota) => sum + (nota.calificacion * nota.porcentaje / 100), 0);
    const porcentajeRestante = 100 - porcentajeTotal;
    const notaFinal = porcentajeTotal === 100 ? notaPonderada : 0;
    const aprobado = notaFinal >= parseFloat(notaMinima);

    return {
      porcentajeTotal,
      notaPonderada,
      porcentajeRestante,
      notaFinal,
      aprobado
    };
  };

  const eliminarNota = (id: string) => {
    setNotas(notas.filter(nota => nota.id !== id));
  };

  const agregarNota = () => {
    if (nuevaNota.nombre && nuevaNota.porcentaje && nuevaNota.calificacion) {
      const nota: Nota = {
        id: Date.now().toString(),
        nombre: nuevaNota.nombre,
        porcentaje: parseFloat(nuevaNota.porcentaje),
        calificacion: parseFloat(nuevaNota.calificacion)
      };
      setNotas([...notas, nota]);
      setNuevaNota({ nombre: '', porcentaje: '', calificacion: '' });
    }
  };

  const resultados = calcularResultados();

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-book-line text-base text-gray-600"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 ml-2">Notas Actuales</h2>
        </div>

        {notas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <i className="ri-book-open-line text-2xl"></i>
            </div>
            <p className="text-sm">No hay notas registradas aún</p>
            <p className="text-xs text-gray-400 mt-1">Añade tu primera nota usando el formulario de abajo</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {notas.map((nota) => (
              <div key={nota.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 text-sm">{nota.nombre}</span>
                  <button
                    onClick={() => eliminarNota(nota.id)}
                    className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <div className="w-3 h-3 flex items-center justify-center">
                      <i className="ri-subtract-line text-xs"></i>
                    </div>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Porcentaje</div>
                    <div className="text-sm font-medium text-gray-800">{nota.porcentaje}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Calificación</div>
                    <div className="text-sm font-medium text-green-600">{nota.calificacion}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center mb-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-add-line text-base text-gray-600"></i>
            </div>
            <h3 className="font-semibold text-gray-800 ml-2 text-sm">Añadir Nueva Nota</h3>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre (Ej: Parcial)"
              value={nuevaNota.nombre}
              onChange={(e) => setNuevaNota({...nuevaNota, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Porcentaje (%)"
                value={nuevaNota.porcentaje}
                onChange={(e) => setNuevaNota({...nuevaNota, porcentaje: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                placeholder="Calificación (0-5)"
                step="0.1"
                value={nuevaNota.calificacion}
                onChange={(e) => setNuevaNota({...nuevaNota, calificacion: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button
              onClick={agregarNota}
              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-add-line"></i>
              </div>
              Añadir
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-percent-line text-base text-gray-600"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 ml-2">Resultados</h2>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Porcentaje Evaluado</div>
            <div className="text-base font-semibold text-gray-800">{resultados.porcentajeTotal.toFixed(2)}%</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Nota Actual Ponderada</div>
            <div className="text-base font-semibold text-red-600">{resultados.notaPonderada.toFixed(2)}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">Nota Mínima para Pasar</div>
                <div className="text-base font-semibold text-gray-800">{notaMinima}</div>
              </div>
              <input
                type="number"
                step="0.1"
                value={notaMinima}
                onChange={(e) => setNotaMinima(e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {resultados.porcentajeTotal === 100 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center text-green-600 mr-2">
                  <i className="ri-checkbox-circle-line"></i>
                </div>
                <div>
                  <div className="text-xs text-green-700 mb-1">Materia Finalizada</div>
                  <div className="text-sm font-semibold text-green-800">
                    Nota final: {resultados.notaFinal.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
