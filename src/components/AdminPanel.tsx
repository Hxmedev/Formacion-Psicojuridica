import React, { useState } from 'react';
import AdminClient from './AdminClient';
import AdminCursos from './AdminCursos';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState<'conversatorios' | 'cursos'>('conversatorios');

  return (
    <div className="divide-y divide-gray-200">
      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveSection('conversatorios')}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
              activeSection === 'conversatorios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Conversatorios
          </button>
          <button
            onClick={() => setActiveSection('cursos')}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
              activeSection === 'cursos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Cursos
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="p-6">
        {activeSection === 'conversatorios' ? <AdminClient /> : <AdminCursos />}
      </div>
    </div>
  );
};

export default AdminPanel;