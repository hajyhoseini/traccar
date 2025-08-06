import { useState } from 'react';
import {
  Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import App from './App';
import LoginPage from './login/LoginPage';
import RegisterPage from './login/RegisterPage';
import ResetPasswordPage from './login/ResetPasswordPage';
import ChangeServerPage from './login/ChangeServerPage';

import MainPage from './main/MainPage';
import AssistantPage from './main/AssistantPage';

import PositionPage from './other/PositionPage';
import NetworkPage from './other/NetworkPage';
import EventPage from './other/EventPage';
import ReplayPage from './other/ReplayPage';
import EmulatorPage from './other/EmulatorPage';
import GeofencesPage from './other/GeofencesPage';

import DevicesPage from './settings/DevicesPage';
import DevicePage from './settings/DevicePage';
import ServerPage from './settings/ServerPage';
import UsersPage from './settings/UsersPage';
import UserPage from './settings/UserPage';
import GroupsPage from './settings/GroupsPage';
import GroupPage from './settings/GroupPage';
import NotificationsPage from './settings/NotificationsPage';
import NotificationPage from './settings/NotificationPage';
import DriversPage from './settings/DriversPage';
import DriverPage from './settings/DriverPage';
import CalendarsPage from './settings/CalendarsPage';
import CalendarPage from './settings/CalendarPage';
import ComputedAttributesPage from './settings/ComputedAttributesPage';
import ComputedAttributePage from './settings/ComputedAttributePage';
import MaintenancesPage from './settings/MaintenancesPage';
import MaintenancePage from './settings/MaintenancePage';
import CommandsPage from './settings/CommandsPage';
import CommandPage from './settings/CommandPage';
import CommandDevicePage from './settings/CommandDevicePage';
import CommandGroupPage from './settings/CommandGroupPage';
import PreferencesPage from './settings/PreferencesPage';
import DeviceConnectionsPage from './settings/DeviceConnectionsPage';
import GroupConnectionsPage from './settings/GroupConnectionsPage';
import UserConnectionsPage from './settings/UserConnectionsPage';
import SharePage from './settings/SharePage';
import AnnouncementPage from './settings/AnnouncementPage';
import GeofencePage from './settings/GeofencePage';

import CombinedReportPage from './reports/CombinedReportPage';
import PositionsReportPage from './reports/PositionsReportPage';
import EventReportPage from './reports/EventReportPage';
import TripReportPage from './reports/TripReportPage';
import StopReportPage from './reports/StopReportPage';
import SummaryReportPage from './reports/SummaryReportPage';
import ChartReportPage from './reports/ChartReportPage';
import StatisticsPage from './reports/StatisticsPage';
import ScheduledPage from './reports/ScheduledPage';
import AuditPage from './reports/AuditPage';
import LogsPage from './reports/LogsPage';

import Loader from './common/components/Loader';
import { generateLoginToken } from './common/components/NativeInterface';
import { useLocalization } from './common/components/LocalizationProvider';

import useQuery from './common/util/useQuery';
import fetchOrThrow from './common/util/fetchOrThrow';
import { useEffectAsync } from './reactHelper';
import { devicesActions } from './store';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setLocalLanguage } = useLocalization();

  const [redirectsHandled, setRedirectsHandled] = useState(false);
  const { pathname } = useLocation();
  const query = useQuery();

  useEffectAsync(async () => {
    if (query.get('locale')) {
      setLocalLanguage(query.get('locale'));
    }

    if (query.get('token')) {
      await fetch(`/api/session?token=${encodeURIComponent(query.get('token'))}`);
      navigate(pathname, { replace: true });
    } else if (pathname === '/' && query.get('deviceId')) {
      const response = await fetchOrThrow(`/api/devices?uniqueId=${query.get('deviceId')}`);
      const items = await response.json();
      if (items.length > 0) {
        dispatch(devicesActions.selectId(items[0].id));
      }
      navigate('/', { replace: true });
    } else if (query.get('eventId')) {
      navigate(`/event/${query.get('eventId')}`, { replace: true });
    } else if (query.get('openid') === 'success') {
      generateLoginToken();
      navigate('/', { replace: true });
    } else {
      setRedirectsHandled(true);
    }
  }, [query]);

  if (!redirectsHandled) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Routes without Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/change-server" element={<ChangeServerPage />} />

      {/* Routes WITH Layout (App) */}
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="position/:id" element={<PositionPage />} />
        <Route path="network/:positionId" element={<NetworkPage />} />
        <Route path="event/:id" element={<EventPage />} />
        <Route path="replay" element={<ReplayPage />} />
        <Route path="geofences" element={<GeofencesPage />} />
        <Route path="emulator" element={<EmulatorPage />} />

        <Route path="settings">
          <Route path="devices" element={<DevicesPage />} />
          <Route path="device/:id" element={<DevicePage />} />
          <Route path="device" element={<DevicePage />} />
          <Route path="device/:id/connections" element={<DeviceConnectionsPage />} />
          <Route path="device/:id/share" element={<SharePage />} />
          <Route path="device/:id/command" element={<CommandDevicePage />} />
          <Route path="server" element={<ServerPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path="user/:id/connections" element={<UserConnectionsPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="group/:id" element={<GroupPage />} />
          <Route path="group/:id/command" element={<CommandGroupPage />} />
          <Route path="group/:id/connections" element={<GroupConnectionsPage />} />
          <Route path="group" element={<GroupPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notification/:id" element={<NotificationPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="driver/:id" element={<DriverPage />} />
          <Route path="driver" element={<DriverPage />} />
          <Route path="calendars" element={<CalendarsPage />} />
          <Route path="calendar/:id" element={<CalendarPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="attributes" element={<ComputedAttributesPage />} />
          <Route path="attribute/:id" element={<ComputedAttributePage />} />
          <Route path="attribute" element={<ComputedAttributePage />} />
          <Route path="maintenances" element={<MaintenancesPage />} />
          <Route path="maintenance/:id" element={<MaintenancePage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="commands" element={<CommandsPage />} />
          <Route path="command/:id" element={<CommandPage />} />
          <Route path="command" element={<CommandPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="announcement" element={<AnnouncementPage />} />
          <Route path="geofence/:id" element={<GeofencePage />} />
          <Route path="geofence" element={<GeofencePage />} />
        </Route>

        <Route path="reports">
          <Route path="combined" element={<CombinedReportPage />} />
          <Route path="route" element={<PositionsReportPage />} />
          <Route path="events" element={<EventReportPage />} />
          <Route path="trips" element={<TripReportPage />} />
          <Route path="stops" element={<StopReportPage />} />
          <Route path="summary" element={<SummaryReportPage />} />
          <Route path="chart" element={<ChartReportPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="scheduled" element={<ScheduledPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
