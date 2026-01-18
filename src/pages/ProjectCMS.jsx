import React, { useState } from 'react';
import { X, Box, Cpu, FileText, Wrench, ChevronDown, ChevronUp } from 'lucide-react';

// openaicode
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export default function PortfolioCMS() {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const categoryFromURL = searchParams.get('category');


  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    if (categoryFromURL) {
      setActiveCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

  const categories = [
    { id: 'all', name: 'All Projects', icon: null },
    { id: '3d-modeling', name: '3D Modeling', icon: Box, color: 'from-blue-500 to-cyan-500' },
    { id: 'electronics', name: 'Electronics', icon: Cpu, color: 'from-purple-500 to-pink-500' },
    { id: 'documentation', name: 'Documentation', icon: FileText, color: 'from-orange-500 to-red-500' },
    { id: 'engineering', name: 'Engineering', icon: Wrench, color: 'from-green-500 to-emerald-500' }
  ];

  const projects = [
    {
      id: 1,
      category: '3d-modeling',
      title: 'Advanced Robotic Arm',
      subtitle: 'JD Modeling',
      description: 'Auymeetic Add designe and regimacal, asserntics',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel viverra erat, id ornare mauris. Vivamus placerat sapien non commodo iaculis. Aliquam erat volutpat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      details: ['CAD Software: SolidWorks', 'Completion: December 2023']
    },
    {
      id: 2,
      category: '3d-modeling',
      title: 'Mechanical Assembly Design',
      subtitle: 'Complex Systems',
      description: 'Multi-part assembly with precision engineering',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
      fullDescription: 'Comprehensive mechanical assembly featuring advanced CAD techniques and precision manufacturing specifications. This project demonstrates expertise in complex multi-part systems and engineering optimization.',
      details: ['Parts: 47 components', 'Software: Fusion 360', 'Tolerances: ISO 2768-m']
    },
    {
      id: 3,
      category: 'electronics',
      title: 'IoT Sensor Network',
      subtitle: 'Eleeconec',
      description: 'FUB lgynns and leections system designs',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
      fullDescription: 'Distributed sensor network utilizing ESP32 microcontrollers for real-time environmental monitoring. Features low-power design, wireless communication, and cloud integration for data analytics.',
      details: ['Microcontroller: ESP32', 'Sensors: 12 nodes', 'Power: Solar + Battery', 'Range: 500m']
    },
    {
      id: 4,
      category: 'electronics',
      title: 'Power Supply Unit',
      subtitle: 'Circuit Design',
      description: 'High-efficiency switching power supply',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
      fullDescription: 'Custom-designed switching power supply with 95% efficiency, featuring advanced thermal management and protection circuits. Designed for industrial applications requiring high reliability.',
      details: ['Output: 24V, 10A', 'Efficiency: 95%', 'Protection: OVP, OCP, OTP', 'PCB: 4-layer design']
    },
    {
      id: 5,
      category: 'documentation',
      title: 'Engineering Standards Manual',
      subtitle: 'Doointerledion',
      description: 'Toinmual decumentation and anabolscreens',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      fullDescription: 'Comprehensive technical documentation establishing engineering standards and best practices. Includes detailed specifications, testing procedures, and quality assurance protocols for manufacturing processes.',
      details: ['Pages: 247', 'Standards: ISO 9001', 'Revisions: Quarterly', 'Format: PDF + Interactive']
    },
    {
      id: 6,
      category: 'documentation',
      title: 'Project Analysis Report',
      subtitle: 'Technical Analysis',
      description: 'Detailed feasibility and performance analysis',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      fullDescription: 'In-depth analysis of project feasibility, cost-benefit evaluation, and performance metrics. Includes risk assessment, timeline projections, and resource allocation recommendations.',
      details: ['Sections: 8 chapters', 'Graphs: 34 visualizations', 'Data Points: 1,200+', 'Duration: 6 months study']
    },
    {
      id: 7,
      category: 'engineering',
      title: 'Automated Sorting System',
      subtitle: 'Enorreuing',
      description: 'Tram reneeet to working plololyse',
      image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop',
      fullDescription: 'Fully automated sorting and categorization system utilizing computer vision and pneumatic actuators. Processes up to 100 items per minute with 99.7% accuracy.',
      details: ['Throughput: 100 items/min', 'Accuracy: 99.7%', 'Vision: OpenCV', 'Actuators: 6 pneumatic']
    },
    {
      id: 8,
      category: 'engineering',
      title: 'Hydraulic Test Rig',
      subtitle: 'Prototype Testing',
      description: 'Custom test bench for component validation',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
      fullDescription: 'Purpose-built hydraulic testing apparatus for validating component performance under various pressure and flow conditions. Features real-time data acquisition and automated test sequences.',
      details: ['Pressure: 0-350 bar', 'Flow: 0-100 L/min', 'Sensors: 16 channels', 'Control: PLC-based']
    }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const toggleExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  // Organize projects with expansion logic - works for both mobile and desktop
  const renderProjects = () => {
    const elements = [];
    
    filteredProjects.forEach((project, index) => {
      // Add the project card
      elements.push({ type: 'card', project: project, index: index });
      
      // If this project is expanded, add expansion panel right after it
      if (expandedProject === project.id) {
        elements.push({ type: 'expanded', project: project });
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
              <button
                onClick={() => navigate('/')}
                className="text-cyan-400 hover:underline text-sm"
              >
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
        
        {/* Category Tabs - Scrollable on mobile */}
        <div className="border-t border-slate-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setExpandedProject(null);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm
                      ${isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30' 
                        : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-600'
                      }
                    `}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderProjects().map((element, idx) => {
            if (element.type === 'expanded') {
              const project = element.project;
              return (
                <div
                  key={`expanded-${project.id}`}
                  className="lg:col-span-2 w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-500 shadow-xl shadow-cyan-500/20 animate-in fade-in slide-in-from-top-4 duration-500"
                >
                  <div className="relative h-96 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="absolute top-4 right-4 p-3 bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-slate-900 transition-all hover:scale-110"
                    >
                      <X size={24} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-8">
                      <h2 className="text-4xl font-bold text-white mb-2">{project.title}</h2>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                      {project.fullDescription}
                    </p>
                    
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
              // Normal project card
              const project = element.project;
              const isExpanded = expandedProject === project.id;
              return (
                <div
                  key={project.id}
                  className={`
                    group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 
                    hover:border-cyan-500 transition-all duration-500
                    ${isExpanded ? 'ring-2 ring-cyan-500' : 'hover:shadow-xl hover:shadow-cyan-500/20'}
                  `}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
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
                    
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
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
      </main>
    </div>
  );
}