import { useNavigate, useParams } from "react-router-dom";
import {
  Activity, ArrowUpRight, ArrowRight, BadgeCheck, CalendarDays, ChartNoAxesCombined, Check,
  ChevronRight, CircleHelp, Clock3, Download, FileText, Filter, MessageSquareText,
  Plus, Search, Send, Sparkles, Users, WalletCards,
} from "lucide-react";
import { demoAnalytics, demoCampaigns, demoClients, demoPlans, demoUpdates } from "../data/mockData";
import { Button, DataTable, EmptyState, PageHeading, Panel, StatCard, StatusPill, TrendChart } from "../components/Ui";

const initials = (name = "") => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export function AdminOverview() {
  const navigate = useNavigate();
  return <>
    <PageHeading eyebrow="TUESDAY, JUNE 10, 2025" title="Good morning, team" description="Here’s what’s happening across your client workspaces." action={<Button icon={Plus}>Add a client</Button>} />
    <div className="stats-grid">
      <StatCard label="Active clients" value="28" change="+4.8%" icon={Users} />
      <StatCard label="Live campaigns" value="64" change="+12.2%" icon={Sparkles} />
      <StatCard label="Campaign value" value="₹18.4L" change="+8.1%" icon={WalletCards} />
      <StatCard label="Awaiting review" value="09" change="2 due today" direction="down" icon={Clock3} />
    </div>
    <div className="dashboard-grid">
      <Panel title="Campaign activity" subtitle="Illustrative monthly activity" action={<span className="range-select">Last 6 months⌄</span>} className="activity-panel">
        <div className="chart-legend"><span><i className="legend-dot red" />Campaigns</span><span className="chart-caption">SAMPLE</span></div>
        <TrendChart values={demoAnalytics.values} months={demoAnalytics.months} />
      </Panel>
      <Panel title="Needs your attention" subtitle="A few things to keep moving">
        <div className="attention-list">
          <AttentionItem icon={MessageSquareText} title="Creator shortlist" detail="Northstar Studio · Campaign review" time="Due today" />
          <AttentionItem icon={FileText} title="Plan renewal" detail="Kindred Health · Essential" time="In 3 days" />
          <AttentionItem icon={CalendarDays} title="Campaign kickoff" detail="Forma Living · Instagram" time="Jun 13" />
        </div>
      </Panel>
    </div>
    <Panel title="Recent campaigns" subtitle="A quick look at work across your clients" action={<button className="text-link" onClick={() => navigate("/admin/campaigns")}>View all <ArrowRight size={15} /></button>}>
      <CampaignTable campaigns={demoCampaigns.slice(0, 3)} onSelect={(campaign) => navigate(`/admin/campaigns/${campaign.id}`)} />
    </Panel>
  </>;
}

export function ClientDashboard() {
  const navigate = useNavigate();
  return <>
    <PageHeading eyebrow="TUESDAY, JUNE 10, 2025" title="Welcome back, Aarav" description="Here’s the latest from your SocialBureau team." action={<Button variant="light" icon={MessageSquareText}>Talk to your team</Button>} />
    <div className="client-hero"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={14} /> YOUR BRAND, IN MOTION</span><h2>Good things are<br />coming together.</h2><p>Your campaigns and team updates, all in one place.</p><button className="hero-link" onClick={() => navigate("/client/campaigns")}>Explore your campaigns <ArrowUpRight size={15} /></button></div><div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><span>NS</span><small>NORTHSTAR</small></div><i className="orbit-star star-one">✦</i><i className="orbit-star star-two">✦</i><i className="orbit-star star-three">✦</i></div></div>
    <div className="stats-grid client-stats">
      <StatCard label="Active campaigns" value="04" change="2 in progress" icon={Sparkles} />
      <StatCard label="Current plan" value="Growth" change="Renews Jul 01" icon={WalletCards} />
      <StatCard label="Latest update" value="12 min" change="Creator shortlist ready" icon={Clock3} />
    </div>
    <div className="dashboard-grid">
      <Panel title="Campaign activity" subtitle={demoAnalytics.label} action={<span className="chart-caption">SAMPLE DATA</span>}>
        <TrendChart values={demoAnalytics.values} months={demoAnalytics.months} />
      </Panel>
      <Panel title="From your team" subtitle="A little progress worth sharing">
        <div className="attention-list"><AttentionItem icon={BadgeCheck} title="Shortlist is ready" detail="Review the creators we’ve picked for you." time="12 min ago" /><AttentionItem icon={CalendarDays} title="Your next shoot is booked" detail="Studio day · Friday, June 20" time="Yesterday" /></div>
        <button className="text-link panel-bottom-link" onClick={() => navigate("/client/updates")}>See all updates <ArrowRight size={15} /></button>
      </Panel>
    </div>
    <Panel title="Your campaigns" subtitle="The latest across your active work" action={<button className="text-link" onClick={() => navigate("/client/campaigns")}>All campaigns <ArrowRight size={15} /></button>}>
      <CampaignTable campaigns={demoCampaigns.slice(0, 3)} onSelect={(campaign) => navigate(`/client/campaigns/${campaign.id}`)} />
    </Panel>
  </>;
}

export function AdminClients() {
  const navigate = useNavigate();
  return <>
    <PageHeading eyebrow="RELATIONSHIPS" title="Client management" description="A thoughtful view of every partnership in your portfolio." action={<Button icon={Plus}>Add client</Button>} />
    <div className="filter-bar"><label className="search-field"><Search size={16} /><input placeholder="Search clients..." /></label><button className="filter-button"><Filter size={15} /> Filters <span>2</span></button><span className="result-count">Showing 4 of 28 clients</span></div>
    <Panel className="table-panel"><DataTable columns={[
      { key: "name", label: "CLIENT", render: (client) => <ClientName client={client} /> },
      { key: "contact", label: "PRIMARY CONTACT", render: (client) => <span className="contact-cell"><b>{client.contact}</b><small>{client.email}</small></span> },
      { key: "campaigns", label: "CAMPAIGNS", render: (client) => <span className="count-cell">{client.campaigns} active</span> },
      { key: "plan", label: "PLAN" },
      { key: "status", label: "STATUS", render: (client) => <StatusPill>{client.status}</StatusPill> },
    ]} rows={demoClients} onRowClick={(client) => navigate(`/admin/clients/${client.id}`)} /></Panel>
    <div className="note-line"><span className="demo-dot" /> Client records shown here are sample UI data until connected to an assigned-account API.</div>
  </>;
}

export function ClientWorkspace() {
  const { clientId } = useParams();
  const client = demoClients.find((item) => item.id === clientId);
  if (!client) return <><PageHeading eyebrow="CLIENT WORKSPACE" title="Client not found" description="This sample client is not available in the UI preview." /><EmptyState /></>;
  return <>
    <PageHeading eyebrow="CLIENT WORKSPACE" title={client.name} description={`${client.contact} · Since ${client.since}`} action={<Button variant="light" icon={MessageSquareText}>Contact client</Button>} />
    <div className="client-profile-banner"><ClientName client={client} large /><StatusPill>{client.status}</StatusPill><span className="profile-divider" /><span className="inline-meta">{client.campaigns} active campaigns</span><span className="inline-meta">{client.plan} plan</span></div>
    <div className="stats-grid"><StatCard label="Active campaigns" value={String(client.campaigns).padStart(2, "0")} change="Across 2 channels" icon={Sparkles} /><StatCard label="Plan" value={client.plan} change="Active subscription" icon={WalletCards} /><StatCard label="Account since" value={client.since} change="Client relationship" icon={CalendarDays} /></div>
    <Panel title="Campaigns for this client" subtitle="Campaign data will load from the existing campaigns API once account mapping is approved."><EmptyState title="Client account mapping needed" detail="Existing campaign ownership is tied to user IDs or email. A safe client-to-account assignment API is needed before showing these records here." /></Panel>
  </>;
}

export function AdminCampaigns() {
  const navigate = useNavigate();
  return <>
    <PageHeading eyebrow="DELIVERY" title="Campaign overview" description="Track campaign delivery, reviews and timelines." action={<Button variant="light" icon={Download}>Export</Button>} />
    <div className="stats-grid compact-stats"><StatCard label="All campaigns" value="64" change="Across 28 clients" icon={BriefcaseIcon} /><StatCard label="In progress" value="18" change="On track" icon={Clock3} /><StatCard label="Needs review" value="09" change="2 due today" direction="down" icon={MessageSquareText} /></div>
    <div className="filter-bar"><label className="search-field"><Search size={16} /><input placeholder="Search campaigns..." /></label><button className="filter-button"><Filter size={15} /> All statuses <ChevronRight size={14} /></button><span className="result-count">64 campaigns</span></div>
    <Panel className="table-panel"><CampaignTable campaigns={demoCampaigns} onSelect={(campaign) => navigate(`/admin/campaigns/${campaign.id}`)} /></Panel>
    <div className="note-line"><span className="demo-dot" /> Sample campaign rows only. Connect the existing API to load real campaign records.</div>
  </>;
}

export function ClientCampaigns() {
  const navigate = useNavigate();
  const campaigns = demoCampaigns.filter((campaign) => campaign.client === "Northstar Studio");
  return <>
    <PageHeading eyebrow="YOUR WORK" title="My campaigns" description="A clear view of everything your team is bringing to life." action={<Button variant="light" icon={CircleHelp}>How campaigns work</Button>} />
    <div className="stats-grid compact-stats"><StatCard label="Your campaigns" value="04" change="Across 2 channels" icon={Sparkles} /><StatCard label="In progress" value="02" change="One update today" icon={Clock3} /><StatCard label="Needs your review" value="01" change="Ready when you are" direction="down" icon={MessageSquareText} /></div>
    <Panel title="Your campaign list" subtitle="Campaigns linked to your sample workspace"><CampaignTable campaigns={campaigns} onSelect={(campaign) => navigate(`/client/campaigns/${campaign.id}`)} /></Panel>
    <div className="note-line"><span className="demo-dot" /> Sample campaign rows for the Northstar Studio preview account only.</div>
  </>;
}

export function CampaignDetails({ audience }) {
  const { campaignId } = useParams();
  const campaigns = audience === "client"
    ? demoCampaigns.filter((item) => item.client === "Northstar Studio")
    : demoCampaigns;
  const campaign = campaigns.find((item) => item.id === campaignId);
  if (!campaign) return <><PageHeading eyebrow={audience === "admin" ? "CAMPAIGN OVERVIEW" : "MY CAMPAIGNS"} title="Campaign not found" description="This campaign is not available in the current sample workspace." /><EmptyState /></>;
  return <>
    <PageHeading eyebrow={audience === "admin" ? "CAMPAIGN OVERVIEW" : "MY CAMPAIGNS"} title={campaign.title} description={`${campaign.client} · ${campaign.id}`} action={<Button variant="light" icon={MessageSquareText}>Ask a question</Button>} />
    <div className="detail-grid"><Panel title="Campaign details" subtitle="Your team’s current delivery snapshot"><DetailRow label="Status"><StatusPill>{campaign.status}</StatusPill></DetailRow><DetailRow label="Channel">{campaign.channel}</DetailRow><DetailRow label="Target date">{campaign.date}</DetailRow><DetailRow label="Campaign budget">{campaign.budget}</DetailRow><DetailRow label="Account">{campaign.client}</DetailRow></Panel><Panel title="Latest update" subtitle="Posted by your account team"><div className="update-card"><div className="update-icon"><Sparkles size={18} /></div><div><b>Campaign is moving along nicely</b><p>We’re aligning the creator shortlist with your campaign goals. We’ll share it for review shortly.</p><small>Today · 10:42 AM</small></div></div><button className="text-link panel-bottom-link">View campaign timeline <ArrowRight size={15} /></button></Panel></div>
    <Panel title="Recent activity"><EmptyState title="Activity will appear here" detail="Campaign updates will be connected to the existing campaign APIs." /></Panel>
  </>;
}

export function GenericWorkspacePage({ title, audience, type = "placeholder" }) {
  const client = audience === "client";
  if (type === "client-plans") {
    return <><PageHeading eyebrow="YOUR PARTNERSHIP" title="My plans" description="A clear view of your current partnership and plan details." action={<Button variant="light" icon={CircleHelp}>Talk to your team</Button>} /><div className="plan-feature"><div className="plan-top"><span className="plan-label">YOUR CURRENT PLAN</span><StatusPill>Active</StatusPill></div><h2>Growth</h2><p>More momentum, with room to experiment.</p><div className="plan-divider" /><div className="plan-facts"><span><small>Renewal date</small><b>July 01, 2025</b></span><span><small>Billing cycle</small><b>Monthly</b></span><span><small>Account manager</small><b>Your SocialBureau team</b></span></div></div><Panel title="Plan benefits" subtitle="A snapshot of what your current plan includes"><div className="benefit-grid">{["Campaign planning & strategy", "Creator partnership support", "Monthly performance review", "Dedicated account manager"].map((item) => <div key={item}><span className="check-mark"><Check size={14} /></span>{item}</div>)}</div></Panel><div className="note-line"><span className="demo-dot" /> Illustrative plan details. Connect the existing subscription API to show your account information.</div></>;
  }
  if (type === "admin-plans") {
    return <><PageHeading eyebrow="OFFERINGS" title="Plans overview" description="Manage the plans available across your client portfolio." action={<Button icon={Plus}>Create plan</Button>} /><div className="plan-grid">{demoPlans.map((plan, index) => <div className={`plan-card ${index === 1 ? "featured" : ""}`} key={plan.name}><div className="plan-card-top"><span className="plan-label">0{index + 1} / PLAN</span><StatusPill>{plan.status}</StatusPill></div><h2>{plan.name}</h2><p>{plan.description}</p><div className="plan-card-price">{plan.price}<small>{plan.price === "Custom" ? "" : " / month"}</small></div><div className="plan-divider" /><div className="plan-client-count"><Users size={15} />{plan.clients} client accounts</div><button className="text-link">View plan details <ArrowRight size={15} /></button></div>)}</div><div className="note-line"><span className="demo-dot" /> Sample plans. Existing campaign plans are distinct from client subscription records.</div></>;
  }
  if (type === "analytics") {
    return <><PageHeading eyebrow="PERFORMANCE" title={title} description={client ? "A clear view of activity across your campaigns." : "A portfolio snapshot of campaign activity."} /><Panel title="Campaign activity" subtitle={demoAnalytics.label} action={<span className="chart-caption">SAMPLE DATA</span>}><TrendChart values={demoAnalytics.values} months={demoAnalytics.months} /></Panel><div className="stats-grid"><StatCard label="Views tracked" value="—" change="Connect analytics to load" icon={ChartNoAxesCombined} /><StatCard label="Engagement" value="—" change="No live metrics connected" icon={Sparkles} /><StatCard label="Reports ready" value="—" change="Sample values are disabled" icon={FileText} /></div><div className="note-line"><span className="demo-dot" /> Analytics chart is illustrative only; no mock performance is presented as real.</div></>;
  }
  if (type === "updates") {
    return <><PageHeading eyebrow="YOUR TEAM" title={title} description="Little notes, milestones and next steps from your team." /><div className="timeline">{demoUpdates.map((update) => <div className="timeline-row" key={update.title}><div className={`timeline-icon ${update.type}`}><Activity size={17} /></div><div className="timeline-body"><b>{update.title}</b><p>{update.detail}</p><small>{update.time}</small></div></div>)}</div><div className="note-line"><span className="demo-dot" /> Example updates for UI development. Live updates require an API or event feed.</div></>;
  }
  if (type === "team") {
    return <><PageHeading eyebrow={client ? "YOUR PEOPLE" : "PEOPLE & ACCESS"} title={title} description={client ? "Meet the people supporting your brand." : "Review workspace access and team roles."} action={client ? null : <Button icon={Plus}>Invite teammate</Button>} /><Panel title={client ? "Your account team" : "Workspace team"} subtitle="Team directory integration is not configured"><EmptyState title="Team access is not connected" detail={client ? "Your account team will appear when the workspace API is available." : "Invites and account-level access need a backend API before access can be granted."} /></Panel></>;
  }
  if (type === "notifications") {
    return <><PageHeading eyebrow="UPDATES" title={title} description="Important reviews, milestones and account activity." /><div className="timeline">{demoUpdates.map((update) => <div className="timeline-row" key={update.title}><div className={`timeline-icon ${update.type}`}><BellIcon /></div><div className="timeline-body"><b>{update.title}</b><p>{update.detail}</p><small>{update.time}</small></div></div>)}</div></>;
  }
  if (type === "support") {
    return <><PageHeading eyebrow="WE’RE HERE FOR YOU" title={title} description="Reach out to your account team. We’ll be happy to help." /><div className="support-layout"><Panel title="Send a message" subtitle="Typical response time: one business day"><label className="form-label">What can we help with?<select defaultValue="campaign"><option value="campaign">Campaign question</option><option value="billing">Plan or billing question</option><option value="other">Something else</option></select></label><label className="form-label">Your message<textarea placeholder="Tell us a little more..." rows="5" /></label><Button icon={Send}>Send message</Button></Panel><Panel title="A few quick answers"><div className="faq-row"><b>Where can I see campaign progress?</b><ChevronRight size={16} /></div><div className="faq-row"><b>How do I share feedback?</b><ChevronRight size={16} /></div><div className="faq-row"><b>Who is my account manager?</b><ChevronRight size={16} /></div></Panel></div></>;
  }
  if (type === "settings") {
    return <><PageHeading eyebrow="PREFERENCES" title={title} description="Workspace preferences and account details." /><Panel title="Workspace preferences" subtitle="Settings are not saved in this UI preview"><div className="settings-row"><div><b>Workspace profile</b><p>Company details and contact preferences</p></div><button className="button button-light">Manage</button></div><div className="settings-row"><div><b>Notifications</b><p>Choose which updates reach your inbox</p></div><button className="button button-light">Preferences</button></div><div className="settings-row"><div><b>Security & access</b><p>Sign-in and workspace access settings</p></div><button className="button button-light">Review</button></div></Panel></>;
  }
  return <><PageHeading eyebrow={client ? "YOUR WORKSPACE" : "WORKSPACE ADMIN"} title={title} description="This section is ready for its backend integration." /><Panel title="Coming together" subtitle="A working placeholder for this workspace module"><EmptyState title={`${title} will live here`} detail="This UI is intentionally using separated sample data. Connect the matching SocialBureau API before displaying or changing real account information." /></Panel></>;
}

function BriefcaseIcon(props) {
  return <Sparkles {...props} />;
}

function BellIcon() {
  return <MessageSquareText size={17} />;
}

function CampaignTable({ campaigns, onSelect }) {
  return <DataTable columns={[
    { key: "title", label: "CAMPAIGN", render: (campaign) => <div className="campaign-name"><span className="campaign-mark"><Sparkles size={15} /></span><span><b>{campaign.title}</b><small>{campaign.id} · {campaign.client}</small></span></div> },
    { key: "channel", label: "CHANNEL" },
    { key: "status", label: "STATUS", render: (campaign) => <StatusPill>{campaign.status}</StatusPill> },
    { key: "date", label: "TARGET DATE" },
    { key: "budget", label: "BUDGET" },
  ]} rows={campaigns} onRowClick={onSelect} />;
}

function ClientName({ client, large = false }) {
  return <div className={`client-name ${large ? "client-name-large" : ""}`}><span className={`client-avatar ${client.color}`}>{client.initials}</span><span><b>{client.name}</b>{large && <small>{client.email}</small>}</span></div>;
}

function AttentionItem({ icon: Icon, title, detail, time }) {
  return <div className="attention-item"><span className="attention-icon"><Icon size={16} /></span><div className="attention-copy"><b>{title}</b><small>{detail}</small></div><span className="attention-time">{time}</span></div>;
}

function DetailRow({ label, children }) {
  return <div className="detail-row"><span>{label}</span><b>{children}</b></div>;
}
