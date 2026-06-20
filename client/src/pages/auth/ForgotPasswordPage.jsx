import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api';
import { Building2, Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [step, setStep]     = useState('email'); // email | otp | done
  const [email, setEmail]   = useState('');
  const [otp, setOtp]       = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      toast.success('OTP sent to your email!');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const resetPwd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword({ otp, new_password: newPwd });
      toast.success('Password reset successfully!');
      setStep('done');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP or expired');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-primary font-heading">BuildTrack CMS</span>
        </div>

        {step === 'done' ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-bold text-primary font-heading mb-2">Password Reset!</h2>
            <p className="text-slate-500 text-sm mb-6">Your password has been updated successfully.</p>
            <Link to="/login" className="btn-primary">Back to Login</Link>
          </div>
        ) : step === 'email' ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary font-heading">Reset Password</h2>
              <p className="text-slate-500 text-sm mt-1">We'll send an OTP to your registered email</p>
            </div>
            <form onSubmit={sendOtp} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" className="input pl-9" placeholder="your@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Send OTP'}
              </button>
              <Link to="/login" className="btn-secondary w-full justify-center">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary font-heading">Enter OTP</h2>
              <p className="text-slate-500 text-sm mt-1">Enter the OTP sent to {email}</p>
            </div>
            <form onSubmit={resetPwd} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">OTP Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" className="input pl-9" placeholder="6-digit OTP"
                    value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">New Password</label>
                <input type="password" className="input" placeholder="Minimum 8 characters"
                  value={newPwd} onChange={e => setNewPwd(e.target.value)} required minLength={8} />
              </div>
              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
