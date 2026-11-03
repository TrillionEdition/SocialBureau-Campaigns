import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { AdminCampaigns, AdminClients, AdminOverview, CampaignDetails, ClientCampaigns, ClientDashboard, ClientWorkspace, GenericWorkspacePage } from "./pages/WorkspacePages";

function Placeholder({ title, audience, type }) {
  return <GenericWorkspacePage title={title} audience={audience} type={type} />;
}

function CampaignRoute({ audience }) {
  return <CampaignDetails audience={audience} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/overview" replace />} />
      <Route path="/admin" element={<AppShell audience="admin" />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="clients/:clientId" element={<ClientWorkspace />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="campaigns/:campaignId" element={<CampaignRoute audience="admin" />} />
        <Route path="plans" element={<Placeholder audience="admin" title="Plans overview" type="admin-plans" />} />
        <Route path="team" element={<Placeholder audience="admin" title="Team access" type="team" />} />
        <Route path="analytics" element={<Placeholder audience="admin" title="Analytics" type="analytics" />} />
        <Route path="notifications" element={<Placeholder audience="admin" title="Notifications" type="notifications" />} />
        <Route path="settings" element={<Placeholder audience="admin" title="Settings" type="settings" />} />
      </Route>
      <Route path="/client" element={<AppShell audience="client" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="campaigns" element={<ClientCampaigns />} />
        <Route path="campaigns/:campaignId" element={<CampaignRoute audience="client" />} />
        <Route path="plans" element={<Placeholder audience="client" title="My plans" type="client-plans" />} />
        <Route path="updates" element={<Placeholder audience="client" title="Live updates" type="updates" />} />
        <Route path="analytics" element={<Placeholder audience="client" title="Analytics & reports" type="analytics" />} />
        <Route path="team" element={<Placeholder audience="client" title="Team members" type="team" />} />
        <Route path="support" element={<Placeholder audience="client" title="Support" type="support" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
