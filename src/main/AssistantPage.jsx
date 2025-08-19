import PageLayout from '../common/components/PageLayout';
import SettingsMenu from '../settings/components/SettingsMenu';
import useSettingsStyles from '../settings/common/useSettingsStyles';

const AssistantPage = () => {
  const { classes: settingsClasses } = useSettingsStyles();

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['menuAssistant']}>
      <div className={settingsClasses.container}>
        <div className={settingsClasses.header}>
        
        </div>

        <div style={{ width: '100%', height: '80vh' }}>
          <iframe
            src="http://192.168.1.108:3001/home"
            title="External Page"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AssistantPage;
