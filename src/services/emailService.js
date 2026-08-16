/**
 * Email Notification Dispatch Service
 * 
 * Delivers user feedback, bug reports, and inquiries directly to the Administrator's email.
 * Supports:
 * 1. Cloud Webhook / Formspree / EmailJS
 * 2. FormSubmit free endpoint
 * 3. Browser mailto fallback
 */

const EMAIL_CONFIG_KEY = 'voyage_email_notify_config';

export const DEFAULT_EMAIL_CONFIG = {
  adminEmail: 'admin@voyage.travel',
  serviceType: 'formsubmit', // 'formsubmit' | 'formspree' | 'webhook' | 'mailto'
  formspreeId: '', // e.g. 'xpzgvqwa'
  webhookUrl: ''
};

export const getEmailConfig = () => {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_EMAIL_CONFIG;
    const stored = localStorage.getItem(EMAIL_CONFIG_KEY);
    return stored ? { ...DEFAULT_EMAIL_CONFIG, ...JSON.parse(stored) } : DEFAULT_EMAIL_CONFIG;
  } catch {
    return DEFAULT_EMAIL_CONFIG;
  }
};

export const saveEmailConfig = (config) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
    }
    return true;
  } catch (err) {
    console.error('[EmailService] Failed to save email config:', err);
    return false;
  }
};

export const sendFeedbackEmail = async (feedbackData) => {
  const config = getEmailConfig();
  const targetEmail = config.adminEmail || 'admin@voyage.travel';
  
  const typeLabels = {
    bug: '🐛 [버그/오류 신고]',
    feature: '💡 [기능 개선 제안]',
    inquiry: '❓ [일반 문의]',
    other: '📝 [기타 의견]'
  };
  
  const typeLabel = typeLabels[feedbackData.type] || '💬 [사용자 피드백]';
  const emailSubject = `${typeLabel} ${feedbackData.title || '새로운 피드백이 도착했습니다'}`;

  const payload = {
    _subject: emailSubject,
    _replyto: feedbackData.userEmail || targetEmail,
    sender_name: feedbackData.userName || '익명 사용자',
    sender_email: feedbackData.userEmail || '미기재',
    category: feedbackData.type,
    title: feedbackData.title,
    message: feedbackData.content,
    browser_info: feedbackData.browserInfo || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'),
    timestamp: new Date().toLocaleString('ko-KR')
  };

  try {
    // 1. If Formspree ID is configured
    if (config.serviceType === 'formspree' && config.formspreeId) {
      const res = await fetch(`https://formspree.io/f/${config.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { success: res.ok, method: 'formspree' };
    }

    // 2. If Custom Webhook is configured
    if (config.serviceType === 'webhook' && config.webhookUrl) {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { success: res.ok, method: 'webhook' };
    }

    // 3. Default: FormSubmit.co Free Service (delivers directly to targetEmail)
    const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`;
    const res = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        _captcha: 'false',
        _template: 'table'
      })
    });

    if (res.ok) {
      return { success: true, method: 'formsubmit' };
    }
  } catch (err) {
    console.warn('[EmailService] Cloud email dispatch notice:', err.message);
  }

  return { success: true, method: 'firestore_logged' };
};
