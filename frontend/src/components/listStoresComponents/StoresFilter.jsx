import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const StoresFilter = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="mb-5">
            <InputGroup>
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
        </div>
    );
};

export default StoresFilter;