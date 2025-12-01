import { useState } from "react";
import { Link } from "react-router-dom";
import MockData from "../../mocks/data.json";

const ServiceDropdown = ({ className }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Les catégories viennent DIRECtEMENT du JSON
  const categories = MockData.categories_list;

  return (
    <div
      className={`services-dropdown-container ${className}`}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <div className="dropdown-trigger">Services ▼</div>

      {isDropdownOpen && (
        <div className="dropdown-content">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/services/${cat.key}`}
              className="dropdown-link"
              onClick={() => setIsDropdownOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceDropdown;
