import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Curso {
  id: number;
  slug: string;
  title: string;
  availability: string;
  docentes: (string | { name: string })[];
  imageUrl?: string;
}

interface DocenteItem {
  id: string;
  name: string;
}

const defaultForm = {
  slug: '',
  title: '',
  availability: '',
  docentesInput: '',
  image: null as File | null
};

const AdminCursos = () => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [data, setData] = useState<Curso[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docentesList, setDocentesList] = useState<DocenteItem[]>([]);
  const [currentDocente, setCurrentDocente] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cursos/get');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('Error al cargar los cursos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para normalizar los docentes
  const normalizeDocentes = (docentes: (string | { name: string })[]): string[] => {
    return docentes.map(docente => {
      if (typeof docente === 'string') return docente;
      if (typeof docente === 'object' && docente.name) return docente.name;
      return '';
    }).filter(name => name.trim() !== '');
  };

  const handleEdit = (curso: Curso) => {
    setEditId(curso.id);
    setForm({
      slug: curso.slug,
      title: curso.title,
      availability: curso.availability,
      docentesInput: '',
      image: null,
    });
    setCurrentImageUrl(curso.imageUrl || null);
  
    const docentesNormalizados = normalizeDocentes(curso.docentes);
    const initialDocentes = docentesNormalizados.map(name => ({
      id: uuidv4(),
      name: name.trim()
    }));

    setDocentesList(initialDocentes);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const docentes = docentesList.map(d => d.name);

    const formData = new FormData();
    formData.append('slug', form.slug);
    formData.append('title', form.title);
    formData.append('availability', form.availability);
    formData.append('docentesInput', docentes.join(' - '));
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      const url = editId ? `/api/cursos/update/${editId}` : '/api/cursos/create';
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error();
      await fetchData();
      closeModal();
    } catch (error) {
      setError('Error al guardar el curso');
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm(defaultForm);
    setCurrentImageUrl(null);
    setDocentesList([]);
    setCurrentDocente('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleDocenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDocente(e.target.value);
  };

  const handleDocenteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === '-' || e.key === 'Enter') && currentDocente.trim()) {
      e.preventDefault();
      addDocente(currentDocente.trim());
    }
  };

  const addDocente = (name: string) => {
    if (!name) return;
    setDocentesList(prev => [...prev, { id: uuidv4(), name: name.trim() }]);
    setCurrentDocente('');
  };

  const removeDocente = (id: string) => {
    setDocentesList(prev => prev.filter(d => d.id !== id));
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cursos/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el curso');
      }

      await fetchData();
    } catch (error) {
      setError('Error al eliminar el curso');
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">Administración de Cursos</h2>

      {/* Botón y controles superiores */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Listado de Cursos</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Curso
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editId ? 'Editar Curso' : 'Crear Nuevo Curso'}
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  {editId && currentImageUrl && (
                    <div className="mb-2">
                      <img 
                        src={currentImageUrl} 
                        alt="Imagen actual" 
                        className="h-20 w-auto rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
                  <input
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Docentes</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {docentesList.map(docente => (
                      <div key={docente.id} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                        {docente.name}
                        <button
                          type="button"
                          onClick={() => removeDocente(docente.id)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentDocente}
                      onChange={handleDocenteChange}
                      onKeyDown={handleDocenteKeyDown}
                      placeholder="Añadir docente (presiona Enter o -)"
                      className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {editId ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Listado de cursos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>No hay cursos registrados</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {data.map((c) => (
    <div key={c.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      {/* Contenido principal */}
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Disponibilidad: {c.availability}</span>
          </p>
          <p className="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-2a3 3 0 00-3 3v2" />
            </svg>
            <span>Docentes: {normalizeDocentes(c.docentes).join(', ')}</span>
          </p>
        </div>
      </div>
      
      {/* Botones pegados al fondo */}
      <div className="p-4 bg-gray-50 border-t flex justify-end gap-2 mt-auto">
        <button
          onClick={() => handleEdit(c)}
          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
          title="Editar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => handleDelete(c.id)}
          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
          title="Eliminar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
};

export default AdminCursos;