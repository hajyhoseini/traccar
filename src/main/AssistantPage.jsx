import { useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from '../settings/components/SettingsMenu';
import useSettingsStyles from '../settings/common/useSettingsStyles';
import useAssistantStyles from '../assistant/common/useAssistantStyles';

const AssistantPage = () => {
  const { classes: settingsClasses } = useSettingsStyles();
  const { classes } = useAssistantStyles();
  const t = useTranslation();

  const [messages, setMessages] = useState([
    { type: 'bot', text: 'سلام! چطور می‌تونم کمکت کنم؟' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    const botReply = { type: 'bot', text: 'پاسخ آزمایشی به: ' + input };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput('');
  };

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['menuAssistant']}>
      <div className={settingsClasses.container}>
        <div className={settingsClasses.header}>
          <Typography variant="h4">{t('menuAssistant')}</Typography>
        </div>

        <div className={classes.chatContainer}>
          <div className={classes.chatMessages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${classes.messageBubble} ${
                  msg.type === 'user' ? classes.userMessage : classes.botMessage
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

<div className={classes.chatInputContainer}>
  <input
    className={classes.chatInput}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="پیام خود را وارد کنید..."
    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
    style={{ fontFamily: 'Vazir, sans-serif' }}
  />
  <button
    className={classes.sendButton}
    onClick={handleSend}
    style={{ fontFamily: 'Vazir, sans-serif' }}
  >
    ارسال
  </button>
</div>



        </div>
      </div>
    </PageLayout>
  );
};

export default AssistantPage;
