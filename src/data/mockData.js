export const demoClients = [
  { id: "cl-1001", name: "Northstar Studio", contact: "Aarav Mehta", email: "aarav@northstar.example", initials: "NS", color: "violet", campaigns: 4, plan: "Growth", status: "Active", since: "Jan 2025" },
  { id: "cl-1002", name: "The Good Grain", contact: "Mira Kapoor", email: "mira@goodgrain.example", initials: "GG", color: "amber", campaigns: 2, plan: "Essential", status: "Active", since: "Mar 2025" },
  { id: "cl-1003", name: "Forma Living", contact: "Rohan Shah", email: "rohan@formaliving.example", initials: "FL", color: "blue", campaigns: 3, plan: "Scale", status: "Onboarding", since: "Apr 2025" },
  { id: "cl-1004", name: "Kindred Health", contact: "Sana Iyer", email: "sana@kindred.example", initials: "KH", color: "rose", campaigns: 1, plan: "Essential", status: "Active", since: "May 2025" },
];

export const demoCampaigns = [
  { id: "SB-24081", title: "Summer stories, made social", client: "Northstar Studio", channel: "Instagram", status: "In progress", date: "Jun 12, 2025", budget: "₹1,24,000" },
  { id: "SB-24079", title: "A little good in every bowl", client: "The Good Grain", channel: "YouTube", status: "Scheduled", date: "Jun 18, 2025", budget: "₹86,500" },
  { id: "SB-24074", title: "Spaces that feel like home", client: "Forma Living", channel: "Instagram", status: "In review", date: "Jun 20, 2025", budget: "₹1,58,000" },
  { id: "SB-24068", title: "Move well, live well", client: "Kindred Health", channel: "YouTube", status: "Completed", date: "May 28, 2025", budget: "₹72,000" },
];

export const demoPlans = [
  { name: "Essential", description: "A considered start for growing brands", clients: 12, price: "₹24,000", status: "Available" },
  { name: "Growth", description: "More momentum, with room to experiment", clients: 8, price: "₹48,000", status: "Available" },
  { name: "Scale", description: "A full-service partnership for ambitious teams", clients: 4, price: "Custom", status: "Available" },
];

export const demoUpdates = [
  { title: "Creator shortlist ready for review", detail: "Summer stories, made social · Northstar Studio", time: "12 min ago", type: "review" },
  { title: "Your campaign is scheduled", detail: "A little good in every bowl · The Good Grain", time: "2 hours ago", type: "success" },
  { title: "New report is ready", detail: "Move well, live well · Kindred Health", time: "Yesterday", type: "report" },
];

export const demoAnalytics = {
  label: "Illustrative monthly activity",
  values: [38, 51, 45, 70, 56, 76, 64, 88, 72, 94, 78, 100],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
};
