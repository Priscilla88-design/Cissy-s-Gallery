import { motion } from 'motion/react';
import { Camera, LogIn, Heart } from 'lucide-react';
import { useAuth } from './FirebaseProvider';

export function Login() {
  const { signIn } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center" id="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-olive text-white shadow-xl shadow-olive/20">
          <Camera size={40} />
        </div>
        
        <h1 className="mb-4 text-5xl font-serif text-ink italic">Moments</h1>
        <p className="mb-12 text-ink/40 leading-relaxed">
          The art of preserving time. A minimal, private space to curate your life's most meaningful chapters.
        </p>

        <button
          onClick={signIn}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-8 py-5 text-lg font-medium text-paper transition-all hover:bg-ink/90 active:scale-[0.98] shadow-lg"
          id="login-button"
        >
          <LogIn size={20} className="transition-transform group-hover:translate-x-1" />
          <span>Enter Library</span>
        </button>

        <div className="mt-12 flex items-center justify-center gap-2 text-ink/20">
          <Heart size={14} />
          <span className="text-xs uppercase tracking-[0.2em]">Securely stored with Google</span>
        </div>
      </motion.div>
    </div>
  );
}
