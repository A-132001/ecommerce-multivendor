import React, { useState } from 'react';

const OrdersList = ({ orders = [], onDelete, onEdit }) => {
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', total: '' });

  const handleEditClick = (order) => {
    setEditingOrderId(order.id);
    setEditForm({ status: order.status, total: order.total });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(editingOrderId, editForm);
    setEditingOrderId(null);
    setEditForm({ status: '', total: '' });
  };

  return (
    <div>
      <h3>Orders List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {editingOrderId === order.id ? (
                  <input
                    type="text"
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  order.status
                )}
              </td>
              <td>
                {editingOrderId === order.id ? (
                  <input
                    type="text"
                    name="total"
                    value={editForm.total}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  order.total
                )}
              </td>
              <td>
                {editingOrderId === order.id ? (
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={handleEditSubmit}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditClick(order)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;