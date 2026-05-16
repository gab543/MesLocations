import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import './index.css';
import './App.css';

const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`fade-in-section ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Simulator = () => {
  const [properties, setProperties] = useState(50);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let current = 50;
        const target = 5;
        
        const timer = setInterval(() => {
          current -= (current - target) * 0.1;
          if (current - target < 0.5) {
            setProperties(target);
            clearInterval(timer);
          } else {
            setProperties(Math.round(current));
          }
        }, 30);
      }
    }, { threshold: 0.5 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasAnimated]);
  
  const calculatePrice = (num) => {
    if (num <= 2) return 19; 
    if (num <= 10) return 49; 
    if (num <= 20) return 89;
    return 149; 
  };

  const getProfile = (num) => {
    if (num <= 2) return "Investisseur Débutant";
    if (num <= 10) return "Propriétaire Averti";
    if (num <= 20) return "Rentier Confirmé";
    return "Gestionnaire Pro";
  };

  return (
    <div className="simulator-container" ref={containerRef}>
      <h2 className="section-title simulator-title">Estimez votre investissement</h2>
      <p className="simulator-subtitle">
        Une tarification transparente qui évolue avec votre patrimoine.
      </p>
      
      <div className="simulator-profile-container">
        <span className="simulator-profile-label">Profil : </span>
        <span className="simulator-profile-value">
          {getProfile(properties)}
        </span>
      </div>

      <div className="simulator-count">
        Je gère <strong>{properties}</strong> bien{properties > 1 ? 's' : ''} immobilier{properties > 1 ? 's' : ''}
      </div>

      <div className="slider-wrapper">
        <input 
          type="range" 
          min="1" 
          max="50" 
          value={properties} 
          onChange={(e) => setProperties(parseInt(e.target.value))}
          className="slider" 
        />
        <div className="simulator-slider-labels">
          <span>1 bien</span>
          <span>50+ biens</span>
        </div>
      </div>

      <div className="sim-result">
        <div className="sim-price">
          {calculatePrice(properties)}€
        </div>
        <div className="sim-price-sub">par mois, facturé annuellement</div>
      </div>
    </div>
  );
};

const ANIMATED_WORDS = ["immobilière.", "sereine.", "automatisée.", "rentable."];

function LandingPage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ANIMATED_WORDS.length);
        setFade(true);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* NAVIGATION BAR */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <a href="#" className="nav-brand">Mes Locations.</a>
          <div className="nav-links">
            <a href="#presentation" className="nav-link">Le concept</a>
            <a href="#features" className="nav-link">Fonctionnalités</a>
            <a href="#simulator" className="nav-link">Simulateur</a>
            <a href="#pricing" className="nav-link">Tarifs</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              aria-label={theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre"}
              title={theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre"}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-primary btn-nav">Espace Client</button>
          </div>
        </nav>
      </div>

      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-logo">
          Mes Locations.
        </div>
        
        <h1 className="hero-title">
          L'art de la gestion<br />
          <span className={`accent-text word-rotate ${fade ? 'visible' : 'hidden'}`}>
            {ANIMATED_WORDS[wordIndex]}
          </span>
        </h1>
        
        <p className="hero-description">
          Une plateforme élégante et robuste pour superviser votre patrimoine. Suivi des flux financiers, automatisation des quittances et centralisation documentaire.
        </p>
        
        <div className="hero-actions">
          <button className="btn btn-primary">
            Démarrer l'expérience
          </button>
          <button className="btn btn-outline">
            Découvrir l'approche
          </button>
        </div>
      </section>

      {/* 2. PRESENTATION PRODUIT (Split Screen Design) */}
      <section id="presentation" className="section-padding presentation-section">
        <FadeInSection>
        <div className="presentation-container">
          <div className="presentation-content">
            <h2 className="section-title presentation-title">Le centre névralgique de votre patrimoine.</h2>
            <p className="presentation-desc">
              Mes Locations centralise absolument tout ce dont vous avez besoin. Fini les dossiers papiers éparpillés et les relances manuelles des retards de paiement.
            </p>
            <ul className="presentation-list">
              <li className="presentation-list-item">
                <span className="presentation-dot"></span>
                <strong>Indépendance totale :</strong> Vous êtes seul maître à bord, sans intermédiaire.
              </li>
              <li className="presentation-list-item">
                <span className="presentation-dot"></span>
                <strong>Zéro papier :</strong> Tous vos baux sont signés et archivés numériquement.
              </li>
              <li className="presentation-list-item">
                <span className="presentation-dot"></span>
                <strong>Trésorerie anticipée :</strong> Un tableau de bord financier qui prévoit vos charges.
              </li>
            </ul>
          </div>
          <div className="dashboard-mockup">
            {/* Fausse interface de "Dashboard" minimaliste */}
            <div className="dashboard-row dashboard-row-bordered">
              <span className="dashboard-label-accent">Taux d'occupation</span>
              <span className="text-success">100%</span>
            </div>
            <div className="dashboard-row">
              <span className="dashboard-label-muted">Loyers perçus (Ce mois)</span>
              <span>4 850 €</span>
            </div>
            <div className="dashboard-row" style={{ marginBottom: '2rem' }}>
              <span className="dashboard-label-muted">En attente</span>
              <span className="text-warning">0 €</span>
            </div>
            <button className="btn btn-outline btn-full-sm">Voir le rapport complet</button>
          </div>
        </div>
        </FadeInSection>
      </section>

      {/* 3. BENTO FEATURES SECTION */}
      <section id="features" className="section-padding section-bg-alt">
        <FadeInSection>
        <h2 className="section-title">La quintessence du contrôle.</h2>
        <p className="section-subtitle">
          Abandonnez les outils disparates. Nous avons réuni l'essentiel dans une interface conçue pour la clarté et l'efficacité.
        </p>
        </FadeInSection>

        <div className="bento-grid">
          {/* Large Item: Rapprochement bancaire */}
          <FadeInSection className="bento-item bento-large" delay={0}>
            <h3 className="bento-title">Synchronisation Bancaire</h3>
            <p className="bento-desc">Connectez vos comptes de manière sécurisée. Notre algorithme réconcilie automatiquement les loyers perçus avec vos baux actifs.</p>
            
            <div className="bento-ui-wrapper">
              <div className="mock-invoice mock-invoice-success">
                <div>
                  <div className="mock-title">Virement reçu : Loyer Dupont</div>
                  <div className="mock-subtitle">Appartement 12B - Paris</div>
                </div>
                <div className="mock-amount-success">+ 1 250 €</div>
              </div>
              <div className="mock-invoice mock-invoice-warning">
                <div>
                  <div className="mock-title">En attente : Loyer Martin</div>
                  <div className="mock-subtitle">Studio 4 - Lyon</div>
                </div>
                <div className="mock-amount-warning">800 €</div>
              </div>
            </div>
          </FadeInSection>

          {/* Small Item 1: Quittances */}
          <FadeInSection className="bento-item" delay={100}>
            <h3 className="bento-title">Quittances</h3>
            <p className="bento-desc">Émission et envoi automatiques dès réception du paiement.</p>
            <div className="bento-ui-wrapper">
               <div className="mock-pdf-badge">
                  Document PDF généré
               </div>
            </div>
          </FadeInSection>

          {/* Small Item 2: Rentabilité */}
          <FadeInSection className="bento-item" delay={200}>
            <h3 className="bento-title">Rentabilité</h3>
            <p className="bento-desc">Visualisez votre cash-flow net en un coup d'œil.</p>
            <div className="bento-ui-wrapper">
              <div className="mock-chart-bar"><div className="mock-chart-fill" style={{ width: '85%' }}></div></div>
              <div className="mock-chart-bar"><div className="mock-chart-fill fill-muted" style={{ width: '60%' }}></div></div>
              <div className="mock-chart-bar"><div className="mock-chart-fill fill-muted" style={{ width: '40%' }}></div></div>
            </div>
          </FadeInSection>

          {/* Wide Item: Documents */}
          <FadeInSection className="bento-item bento-wide" delay={300}>
            <h3 className="bento-title">Coffre-fort Numérique</h3>
            <p className="bento-desc">Baux, diagnostics, états des lieux : l'intégralité de la vie de vos biens immobiliers est sécurisée et accessible instantanément.</p>
            <div className="bento-ui-wrapper mock-docs-container">
               <div className="mock-invoice mock-doc-item">Bail_Dupont_Signe.pdf</div>
               <div className="mock-invoice mock-doc-item">DPE_Appartement12.pdf</div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 4. INTERACTIVE SIMULATOR SECTION */}
      <section id="simulator" className="section-padding simulator-wrapper">
        <FadeInSection>
        <Simulator />
        </FadeInSection>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="section-padding section-border-top">
        <FadeInSection>
        <h2 className="section-title">Investissez dans votre sérénité.</h2>
        <p className="section-subtitle">
          Une tarification lisible, pensée pour les professionnels de l'immobilier.
        </p>
        </FadeInSection>

        <div className="pricing-grid">
          {/* Plan 1 */}
          <FadeInSection className="pricing-card" delay={0}>
            <h3 className="price-tier">L'Essentiel</h3>
            <p className="price-desc">Pour les patrimoines en développement.</p>
            <div className="price-amount">19€ <span>/ mois</span></div>
            <ul className="price-features">
              <li><div className="feature-dot"></div> Gestion jusqu'à 5 lots</li>
              <li><div className="feature-dot"></div> Rapprochement bancaire manuel</li>
              <li><div className="feature-dot"></div> Génération de quittances</li>
              <li><div className="feature-dot"></div> Support standard</li>
            </ul>
            <button className="btn btn-outline btn-full">Sélectionner</button>
          </FadeInSection>

          {/* Plan 2 */}
          <FadeInSection className="pricing-card premium" delay={150}>
            <h3 className="price-tier">Le Privilège</h3>
            <p className="price-desc">Pour une automatisation intégrale.</p>
            <div className="price-amount">49€ <span>/ mois</span></div>
            <ul className="price-features">
              <li><div className="feature-dot"></div> Nombre de lots illimité</li>
              <li><div className="feature-dot"></div> Synchronisation bancaire automatique</li>
              <li><div className="feature-dot"></div> Envoi automatique des quittances</li>
              <li><div className="feature-dot"></div> Aide à la déclaration fiscale</li>
            </ul>
            <button className="btn btn-primary btn-full">Sélectionner</button>
          </FadeInSection>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="footer">
        <div className="footer-logo-centered">
          Mes Locations.
        </div>
        <p className="footer-text">
          L'excellence en gestion locative.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
