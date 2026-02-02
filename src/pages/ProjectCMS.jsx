
// src/pages/ProjectCMS.jsx
import Papa from 'papaparse';
import React, { useState, useEffect, useMemo } from 'react';
import { X, Box, Cpu, FileText, Wrench, ChevronDown, Send, Globe} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


export default function PortfolioCMS() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFromURL = searchParams.get('category');


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);

  const [errors, setErrors] = useState({});

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
    { id: 'website', name: 'Website', icon: Globe, color: 'from-indigo-500 to-purple-500' }
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

          // new part of the img and p 
          blocks: [
            row.img1 && { type: 'image', value: row.img1 },
            row.p1 && { type: 'text', value: row.p1 },
            row.img2 && { type: 'image', value: row.img2 },
            row.p2 && { type: 'text', value: row.p2 },
            row.img3 && { type: 'image', value: row.img3 },
            row.p3 && { type: 'text', value: row.p3 },
            row.img4 && { type: 'image', value: row.img4 },
            row.p4 && { type: 'text', value: row.p4 },
            row.img5 && { type: 'image', value: row.img5 },
            row.p5 && { type: 'text', value: row.p5 },
            row.code1 && { type: 'code', value: row.code1, language: row.code1Lang || 'javascript'},  
            row.code2 && { type: 'code', value: row.code2, language: row.code2Lang || 'javascript'},
          ].filter(Boolean)


        }));
        const reversed = mapped.reverse();
        setProjects(reversed);
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setError('Failed to parse CSV from Google Sheets.');
        setLoading(false);
      },
    });
  }, []);

  // ----------------------------------------------

  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };
// ----------------------------------------------------
  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};

    // Check empty fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    // Check Gmail validity
    if (formData.email && !isValidGmail(formData.email)) {
      newErrors.email = 'Please enter a valid Gmail address';
    }

    // If there are errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and continue
    setErrors({});
    setFormStatus('sending');


    try {
      const response = await fetch(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            service_id: 'service_zbqgrk8',
            template_id: 'template_e5xhmtb',
            user_id: 'AgRIIQTGiGlh_8A8s',
            template_params: {
              from_name: formData.name,
              from_email: formData.email,
              subject: formData.subject,
              message: formData.message
            }
          })
        }
      );

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormStatus(''), 3000);
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  // --------------------------------------------------

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
  

  const copyCodeToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    } catch {
      alert('Failed to copy code');
    }
  };


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

                        <p className="text-lg text-gray-300 leading-relaxed mb-6">{project.fullDescription}</p>
                        {/* ------------------------------Code Block for the image and paragraphs--------------------------------- */}
                        {project.blocks.map((block, i) => {
                          if (block.type === 'image') {
                            return (
                              <img
                                key={i}
                                src={block.value}
                                className="w-full rounded-lg mb-6"
                              />
                            );
                          }

                          if (block.type === 'text') {
                            return (
                              <p
                                key={i}
                                className="text-gray-300 text-lg mb-6 leading-relaxed"
                              >
                                {block.value}
                              </p>
                            );
                          }

                          if (block.type === 'code') {
                            return (
                              <div
                                key={i}
                                className="mb-8 rounded-xl overflow-hidden border border-slate-700 bg-slate-900"
                              >
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                  <span className="text-sm font-mono text-cyan-400">
                                    {block.language}
                                  </span>

                                  <button
                                    onClick={() => copyCodeToClipboard(block.value)}
                                    className="text-sm px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition text-gray-200"
                                  >
                                    Copy
                                  </button>
                                </div>

                                {/* Scrollable code area */}
                                <div
                                  style={{
                                    maxHeight: '420px',   // 👈 LIMIT HEIGHT (~27 lines)
                                    overflowY: 'auto'
                                  }}
                                >
                                  <SyntaxHighlighter
                                    language={block.language}
                                    style={oneDark}
                                    showLineNumbers
                                    customStyle={{
                                      margin: 0,
                                      background: 'transparent',
                                      fontSize: '0.9rem',
                                      lineHeight: '1.4'
                                    }}
                                  >
                                    {block.value}
                                  </SyntaxHighlighter>
                                </div>
                              </div>
                            );
                          }


                          return null;
                        })}


                        
                        {/* --------------------------------------------------------------- */}



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

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12">
            Get In <span className="text-cyan-400">Touch</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}

                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}

              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
              />
              {errors.subject && (
                <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
              )}

              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="6"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors resize-none"
              ></textarea>
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">{errors.message}</p>
              )}

              {formStatus === 'success' && (
                <p className="text-green-400 text-center">Message sent successfully!</p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-400 text-center">Failed to send. Please configure EmailJS.</p>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={
                  formStatus === 'sending' ||
                  !formData.name ||
                  !formData.email ||
                  !formData.subject ||
                  !formData.message
                }

                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-6">
              {/* Note: To activate the contact form, replace the EmailJS credentials in the code with your own. */}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-400 border-t border-slate-800">
        © 2026 Arham Mobarat
      </footer>

    </div>
  );
}
