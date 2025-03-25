import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs() {
  const location = useLocation();
  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb, index, array) => {
      currentLink += `/${crumb}`;

      const formattedCrumb = crumb.replace(/_/g, " ");

      const isLast = index === array.length - 1;

      return (
        <div className="crumb" key={currentLink}>
          {isLast ? (
            <span className="disabled">{formattedCrumb}</span>
          ) : (
            <Link to={currentLink}>{formattedCrumb}</Link>
          )}
        </div>
      );
    });

  return <div className="breadcrumbs">{crumbs}</div>;
}
