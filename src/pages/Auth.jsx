import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { gsap } from 'gsap';
import styles from './Auth.module.css';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    // No need to setLoading(false) here as redirect will happen
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
                      autoComplete="email"
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
                      autoComplete="current-password"
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </button>
                  
                  <div className={styles.divider}>
                    <span className={styles.dividerText}>O continúa con</span>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleGoogleSignIn} 
                    className={styles.googleButton}
                    disabled={loading}
                  >
                    <svg className={styles.googleIcon} viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
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
                      autoComplete="email"
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
                      autoComplete="new-password"
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </button>

                  <div className={styles.divider}>
                    <span className={styles.dividerText}>O continúa con</span>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleGoogleSignIn} 
                    className={styles.googleButton}
                    disabled={loading}
                  >
                    <svg className={styles.googleIcon} viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
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
