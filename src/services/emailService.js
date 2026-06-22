import toast from 'react-hot-toast';

export const sendEmailNotification = async (actionType, actionDetails, customUser = null) => {
  // Read auth user from store/localStorage
  let authUser = customUser;
  if (!authUser) {
    const authStoreStr = localStorage.getItem('mindspace-auth');
    if (authStoreStr) {
      try {
        const parsed = JSON.parse(authStoreStr);
        if (parsed?.state?.user) {
          authUser = parsed.state.user;
        }
      } catch (e) {
        console.error('Error parsing auth state', e);
      }
    }
  }

  if (!authUser) {
    console.warn('Skipping email notification: No logged-in user found.');
    return;
  }

  // Read notification settings
  let emailEnabled = true;
  let customEmailJS = false;
  let serviceId = '';
  let templateId = '';
  let publicKey = '';
  let recipientEmail = '';

  const notifStoreStr = localStorage.getItem('mindspace-notifications');
  if (notifStoreStr) {
    try {
      const parsed = JSON.parse(notifStoreStr);
      if (parsed?.state) {
        emailEnabled = parsed.state.emailEnabled ?? true;
        customEmailJS = parsed.state.customEmailJS ?? false;
        serviceId = parsed.state.serviceId || '';
        templateId = parsed.state.templateId || '';
        publicKey = parsed.state.publicKey || '';
        recipientEmail = parsed.state.recipientEmail || '';
      }
    } catch (e) {
      console.error('Error parsing notification settings', e);
    }
  }

  if (!emailEnabled) return;

  const targetEmail = recipientEmail || authUser.email;
  const targetName = authUser.name || 'User';

  const templateParams = {
    to_name: targetName,
    to_email: targetEmail,
    action_type: actionType,
    action_details: actionDetails,
    timestamp: new Date().toLocaleString(),
  };

  // If custom EmailJS integration is active, send via REST API
  if (customEmailJS && serviceId && templateId && publicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send via EmailJS API');
      }

      toast.success(`✉️ Email notification sent to ${targetEmail}!`, {
        duration: 4000,
        icon: '✉️',
      });
      return;
    } catch (err) {
      console.error('EmailJS Send Error:', err);
      toast.error(`⚠️ EmailJS Error: ${err.message}. Falling back to simulation.`, { duration: 5000 });
    }
  }

  // Fallback: Send real email via FormSubmit.co free API
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `MediVision AI Alert: ${actionType}`,
        "User Name": targetName,
        "Notification": actionType,
        "Details": actionDetails,
        "Timestamp": new Date().toLocaleString(),
        _honey: "", // Honeypot spam prevention
        _captcha: "false" // Disable captcha verification page
      })
    });

    if (response.ok) {
      toast.success(
        `✉️ Real Email sent to ${targetEmail}!\nCheck your inbox. (Note: The first email requires confirming your address via a FormSubmit verification link).`,
        {
          duration: 9000,
          icon: '📧',
          style: {
            border: '1.5px solid #10b981',
            background: '#ecfdf5',
            color: '#065f46',
            fontSize: '12px',
            lineHeight: '1.5'
          },
        }
      );
      return;
    }
  } catch (err) {
    console.error('FormSubmit Error:', err);
  }

  // Fallback to simulation toast if API fails
  toast.success(
    `✉️ [Simulated] Email sent to ${targetEmail}!\nAction: ${actionType}\n\n💡 Set up EmailJS in Settings ⚙️ to receive real emails.`,
    {
      duration: 7000,
      icon: '📧',
      style: {
        border: '1.5px dashed #6c63ff',
        background: '#f5f3ff',
        color: '#4c1d95',
        fontSize: '12px',
        lineHeight: '1.5'
      },
    }
  );
};
