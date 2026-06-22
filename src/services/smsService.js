import toast from 'react-hot-toast';

export const sendRealSMS = async (phone, message) => {
  if (!phone) {
    console.warn('Skipping SMS dispatch: No phone number provided.');
    return false;
  }

  // Clean phone number to E.164 format
  let cleanPhone = phone.trim().replace(/\s+/g, '');
  if (!cleanPhone.startsWith('+')) {
    // If it's a 10 digit number, assume +91 (India) by default
    if (cleanPhone.replace(/\D/g, '').length === 10) {
      cleanPhone = '+91' + cleanPhone.replace(/\D/g, '');
    } else {
      cleanPhone = '+' + cleanPhone.replace(/\D/g, '');
    }
  } else {
    cleanPhone = '+' + cleanPhone.replace(/\D/g, '');
  }

  // Toast indicator for background sending
  const tid = toast.loading(`📡 Dispatching background SMS to ${cleanPhone}...`);

  try {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: cleanPhone,
        message: message,
        key: 'textbelt',
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(
        `💬 SMS successfully sent to ${cleanPhone}!\n(Quota remaining: ${data.quotaRemaining})`,
        {
          id: tid,
          duration: 6000,
          style: {
            border: '1.5px solid #10b981',
            background: '#ecfdf5',
            color: '#065f46',
            fontSize: '12px',
          },
        }
      );
      return true;
    } else {
      console.warn('TextBelt free API failed:', data.error);
      
      // Check if error is quota limit
      if (data.error && data.error.toLowerCase().includes('limit')) {
        toast.error(
          `⚠️ Free SMS Limit Hit!\nTextBelt limits free accounts to 1 SMS/day per IP.\n\n💡 Please click the buttons to dispatch manually via SMS or WhatsApp instead!`,
          {
            id: tid,
            duration: 10000,
            style: {
              border: '1.5px solid #f59e0b',
              background: '#fffbeb',
              color: '#78350f',
              fontSize: '12px',
              lineHeight: '1.5',
            },
          }
        );
      } else {
        toast.error(
          `⚠️ SMS Dispatch Failed: ${data.error || 'Server error'}.\nClick below to send manually.`,
          { id: tid, duration: 6000 }
        );
      }
      return false;
    }
  } catch (err) {
    console.error('TextBelt error:', err);
    toast.error(
      `⚠️ Connection Error.\nUnable to dispatch background SMS. Please send it manually.`,
      { id: tid, duration: 6000 }
    );
    return false;
  }
};
