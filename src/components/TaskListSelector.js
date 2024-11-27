import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TaskListSelector({ 
  taskLists, 
  activeListId, 
  onSelectList, 
  onAddList, 
  onEditList,
  onDeleteList 
}) {
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');

  const handleAddList = () => {
    const trimmedName = newListName.trim();
    if (trimmedName) {
      // Check for duplicate name before adding
      const isDuplicate = taskLists.some(list => 
        list.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        setError('A list with this name already exists!');
        setTimeout(() => setError(''), 3000);
        return;
      }

      onAddList(trimmedName);
      setNewListName('');
      setError('');
    }
  };

  const handleEditList = (listId) => {
    const list = taskLists.find(l => l.id === listId);
    setEditingListId(listId);
    setEditingName(list.name);
    setError('');
  };

  const saveEdit = (listId) => {
    const trimmedName = editingName.trim();
    if (trimmedName) {
      const success = onEditList(listId, trimmedName);
      if (!success) {
        setError('A list with this name already exists!');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setEditingListId(null);
      setError('');
    }
  };

  return (
    <div className="task-list-selector">
      <div className="list-selector-header">
        <h2>My Lists</h2>
        <div className="new-list-input">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
          />
          <button onClick={handleAddList}>Add List</button>
        </div>
        {error && <div className="list-name-error">{error}</div>}
      </div>
      <div className="lists-container">
        {taskLists.map(list => (
          <div 
            key={list.id}
            className={`list-item ${list.id === activeListId ? 'active' : ''}`}
          >
            {editingListId === list.id ? (
              <div className="list-edit-form">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(list.id)}
                  autoFocus
                />
                <button onClick={() => saveEdit(list.id)}>Save</button>
                <button onClick={() => {
                  setEditingListId(null);
                  setError('');
                }}>Cancel</button>
              </div>
            ) : (
              <div className="list-item-content">
                <span 
                  className="list-name"
                  onClick={() => onSelectList(list.id)}
                >
                  {list.name} ({list.tasks.length})
                </span>
                <div className="list-actions">
                  <button 
                    onClick={() => handleEditList(list.id)}
                    className="edit-btn"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => onDeleteList(list.id)}
                    className="delete-btn"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

TaskListSelector.propTypes = {
  taskLists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      tasks: PropTypes.array.isRequired
    })
  ).isRequired,
  activeListId: PropTypes.number,
  onSelectList: PropTypes.func.isRequired,
  onAddList: PropTypes.func.isRequired,
  onEditList: PropTypes.func.isRequired,
  onDeleteList: PropTypes.func.isRequired
};

export default TaskListSelector; 