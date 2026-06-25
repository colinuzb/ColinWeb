import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Layers,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  ArrowRight,
  Play,
  Star,
  Quote,
  Menu,
  X,
  Youtube,
  Instagram,
  Github,
  Send,
} from 'lucide-react';
import BorderGlow from './components/BorderGlow';
import LaserFlow from './components/LaserFlow';

// Custom hook for intersection observer animations
function useIntersectionObserver(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}

// Custom hook for mouse parallax
function useMouseParallax(strength = 0.05) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) * strength;
      const y = (e.clientY - centerY) * strength;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  return { ref, offset };
}

const NAV_ITEMS = [
  { label: 'Imkoniyatlar', href: '#features' },
  { label: 'Biz haqimizda', href: '#about' },
  { label: 'Galereya', href: '#gallery' },
  { label: 'Fikrlar', href: '#testimonials' },
];

// Navigation component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-dark py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="ColinUzb" className="w-10 h-10 rounded-xl object-cover transform group-hover:scale-110 transition-transform duration-300" />
          <span className="font-display font-bold text-xl text-white">ColinUzb</span>
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-dark-300 hover:text-white transition-colors font-medium relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105">
            <a href="#features">Boshlash</a>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menyuni ochish"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-dark mt-4 mx-6 rounded-2xl p-6 animate-fade-in">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-3 text-dark-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button className="w-full mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold">
            <a href="#features">Boshlash</a>
          </button>
        </div>
      )}
    </nav>
  );
}

// Hero section with parallax + LaserFlow background
function HeroSection() {
  const { ref, offset } = useMouseParallax(0.02);
  const revealImgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    }
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950"
    >
      {/* LaserFlow animated background */}
      <div className="absolute inset-0 z-0">
        <LaserFlow
          horizontalBeamOffset={0.0}
          verticalBeamOffset={-0.05}
          color="#e11d48"
          fogIntensity={0.5}
          wispIntensity={5.0}
        />
      </div>

      {/* Portrait reveal effect tied to the laser beam */}
      <img
        ref={revealImgRef}
        src="/background.jpg"
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 -top-1/4 w-full z-[1] pointer-events-none select-none"
        style={{
          mixBlendMode: 'lighten',
          opacity: 0.35,
          // @ts-expect-error custom CSS vars
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay z-[2]" />

      {/* Hero content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center perspective-1000">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in"
          style={{ transform: `translateZ(50px) translateX(${offset.x * 0.5}px) translateY(${offset.y * 0.5}px)` }}
        >
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-dark-200 text-sm font-medium">Immersiv dizaynni kashf eting</span>
        </div>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight text-balance"
          style={{ transform: `translateZ(30px) translateX(${offset.x * 0.3}px) translateY(${offset.y * 0.3}px)` }}
        >
          Vebning
          <br />
          <span className="gradient-text">kelajagini his eting</span>
        </h1>

        <p
          className="text-dark-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-pretty"
          style={{ transform: `translateZ(20px) translateX(${offset.x * 0.2}px) translateY(${offset.y * 0.2}px)` }}
        >
          Raqamli tajribalarning yangi o&apos;lchamiga qadam qo&apos;ying. Biz e&apos;tiborni jalb
          qiladigan va ilhomlantiruvchi immersiv 3D parallaks veb-saytlar yaratamiz.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ transform: `translateZ(40px) translateX(${offset.x * 0.4}px) translateY(${offset.y * 0.4}px)` }}
        >
          <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            <a href="#testimonials">Sayohatni boshlang</a>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/8 transition-all duration-300 flex items-center gap-2">
            <Play className="w-5 h-5" />
            <a href="https://www.youtube.com/@colinuzb">Demoni ko&apos;rish</a>
          </button>
        </div>

        {/* Scroll indicator */}

      </div>
    </section>
  );
}

// Features section with BorderGlow cards
function FeaturesSection() {
  const { ref, isVisible } = useIntersectionObserver();

  const features = [
    {
      icon: Layers,
      title: 'Qatlamli chuqurlik',
      description: 'Ko\u2019p qatlamli parallaks effektlar kontentingizni jonlantiradigan ajoyib chuqurlik va o\u2019lcham yaratadi.',
      color: 'from-primary-500 to-primary-600',
      glow: '347 89% 50%',
      colors: ['#fb7185', '#e11d48', '#9f1239'],
    },
    {
      icon: Zap,
      title: 'Yashin tezligida',
      description: 'Silliq 60fps animatsiyalar va minimal JavaScript yuklamasi bilan unumdorlik uchun optimallashtirilgan.',
      color: 'from-accent-500 to-accent-600',
      glow: '240 5% 45%',
      colors: ['#a1a1aa', '#71717a', '#3f3f46'],
    },
    {
      icon: Shield,
      title: 'Piksel aniqligida',
      description: 'Har bir tafsilot barcha qurilmalar va ekran o\u2019lchamlarida vizual mukammallik uchun puxta ishlangan.',
      color: 'from-primary-400 to-accent-500',
      glow: '347 89% 50%',
      colors: ['#fb7185', '#e11d48', '#71717a'],
    },
    {
      icon: Globe,
      title: 'To\u2019liq moslashuvchan',
      description: 'Mobil telefonlardan tortib ultra-keng monitorlargacha har qanday ekranga uzluksiz moslashadi.',
      color: 'from-accent-400 to-primary-500',
      glow: '240 5% 45%',
      colors: ['#a1a1aa', '#71717a', '#e11d48'],
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-dark-950 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-20 ${isVisible ? 'reveal active' : 'reveal'}`}
        >
          <span className="text-primary-400 font-semibold tracking-wider uppercase text-sm">Imkoniyatlar</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 text-balance">
            Mukammallik uchun yaratilgan
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto text-pretty">
            Har bir element tengsiz foydalanuvchi tajribasini taqdim etish uchun maqsad va aniqlik bilan ishlab chiqilgan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`${isVisible ? 'reveal active' : 'reveal'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <BorderGlow
                className="group h-full"
                backgroundColor="#0d0d0d"
                borderRadius={24}
                glowColor={feature.glow}
                glowRadius={36}
                glowIntensity={1.1}
                coneSpread={28}
                colors={feature.colors}
              >
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-dark-400 leading-relaxed">{feature.description}</p>
                </div>
              </BorderGlow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About section with depth layers
function AboutSection() {
  const { ref, isVisible } = useIntersectionObserver();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePos({ x: x * 20, y: y * 20 });
  }, []);

  return (
    <section id="about" className="relative py-32 bg-gradient-to-b from-dark-950 to-dark-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-16 items-center ${isVisible ? 'reveal active' : 'reveal'}`}
        >
          {/* 3D Image composition */}
          <div
            ref={containerRef}
            className="relative perspective-1000"
            onMouseMove={handleMouseMove}
          >
            <div className="relative aspect-square">
              {/* Layer 4 - Back */}
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden transform-gpu"
                style={{
                  transform: `translateZ(-50px) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
                }}
              >
                <img
                  src="/logo.png"
                  alt="Orqa qatlam"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
              </div>

              {/* Layer 3 */}
              <div
                className="absolute inset-12 rounded-2xl overflow-hidden transform-gpu"
                style={{
                  transform: `translateZ(-25px) translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
                }}
              >
                <img
                  src="/logo.png"
                  alt="O'rta qatlam"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
              </div>

              {/* Layer 2 */}
              <div
                className="absolute inset-24 rounded-xl overflow-hidden transform-gpu depth-shadow"
                style={{
                  transform: `translateZ(0px) translate(${mousePos.x}px, ${mousePos.y}px)`,
                }}
              >
                <img
                  src="/logo.png"
                  alt="Oldingi qatlam"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating decorative elements */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-20 blur-2xl"
                style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="text-primary-400 font-semibold tracking-wider uppercase text-sm">Biz haqimizda</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-4 mb-6 text-balance">
                Raqamli dizaynda chegaralarni kengaytirish
              </h2>
            </div>

            <p className="text-dark-300 text-lg leading-relaxed">
              Biz raqamli va haqiqat o&apos;rtasidagi chegarani xiralashtiradigan immersiv veb-tajribalar
              yaratishga ixtisoslashganmiz. Innovatsiyalarga bo&apos;lgan ishtiyoqimiz bizni veb-dizaynda
              yangi sarhadlarni o&apos;rganishga, ilg&apos;or texnologiyalar va badiiy tasavvurni qo&apos;llashga undaydi.
            </p>

            <p className="text-dark-400 leading-relaxed">
              Har bir loyiha an&apos;analarga qarshi chiqish va g&apos;ayrioddiy narsa taqdim etish uchun imkoniyatdir.
              Biz ajoyib dizaynni nafaqat ko&apos;rish, balki his qilish kerak deb hisoblaymiz.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { value: '50+', label: 'Yetkazilgan loyihalar' },
                { value: '98%', label: 'Mijozlar mamnunligi' },
                { value: '15+', label: 'Dizayn mukofotlari' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-display font-bold gradient-text">{stat.value}</div>
                  <div className="text-dark-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <button className="group px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/8 transition-all duration-300 flex items-center gap-2 mt-4">
              <a href="https://t.me/colinuzb">Biz haqimizda batafsil</a>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Gallery section with hover parallax
function GallerySection() {
  const { ref, isVisible } = useIntersectionObserver();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const projects = [
    {
      image: 'https://i.pinimg.com/736x/4d/6c/10/4d6c10b14f950b5c5423773b44d753b3.jpg',
      title: 'Minecraft',
      category: 'Qum qutisi / Omon qolish',
    },
    {
      image: 'https://i.pinimg.com/1200x/7b/d0/d1/7bd0d19f321ed727f56c071daa231272.jpg',
      title: 'PUBG',
      category: 'Battle Royale',
    },
    {
      image: 'https://i.pinimg.com/1200x/f2/af/c4/f2afc465940cd95768227e15552c98be.jpg',
      title: 'GTA',
      category: 'Ochiq dunyo / Harakat',
    },
    {
      image: 'https://i.ytimg.com/vi/z1vz_Xtj3Us/maxresdefault.jpg?v=69edddda',
      title: 'Call of Duty',
      category: 'Birinchi shaxs otishmasi',
    },
  ];

  return (
    <section id="gallery" className="relative py-32 bg-dark-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}
        >
          <span className="text-primary-400 font-semibold tracking-wider uppercase text-sm">Portfolio</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 text-balance">
            So&apos;nggi ishlarimiz
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto text-pretty">
            Ishtiyoq va aniqlik bilan yaratilgan immersiv raqamli tajribalar to&apos;plamimiz bilan tanishing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer ${
                isVisible ? 'reveal active' : 'reveal'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    activeIndex === index ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>

              {/* Overlay gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent transition-opacity duration-500 ${
                activeIndex === index ? 'opacity-90' : 'opacity-70'
              }`} />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-primary-400 font-semibold text-sm">{project.category}</span>
                <h3 className="font-display text-2xl font-bold text-white mt-2">{project.title}</h3>

                {/* Animated underline */}
                <div className={`h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 mt-4 transition-all duration-500 ${
                  activeIndex === index ? 'w-24' : 'w-0'
                }`} />
              </div>

              {/* Corner accent */}
              <div className={`absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-500 ${
                activeIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}>
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials section
function TestimonialsSection() {
  const { ref, isVisible } = useIntersectionObserver();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Parallaks effektlar va tafsilotlarga e'tibor bizning kutganimizdan ham oshib ketdi. Yangi sayt ishga tushirilgandan so'ng konversiya darajamiz 40% ga oshdi.",
      author: "Marcos",
      role: "TechStart Inc. bosh direktori",
      avatar: "/logo.png",
      rating: 5,
    },
    {
      quote: "Ushbu jamoa bilan ishlash juda yoqimli edi. Ular bizning tasavvurimizni uzluksiz 3D animatsiyalar bilan ajoyib voqelikka aylantirdilar.",
      author: "Jova",
      role: "DesignLab asoschisi",
      avatar: "/logo.png",
      rating: 5,
    },
    {
      quote: "Ular erishgan chuqurlik va immersivlik hayratlanarli. Foydalanuvchilarimiz oldingi versiyaga qaraganda saytda ikki barobar ko'proq vaqt o'tkazishadi.",
      author: "Uz1 Games",
      role: "Creative Co. marketing direktori",
      avatar: "/logo.png",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="relative py-32 bg-dark-950 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}
        >
          <span className="text-primary-400 font-semibold tracking-wider uppercase text-sm">Fikrlar</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 text-balance">
            Qo'llayotganlar nima deydi
          </h2>
        </div>

        <div className={`relative ${isVisible ? 'reveal-scale active' : 'reveal-scale'}`}>
          {/* Quote icon */}
          <div className="absolute -top-6 -left-2 text-primary-500/20">
            <Quote className="w-24 h-24" />
          </div>

          {/* Testimonial card */}
          <div className="relative glass rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].author}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-500/30"
              />
              <div>
                <div className="font-display font-bold text-white text-lg">
                  {testimonials[activeTestimonial].author}
                </div>
                <div className="text-dark-400">
                  {testimonials[activeTestimonial].role}
                </div>
              </div>
              <div className="flex gap-1 md:ml-auto">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary-400 fill-primary-400" />
                ))}
              </div>
            </div>

            <blockquote className="text-dark-200 text-lg md:text-xl leading-relaxed">
              &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
            </blockquote>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Fikr ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 w-8'
                    : 'bg-dark-600 hover:bg-dark-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA section
function CTASection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="relative py-32 bg-gradient-to-b from-dark-950 to-dark-900 overflow-hidden">
      <div className="absolute inset-0 hero-mesh opacity-50" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center ${isVisible ? 'reveal active' : 'reveal'}`}
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Raqamli mavjudligingizni
            <br />
            <span className="gradient-text">o&apos;zgartirishga tayyormisiz?</span>
          </h2>
          <p className="text-dark-300 text-lg mb-10 max-w-2xl mx-auto text-pretty">
            Auditoriyangizni o&apos;ziga jalb qiladigan va sizni raqobatchilardan ajratib turadigan immersiv tajriba yarataylik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group px-10 py-5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              <a href="https://t.me/colinuzb">Loyihangizni boshlang</a>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 rounded-full glass text-white font-semibold text-lg hover:bg-white/8 transition-all duration-300">
              <a href="https://t.me/colinwb">Bog&apos;lanish</a>
            </button>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/6 w-4 h-4 rounded-full bg-primary-500/30 animate-float" />
      <div className="absolute top-1/3 right-1/5 w-6 h-6 rounded-full bg-accent-500/20 animate-float-delayed" />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-primary-400/40 animate-pulse-slow" />
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="relative py-16 bg-dark-900 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="ColinUzb" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-xl text-white">ColinUzb</span>
            </a>
            <p className="text-dark-400 max-w-sm">
              Veb-dizayn chegaralarini kengaytiradigan immersiv raqamli tajribalar yaratamiz.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Navigatsiya</h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-dark-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Ijtimoiy tarmoqlar</h4>
            <ul className="space-y-3">
              {[
                { label: 'YouTube', href: 'https://www.youtube.com/@colinuzb', icon: Youtube },
                { label: 'Instagram', href: 'https://www.instagram.com/colinuzb', icon: Instagram },
                { label: 'Telegram', href: 'https://t.me/colinuzb', icon: Send },
                { label: 'GitHub', href: 'https://github.com/colinuzb', icon: Github },
              ].map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors group"
                  >
                    <Icon className="w-4 h-4 group-hover:text-primary-400 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            © 2026 ColinUzb. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-dark-500 hover:text-white text-sm transition-colors">Maxfiylik siyosati</a>
            <a href="#" className="text-dark-500 hover:text-white text-sm transition-colors">Foydalanish shartlari</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App
function App() {
  return (
    <div className="relative bg-dark-950 overflow-hidden">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;
