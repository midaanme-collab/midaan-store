'use client';

import React, { useState } from 'react';
import { Mail, Check, Sparkles, Send, Phone } from 'lucide-react';
import { useStore } from '@/store';
import { sendNewsletterToCrm } from '@/utils/crm';
import { trackNewsletterSignup } from '@/utils/analytics';

interface MidaanDispatchNewsletterProps {
  source?: string;
  variant?: 'footer' | 'section' | 'card';
  lang?: 'ar' | 'en';
}

export default function MidaanDispatchNewsletter({
  source = 'website',
  variant = 'section',
  lang: propLang,
}: MidaanDispatchNewsletterProps) {
  const { lang: storeLang } = useStore();
  const lang = propLang || storeLang || 'ar';
  const isAr = lang === 'ar';

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg(isAr ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      sendNewsletterToCrm({
        email: trimmedEmail,
        phone: phone.trim() || undefined,
        source,
        language: isAr ? 'ar' : 'en',
      });

      trackNewsletterSignup({
        email: trimmedEmail,
        source,
      });

      setIsSuccess(true);
      setEmail('');
      setPhone('');
    } catch {
      setErrorMsg(isAr ? 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copy = {
    badge: isAr ? 'نشرة ميدان التحريرية // Midaan Dispatch' : 'MIDAAN DISPATCH // EDITORIAL',
    title: isAr ? 'اشترك في نشرة ميدان' : 'Subscribe to Midaan Dispatch',
    subtitle: isAr
      ? 'وصول مبكر للإصدارات المحدودة، تنبيهات النسخ المطبوعة، ونصوص فكرية وثقافية مختارة.'
      : 'Early access to limited drops, print edition alerts, and curated independent essays.',
    emailPlaceholder: isAr ? 'أدخل بريدك الإلكتروني...' : 'Enter your email address...',
    phonePlaceholder: isAr ? 'رقم الواتساب (اختياري للإشعارات المباشرة)' : 'WhatsApp number (optional for instant alerts)',
    buttonText: isAr ? 'انضمام' : 'Subscribe',
    submittingText: isAr ? 'جاري التأكيد...' : 'Confirming...',
    successTitle: isAr ? 'تم تأكيد اشتراكك بنجاح في نشرة ميدان' : 'Subscription Confirmed',
    successDesc: isAr
      ? 'ستصلك تنبيهات الإصدارات القادمة والنسخ المطبوعة مبكراً على بريدك الإلكتروني.'
      : "You're now on the early-access list for upcoming drops and collector's print runs.",
  };

  if (variant === 'footer') {
    return (
      <div className="w-full max-w-xl mx-auto mb-10 px-4 text-center" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D80032] mb-2 font-mono">
          <Sparkles size={12} />
          <span>{copy.badge}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-white mb-2 font-sans">
          {copy.title}
        </h3>
        <p className="text-xs text-neutral-400 mb-5 max-w-md mx-auto leading-relaxed">
          {copy.subtitle}
        </p>

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-neutral-200 text-xs flex items-center justify-center gap-2">
            <Check size={16} className="text-emerald-400" />
            <span>{copy.successTitle}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full bg-[#121212] border border-[#262626] focus:border-[#D80032] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white hover:bg-neutral-200 disabled:opacity-50 text-black px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
              >
                <Mail size={13} />
                <span>{isSubmitting ? copy.submittingText : copy.buttonText}</span>
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-[#D80032] text-start font-medium">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <div 
      className="w-full bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#262626] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden my-12"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 start-0 w-2 h-full bg-[#D80032]" />
      
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D80032] uppercase tracking-wider mb-3 font-mono">
          <Sparkles size={14} />
          <span>{copy.badge}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white font-sans leading-tight mb-3">
          {copy.title}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-6">
          {copy.subtitle}
        </p>

        {isSuccess ? (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-neutral-100 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check size={14} />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">{copy.successTitle}</div>
              <div className="text-xs text-neutral-300 leading-relaxed">{copy.successDesc}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#D80032] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-6 relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={copy.phonePlaceholder}
                  className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#D80032] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-[#D80032] font-semibold">{errorMsg}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-neutral-500">
                {isAr
                  ? '🔒 خصوصيتك محفوظة بالكامل؛ لا نشارك بياناتك إطلاقاً.'
                  : '🔒 Your data is fully protected; no spam, unsubscribe anytime.'}
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white hover:bg-neutral-200 disabled:opacity-50 text-black px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <Send size={13} className="text-[#D80032]" />
                <span>{isSubmitting ? copy.submittingText : copy.buttonText}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
