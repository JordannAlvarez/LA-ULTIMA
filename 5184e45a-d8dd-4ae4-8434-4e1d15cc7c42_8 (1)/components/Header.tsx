
'use client';

import { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-gray-800">Calculadora UNAL</h1>
          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('calculadora')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'calculadora'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Calculadora
            </button>
            <button
              onClick={() => onTabChange('historial')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'historial'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Historial
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}