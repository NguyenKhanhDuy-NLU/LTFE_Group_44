import { Link } from "react-router-dom";
import type { BreadcrumbItem } from "../../types";

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
}
export default function AppBreadcrumb({ items }: AppBreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb small mb-3">
        {items.map((item) => {
          if (item.to) {
            return (
              <li className="breadcrumb-item" key={item.label}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            );
          }
          return (
            <li className="breadcrumb-item active" aria-current="page" key={item.label}>
              {item.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


