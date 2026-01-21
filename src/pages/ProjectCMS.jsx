
// src/pages/ProjectCMS.jsx
import Papa from 'papaparse';
import React, { useState, useEffect, useMemo } from 'react';
import { X, Box, Cpu, FileText, Wrench, ChevronDown } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PortfolioCMS() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFromURL = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);

  // NEW STATE
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryFromURL) setActiveCategory(categoryFromURL);
  }, [categoryFromURL]);

  // Categories unchanged
  const categories = useMemo(() => ([
    { id: 'all', name: 'All Projects', icon: null },
    { id: '3d-modeling', name: '3D Modeling', icon: Box, color: 'from-blue-500 to-cyan-500' },
    { id: 'electronics', name: 'Electronics', icon: Cpu, color: 'from-purple-500 to-pink-500' },
    { id: 'documentation', name: 'Documentation', icon: FileText, color: 'from-orange-500 to-red-500' },
    { id: 'engineering', name: 'Engineering', icon: Wrench, color: 'from-green-500 to-emerald-500' }
  ]), []);

  // ---- CSV FETCH + PARSER ----
  useEffect(() => {
    const CSV_URL = import.meta.env.VITE_PROJECTS_CSV_URL;
    if (!CSV_URL) {
      setError('CSV URL missing. Set VITE_PROJECTS_CSV_URL in .env');
      setLoading(false);
      return;
    }

    
setLoading(true);
    Papa.parse(CSV_URL, {
      download: true,           // Papa will fetch the URL for you
      header: true,             // first row becomes keys
      skipEmptyLines: 'greedy', // ignore stray blank lines
      dynamicTyping: false,     // keep strings as strings
      worker: true,             // parse in a Web Worker (non-blocking)
      // encoding: 'utf-8',     // optional; Google CSV uses utf-8 by default
      complete: (results) => {
        // results.data is an array of objects keyed by header
        const rows = (results.data || []).filter(Boolean);

        const mapped = rows.map((row) => ({
          id: Number(row.id) || crypto.randomUUID(),
          category: (row.category || 'engineering').trim(),
          title: row.title || 'Untitled',
          subtitle: row.subtitle || '',
          description: row.description || '',
          image: row.image || 'https://picsum.photos/800/600?grayscale',
          fullDescription: row.fullDescription || '',
          // allow details to contain commas in cells by using semicolon as your separator in the sheet
          details: (row.details || '')
            .split(';')
            .map(s => s.trim())
            .filter(Boolean),
            
          // NEW
            videoUrl: row.videoUrl?.trim() || null,
            modelUrl: row.modelUrl?.trim() || null,

        }));

        setProjects(mapped);
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setError('Failed to parse CSV from Google Sheets.');
        setLoading(false);
      },
    });
  }, []);


  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  const toggleExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  // ------------Ytube url ---------------------

  
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    // Match typical YouTube formats
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);

    if (!match || !match[1]) return null;

    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };
  ``


  const renderProjects = () => {
    const elements = [];
    filteredProjects.forEach((project, index) => {
      elements.push({ type: 'card', project, index });
      if (expandedProject === project.id) {
        elements.push({ type: 'expanded', project });
      }
    });
    return elements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-lg border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => navigate('/')} className="text-cyan-400 hover:underline text-sm">
                ← Back to Home
              </button>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                My Projects
              </h1>
            </div>
            <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AM
            </div>
          </div>
        </div>
        {/* Category Tabs */}
        <div className="border-t border-slate-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => { setActiveCategory(category.id); setExpandedProject(null); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm
                      ${isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30'
                                 : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-600'}`}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading && <p className="text-gray-400">Loading projects…</p>}
        {error && !loading && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderProjects().map((element) => {
                if (element.type === 'expanded') {
                  const project = element.project;
                  return (
                    <div key={`expanded-${project.id}`} className="lg:col-span-2 w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-500 shadow-xl shadow-cyan-500/20">
                      <div className="relative h-96 overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        <button onClick={() => toggleExpand(project.id)} className="absolute top-4 right-4 p-3 bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-slate-900 transition-all hover:scale-110">
                          <X size={24} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-8">
                          <h2 className="text-4xl font-bold text-white mb-2">{project.title}</h2>
                        </div>
                      </div>
                      <div className="p-8">
                        {/* ---------------------------------------video section-------------------- */}
                        
                        
                        {/* Video Section */}
                        {project.videoUrl && (
                          <div className="mb-10">
                            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Project Video</h3>

                            {/* If YouTube */}
                            {getYouTubeEmbedUrl(project.videoUrl) ? (
                              <div className="relative w-full overflow-hidden rounded-xl pb-[56.25%] border border-slate-700 shadow-lg">
                                <iframe
                                  src={getYouTubeEmbedUrl(project.videoUrl)}
                                  title="YouTube video player"
                                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ) : (
                              // If MP4 or other video file
                              <video
                                controls
                                className="w-full rounded-xl border border-slate-700 shadow-lg"
                              >
                                <source src={project.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        )}



                        {/* -------------------------------------------- */}
                        

                        

                        
                        {project.modelUrl && (
                          <div className="mb-10">
                            <h3 className="text-2xl font-bold text-green-400 mb-4">3D Model Preview</h3>

                            <model-viewer
                              src={project.modelUrl}
                              alt="3D model"
                              camera-controls
                              auto-rotate
                              shadow-intensity="1"
                              className="w-full h-[500px] rounded-xl border border-slate-700 shadow-lg"
                            ></model-viewer>
                          </div>
                        )}


                        {/* --------------------------------------------------------------- */}

                        <p className="text-lg text-gray-300 leading-relaxed mb-6">{project.fullDescription}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {project.details.map((detail, idx) => (
                            <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                              <p className="text-cyan-400 font-semibold">{detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const project = element.project;
                  const isExpanded = expandedProject === project.id;
                  return (
                    <div key={project.id} className={`group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500 transition-all duration-500 ${isExpanded ? 'ring-2 ring-cyan-500' : 'hover:shadow-xl hover:shadow-cyan-500/20'}`}>
                      <div className="relative h-64 overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-cyan-400 font-semibold mb-2">{project.subtitle}</p>
                        <p className="text-gray-400 mb-6">{project.description}</p>
                        <button onClick={() => toggleExpand(project.id)} className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                          View
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No projects found in this category</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
