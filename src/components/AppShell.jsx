import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity, Bell, BriefcaseBusiness, Building2, ChartNoAxesCombined, ChevronDown, CircleHelp,
  Command, CreditCard, LayoutDashboard, Menu, MessageSquareText, Settings2, ShieldCheck,
  Users, X,
} from "lucide-react";
import { DemoNotice } from "./Ui";

const adminLinks = [
  { label: "Overview", to: "/admin/overview", icon: LayoutDashboard },
  { label: "Clients", to: "/admin/clients", icon: Building2 },
  { label: "Campaigns", to: "/admin/campaigns", icon: BriefcaseBusiness },
  { label: "Plans", to: "/admin/plans", icon: CreditCard },
  { label: "Team access", to: "/admin/team", icon: Users },
  { label: "Analytics", to: "/admin/analytics", icon: ChartNoAxesCombined },
  { label: "Notifications", to: "/admin/notifications", icon: Bell, count: "3" },
  { label: "Settings", to: "/admin/settings", icon: Settings2 },
];

const clientLinks = [
  { label: "Dashboard", to: "/client/dashboard", icon: LayoutDashboard },
  { label: "My campaigns", to: "/client/campaigns", icon: BriefcaseBusiness },
  { label: "My plans", to: "/client/plans", icon: CreditCard },
  { label: "Live updates", to: "/client/updates", icon: Activity },
  { label: "Analytics & reports", to: "/client/analytics", icon: ChartNoAxesCombined },
  { label: "Team members", to: "/client/team", icon: Users },
  { label: "Support", to: "/client/support", icon: CircleHelp },
];

const pageTitles = {
  "/admin/overview": "Admin overview", "/admin/clients": "Client management",
  "/admin/campaigns": "Campaign overview", "/admin/plans": "Plans overview",
  "/admin/team": "Team access", "/admin/analytics": "Analytics",
  "/admin/notifications": "Notifications", "/admin/settings": "Settings",
  "/client/dashboard": "Client dashboard", "/client/campaigns": "My campaigns",
  "/client/plans": "My plans", "/client/updates": "Live updates",
  "/client/analytics": "Analytics & reports", "/client/team": "Team members",
  "/client/support": "Support",
};

export default function AppShell({ audience }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = audience === "admin";
  const links = isAdmin ? adminLinks : clientLinks;
  const title = pageTitles[location.pathname] || (location.pathname.includes("/clients/") ? "Client workspace" : "Campaign details");
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`app-shell ${isAdmin ? "admin-shell" : "client-shell"}`}>
      {menuOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={closeMenu} />}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark">S</div><div><b>socialbureau</b><span>CLIENT WORKSPACE</span></div><button className="mobile-close" aria-label="Close navigation" onClick={closeMenu}><X size={18} /></button></div>
        <div className="workspace-picker"><div className="workspace-icon">{isAdmin ? <ShieldCheck size={17} /> : <Command size={17} />}</div><div><span>{isAdmin ? "Workspace" : "Your workspace"}</span><b>{isAdmin ? "Admin console" : "Northstar Studio"}</b></div><ChevronDown size={15} /></div>
        <div className="nav-caption">{isAdmin ? "WORKSPACE" : "YOUR SPACE"}</div>
        <nav className="side-nav">
          {links.map(({ label, to, icon: Icon, count }) => <NavLink key={to} to={to} onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><Icon size={18} /><span>{label}</span>{count && <em>{count}</em>}</NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          {!isAdmin && <div className="support-card"><div className="support-icon"><MessageSquareText size={17} /></div><b>Need a hand?</b><p>Your account team is just a message away.</p><NavLink to="/client/support" onClick={closeMenu}>Get support <span>↗</span></NavLink></div>}
          <div className="profile-row"><div className="avatar avatar-dark">{isAdmin ? "SB" : "AM"}</div><div className="profile-info"><b>{isAdmin ? "SocialBureau team" : "Aarav Mehta"}</b><span>{isAdmin ? "Administrator" : "Client account"}</span></div><MoreDots /></div>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><div className="breadcrumbs"><span>{isAdmin ? "Admin" : "Client space"}</span><b>/</b><strong>{title}</strong></div><div className="topbar-actions"><span className="environment-tag">DEMO SPACE</span><button className="top-icon" aria-label="Notifications"><Bell size={18} /><i /></button><div className="avatar avatar-red">{isAdmin ? "SB" : "AM"}</div></div></header>
        <main className="page-content"><DemoNotice /><Outlet /></main>
        <footer className="site-footer"><span>© 2025 SocialBureau</span><span>Made for better partnerships <span className="footer-heart">♥</span></span></footer>
      </div>
    </div>
  );
}

function MoreDots() {
  return <span className="profile-more">···</span>;
}
