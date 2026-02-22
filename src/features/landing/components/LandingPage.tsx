// ============================================================
// LandingPage - Migré en TypeScript
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="landing-page">
      <header>
        <div className="container">
          <nav>
            <div className="logo">
              <div className="logo-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              LAMASSE <span>DAMA</span>
            </div>
            <div className="nav-links">
              <a href="#features">Fonctionnalités</a>
              <a href="#problems">Problématiques</a>
              <a href="#about">À propos</a>
              <a href="#contact">Contact</a>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Connexion
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1>Révolutionnez la gestion des soins de santé</h1>
            <p>
              Une plateforme sécurisée et innovante pour connecter patients, médecins et pharmaciens.
              Optimisez la continuité des soins grâce à l'IA et à la collaboration en temps réel.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Démarrer maintenant
              </button>
              <a href="#features" className="btn btn-outline">
                Découvrir les fonctionnalités
              </a>
            </div>
          </div>
          <div className="hero-image fade-in-delay-1">
            <div className="dashboard-preview">
              <div className="dashboard-header"></div>
              <div className="dashboard-sidebar">
                <div className="sidebar-icon"><i className="fas fa-user-md"></i></div>
                <div className="sidebar-icon"><i className="fas fa-file-medical"></i></div>
                <div className="sidebar-icon"><i className="fas fa-comments"></i></div>
                <div className="sidebar-icon"><i className="fas fa-prescription"></i></div>
              </div>
              <div className="dashboard-content">
                <div className="content-header"></div>
                <div className="content-cards">
                  <div className="content-card"></div>
                  <div className="content-card"></div>
                  <div className="content-card"></div>
                  <div className="content-card"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-title fade-in">
            <h2>Fonctionnalités principales</h2>
            <p>Découvrez comment LAMESSE DAMA transforme l'expérience des soins de santé pour tous les acteurs du système</p>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-in-delay-1">
              <div className="feature-icon"><i className="fas fa-user-md"></i></div>
              <h3>Pour les médecins</h3>
              <p>Diagnostic assisté par IA, collaboration entre experts, accès sécurisé aux dossiers patients, création d'examens et ordonnances avec QR code.</p>
            </div>
            <div className="feature-card fade-in-delay-1">
              <div className="feature-icon"><i className="fas fa-user-injured"></i></div>
              <h3>Pour les patients</h3>
              <p>Consulter son dossier médical, chatbot simplifié, état de santé prédictif, autoriser l'accès aux médecins, vérifier les ordonnances QR.</p>
            </div>
            <div className="feature-card fade-in-delay-2">
              <div className="feature-icon"><i className="fas fa-prescription-bottle-alt"></i></div>
              <h3>Pour les pharmaciens</h3>
              <p>Lire les ordonnances QR, vérifier les médicaments, mettre à jour le stock en ligne, intégration avec les systèmes de gestion.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="problems" className="problems">
        <div className="container">
          <div className="section-title fade-in">
            <h2>Défis du système de santé</h2>
            <p>LAMESSE DAMA répond aux problématiques critiques identifiées dans le système actuel</p>
          </div>
          <div className="problem-list">
            <div className="problem-item fade-in-delay-1">
              <div className="problem-icon"><i className="fas fa-shield-alt"></i></div>
              <div className="problem-content">
                <h3>Manque d'interopérabilité et de sécurité</h3>
                <p>Les dossiers médicaux fragmentés et non sécurisés freinent la continuité des soins. Notre plateforme assure un cryptage de haute sécurité avec un partage contrôlé entre professionnels autorisés.</p>
              </div>
            </div>
            <div className="problem-item fade-in-delay-1">
              <div className="problem-icon"><i className="fas fa-users-slash"></i></div>
              <div className="problem-content">
                <h3>Accès inégal aux soins</h3>
                <p>De nombreux patients non couverts n'ont pas accès à des soins abordables et de qualité. Nos outils de télémédecine rendent les soins accessibles à distance.</p>
              </div>
            </div>
            <div className="problem-item fade-in-delay-2">
              <div className="problem-icon"><i className="fas fa-hospital-alt"></i></div>
              <div className="problem-content">
                <h3>Surcharge des établissements</h3>
                <p>Les hôpitaux sont régulièrement débordés faute d'outils de triage et d'orientation efficaces. Notre système d'orientation intelligent optimise les ressources.</p>
              </div>
            </div>
            <div className="problem-item fade-in-delay-2">
              <div className="problem-icon"><i className="fas fa-clock"></i></div>
              <div className="problem-content">
                <h3>Retards dans les diagnostics</h3>
                <p>Les retards et imprécisions dans le diagnostic mettent en danger la prise en charge des patients. L'IA radiologique améliore la rapidité et précision des diagnostics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="fade-in">Prêt à transformer l'expérience des soins de santé ?</h2>
          <p className="fade-in-delay-1">Rejoignez la révolution LAMESSE DAMA et bénéficiez d'une plateforme sécurisée, intuitive et collaborative.</p>
          <div className="cta-buttons fade-in-delay-2">
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>S'inscrire maintenant</button>
            <a href="#contact" className="btn btn-outline">Nous contacter</a>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-logo">LAMESSE <span>DAMA</span></div>
              <p>Révolutionner les soins de santé par la technologie et la collaboration.</p>
            </div>
            <div>
              <h4>Liens rapides</h4>
              <div className="footer-links">
                <a href="#features">Fonctionnalités</a>
                <a href="#problems">Problématiques</a>
                <a href="#about">À propos</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
            <div>
              <h4>Contact</h4>
              <div className="footer-links">
                <a href="mailto:contact@mediconnect.com">contact@mediconnect.com</a>
                <a href="tel:+22897107833">+228 97 17 11 11</a>
                <a href="#">Lomé, TOGO</a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 LAMESSE DAMA. Tous droits réservés. Application pour la compétition nationale de santé.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
