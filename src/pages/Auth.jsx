import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { gsap } from 'gsap';
import styles from './Auth.module.css';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Sign in form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up form
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }

    gsap.fromTo(
      '.auth-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signIn(signInEmail, signInPassword);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signUp(signUpEmail, signUpPassword, signUpName);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} auth-card`}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>
            Bienvenido a EventHub
          </h1>
          <p className={styles.cardDescription}>
            Inicia sesión o crea una cuenta para reservar eventos
          </p>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.tabs}>
            <div className={styles.tabsList}>
              <button
                className={styles.tabsTrigger}
                data-state={activeTab === 'signin' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('signin')}
              >
                Iniciar Sesión
              </button>
              <button
                className={styles.tabsTrigger}
                data-state={activeTab === 'signup' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('signup')}
              >
                Registrarse
              </button>
            </div>

            {activeTab === 'signin' && (
              <div className={styles.tabsContent}>
                <form onSubmit={handleSignIn} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="signin-email" className={styles.label}>Email</label>
                    <input
                      id="signin-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="signin-password" className={styles.label}>Contraseña</label>
                    <input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className={styles.tabsContent}>
                <form onSubmit={handleSignUp} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="signup-name" className={styles.label}>Nombre</label>
                    <input
                      id="signup-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="signup-email" className={styles.label}>Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="signup-password" className={styles.label}>Contraseña</label>
                    <input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      minLength={6}
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
