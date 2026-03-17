import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ParentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - accept any credentials for now
    if (email && password) {
      navigate('/parent/dashboard');
    } else {
      setError('Please enter email and password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-hero mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Parent Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Secure login to manage YookiePlay</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="parent@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl gradient-hero text-primary-foreground font-medium hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          For demo: enter any email and password
        </p>
      </motion.div>
    </div>
  );
}
