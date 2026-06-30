import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb { label: string; href?: string }

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        {breadcrumbs && (
          <div className="flex items-center gap-1 text-sm text-muted mb-1">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={13} />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-charcoal transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-charcoal font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
