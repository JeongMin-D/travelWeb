/**
 * Email Notification Dispatch Service
 * 
 * Delivers user feedback, bug reports, and inquiries directly to the Administrator's email.
 * Supports:
 * 1. FormSubmit (Direct to any email)
 * 2. Web3Forms (Access Key)
 * 3. Formspree
 * 4. Custom Webhook (Discord / Slack)
 */

const EMAIL_CONFIG_KEY = 'voyage_email_notify_config';

export const DEFAULT_EMAIL_CONFIG = {
  adminEmail: '', // Admin's actual notification email
  serviceType: 'formsubmit', // 'formsubmit' | 'web3forms' | 'formspree' | 'webhook'
  web3formsKey: '',
  formspreeId: '',
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
  const targetEmail = (config.adminEmail || '').trim();

  // If no email configured or dummy email, log and return
  if (!targetEmail || targetEmail === 'admin@voyage.travel') {
    console.warn('[EmailService] No admin email configured. Stored in Cloud Firestore only.');
    return { success: false, reason: 'no_email_configured' };
  }

  const typeLabels = {
    bug: '🐛 [버그/오류 신고]',
    feature: '💡 [기능 개선 제안]',
    inquiry: '❓ [일반 문의]',
    other: '📝 [기타 의견]'
  };

  const typeLabel = typeLabels[feedbackData.type] || '💬 [사용자 피드백]';
  const emailSubject = `${typeLabel} ${feedbackData.title || '새로운 피드백이 접수되었습니다'}`;

  const payload = {
    _subject: emailSubject,
    _replyto: feedbackData.userEmail || targetEmail,
    sender_name: feedbackData.userName || '익명 사용자',
    sender_email: feedbackData.userEmail || '미기재',
    category: feedbackData.type || 'feedback',
    title: feedbackData.title || '',
    message: feedbackData.content || '',
    browser_info: feedbackData.browserInfo || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'),
    timestamp: new Date().toLocaleString('ko-KR')
  };

  try {
    // 1. Web3Forms Dispatch (if key configured)
    if (config.serviceType === 'web3forms' && config.web3formsKey) {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: config.web3formsKey,
          subject: emailSubject,
          from_name: 'Voyage Travel System',
          to_email: targetEmail,
          ...payload
        })
      });
      const data = await res.json();
      return { success: data.success, method: 'web3forms', message: data.message };
    }

    // 2. Formspree Dispatch
    if (config.serviceType === 'formspree' && config.formspreeId) {
      const res = await fetch(`https://formspree.io/f/${config.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { success: res.ok, method: 'formspree' };
    }

    // 3. Webhook (Slack / Discord / Custom Server)
    if (config.serviceType === 'webhook' && config.webhookUrl) {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `📬 **${emailSubject}**\n- **작성자**: ${payload.sender_name} (${payload.sender_email})\n- **내용**: ${payload.message}\n- **접속환경**: ${payload.browser_info}`
        })
      });
      return { success: res.ok, method: 'webhook' };
    }

    // 4. Default: FormSubmit.co Free Service
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
        _template: 'table',
        _autoresponse: '사용자님의 피드백이 Voyage 관리자에게 성공적으로 접수되었습니다. 감사합니다!'
      })
    });

    const resData = await res.json().catch(() => ({}));
    return { success: res.ok, method: 'formsubmit', data: resData };
  } catch (err) {
    console.warn('[EmailService] Email dispatch note:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send a test email to verify configuration instantly
 */
export const sendTestEmail = async (targetEmail) => {
  if (!targetEmail) throw new Error('이메일 주소를 입력해 주세요.');

  const testFeedback = {
    type: 'inquiry',
    title: '[테스트] Voyage 관리자 알림 이메일 연동 확인',
    content: '축하합니다! 관리자 이메일 알림 연동이 성공적으로 완료되었습니다.\n앞으로 사용자가 등록하는 모든 버그 제보와 피드백이 이 메일로 자동 발송됩니다.',
    userName: '시스템 관리자 테스트봇',
    userEmail: targetEmail,
    browserInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Test'
  };

  // Temporarily set email and trigger
  const origConfig = getEmailConfig();
  saveEmailConfig({ ...origConfig, adminEmail: targetEmail });
  const result = await sendFeedbackEmail(testFeedback);
  return result;
};
