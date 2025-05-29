import React from "react";
import { InputGroup, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const StoresFilter = ({
  searchQuery,
  setSearchQuery,
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mb-5">
      <div className="d-flex gap-3 flex-column flex-md-row">
        <InputGroup style={{ flex: 2 }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Form.Select
          style={{ flex: 1 }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Select category"
        >
          <option value="">All Categories</option>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </Form.Select>
   
      </div>
    </div>
  );
};

export default StoresFilter;
