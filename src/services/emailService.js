import toast from 'react-hot-toast';

export const sendEmailNotification = async (actionType, actionDetails) => {
  // Read auth user from store/localStorage
  let authUser = null;
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

  // Fallback: Simulation toast
  toast.success(
    `✉️ Email Notification sent to ${targetEmail}!\nAction: ${actionType}\nDetails: ${actionDetails.substring(0, 45)}...`,
    {
      duration: 5000,
      icon: '📧',
      style: {
        border: '1.5px dashed #6c63ff',
        background: '#f5f3ff',
        color: '#4c1d95',
      },
    }
  );
};
