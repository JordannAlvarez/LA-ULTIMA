
'use client';

import { useState } from 'react';
import Header from '../components/Header';
import CalculadoraNotas from '../components/CalculadoraNotas';
import Historial from '../components/Historial';

export default function Home() {
  const [activeTab, setActiveTab] = useState('calculadora');

  const renderContent = () => {
    switch (activeTab) {
      case 'calculadora':
        return <CalculadoraNotas />;
      case 'historial':
        return <Historial />;
      default:
        return <CalculadoraNotas />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}