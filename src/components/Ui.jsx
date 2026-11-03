import { ArrowDownRight, ArrowUpRight, CircleHelp, MoreHorizontal } from "lucide-react";

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

export function DemoNotice({ children = "Sample UI data — not live campaign performance." }) {
  return <div className="demo-notice"><span className="demo-dot" />{children}</div>;
}

export function StatusPill({ children }) {
  const tone = String(children).toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}

export function StatCard({ label, value, change, direction = "up", icon: Icon }) {
  const Trend = direction === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span>{Icon && <span className="stat-icon"><Icon size={17} /></span>}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${direction}`}><Trend size={15} />{change}<span> vs last month</span></div>
    </article>
  );
}

export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && <div className="panel-heading"><div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div>{action}</div>}
      {children}
    </section>
  );
}

export function DataTable({ columns, rows, rowKey = "id", onRowClick }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}<th aria-label="More actions" /></tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[rowKey] || index} onClick={() => onRowClick?.(row)} className={onRowClick ? "clickable-row" : ""}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
              <td className="more-cell"><MoreHorizontal size={17} /></td>
            </tr>
          ))}
          {!rows.length && <tr><td className="empty-state" colSpan={columns.length + 1}>Nothing here yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function TrendChart({ values, months }) {
  return (
    <div className="chart-wrap" role="img" aria-label="Illustrative monthly activity chart">
      <div className="chart-grid">{[0, 1, 2, 3].map((item) => <span key={item} />)}</div>
      <div className="chart-bars">{values.map((value, index) => <div className="chart-bar-group" key={index}><div className="chart-bar" style={{ height: `${value}%` }} /></div>)}</div>
      <div className="chart-months">{months.map((month) => <span key={month}>{month}</span>)}</div>
    </div>
  );
}

export function EmptyState({ title = "Your workspace is taking shape", detail = "Once connected, your workspace updates will appear here." }) {
  return <div className="empty-block"><div className="empty-mark"><CircleHelp size={20} /></div><h3>{title}</h3><p>{detail}</p></div>;
}

export function Button({ children, variant = "primary", icon: Icon, ...props }) {
  return <button className={`button button-${variant}`} {...props}>{Icon && <Icon size={16} />}{children}</button>;
}
