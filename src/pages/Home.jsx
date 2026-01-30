import React, { useState, useEffect } from 'react';
import { Menu, X, Mail, Github, Linkedin, Download, ChevronDown, Wrench, Cpu, Box, FileText, Send, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');


  /* 🔹 CATEGORY → URL MAPPING (CONNECTS TO ProjectCMS.jsx) */
  const categoryMap = {
    '3D Modelling': '3d-modeling',
    Electronics: 'electronics',
    Documentation: 'documentation',
    Website: 'website'
  };



  // email error handling 
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // email error handling 
  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };


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

  const projects = [
    {
      title: '3D Mechanical Design',
      category: '3D Modelling',
      icon: Box,
      description: 'Advanced CAD designs and mechanical assemblies',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Circuit Design',
      category: 'Electronics',
      icon: Cpu,
      description: 'PCB layouts and electronic system designs',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Engineering Reports',
      category: 'Documentation',
      icon: FileText,
      description: 'Technical documentation and analysis reports',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Websites',
      category: 'Website',
      icon: Globe,
      description: 'Modern, responsive websites and web apps',
      color: 'from-indigo-500 to-purple-500'
    }

  ];

  const skills = [
    { name: 'CAD/CAM', level: 90 },
    { name: 'Circuit Design', level: 85 },
    { name: '3D Modelling', level: 92 },
    { name: 'Technical Writing', level: 88 },
    { name: 'Prototyping', level: 80 },
    { name: 'Problem Solving', level: 95 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      {/* NAVIGATION */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AM
            </div>

            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'projects', 'skills', 'contact'].map(item => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize ${
                    activeSection === item
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {['home', 'about', 'projects', 'skills', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-4 py-2 capitalize hover:bg-slate-800 rounded transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
          <div className="text-center">
            {/* Profile Image Placeholder */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-4xl sm:text-5xl font-bold">
                AM
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Arham Mobarat
              </span>
            </h1>

            <div className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-6 space-y-2">
              <p className="flex items-center justify-center flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-slate-800/50 rounded-full text-sm sm:text-base">
                  BSc Mechanical Engineering Technology
                </span>
              </p>
              <p className="text-cyan-400 font-semibold">University of Greenwich • Year 2</p>
            </div>

            <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
              Aspiring engineer passionate about building anything and everything. 
              Turning ideas into reality through design, innovation, and problem-solving.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan-500 rounded-full font-semibold hover:bg-cyan-500/10 transition-all"
              >
                Get In Touch
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 sm:gap-6 mt-8 sm:mt-12">
              <a href="#" className="p-2 sm:p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                <Github size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a href="https://www.linkedin.com/in/arham-mobarat-63a47334a/" className="p-2 sm:p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" target ="blank">
                <Linkedin size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a
                href="mailto:arhammob566@gmail.com?subject=Portfolio%20Contact&body=Hi%20Arham,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20get%20in%20touch."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
                title="Email me directly"
              >
                <Mail size={20} className="sm:w-6 sm:h-6" />
              </a>

            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown size={32} className="text-cyan-400" />
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12">
            About <span className="text-cyan-400">Me</span>
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
              I'm a second-year Mechanical Engineering Technology student at University of Greenwich, 
              driven by a passion for creating innovative solutions to real-world problems.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              My journey in engineering combines theoretical knowledge with hands-on experience in 
              3D modelling, circuit design, and Website Development. I believe in the power of 
              engineering to transform ideas into tangible solutions that make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS (CONNECTED TO CMS)
      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            My <span className="text-cyan-400">Projects</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/projects?category=${categoryMap[project.category]}`)
                  }
                  className="cursor-pointer bg-slate-800/50 rounded-xl p-6 hover:scale-105 transition-all border border-slate-700 hover:border-cyan-500"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center mb-4`}>
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-cyan-400 text-sm">{project.category}</p>
                  <p className="text-gray-400 mt-2">{project.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Projects Section */}
      <section id="projects" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12">
            My <span className="text-cyan-400">Projects</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/projects?category=${categoryMap[project.category]}`)
                  }
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border border-slate-700 hover:border-cyan-500"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                    <Icon size={24} className="sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-cyan-400 mb-2">{project.category}</p>
                  <p className="text-sm sm:text-base text-gray-400">{project.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 sm:py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12">
            My <span className="text-cyan-400">Skills</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-base sm:text-lg font-semibold">{skill.name}</span>
                  <span className="text-cyan-400">{skill.level}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                {/* ----------------------------- */}
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
                {/* -------------------------------- */}
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                />
                {/* ----------------------------- */}
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
                {/* -------------------------------- */}
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
              />
              {/* ----------------------------- */}
              {errors.subject && (
                <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
              )}
              {/* -------------------------------- */}
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="6"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors resize-none"
              ></textarea>
              {/* ----------------------------- */}
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">{errors.message}</p>
              )}
              {/* -------------------------------- */}
              
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
