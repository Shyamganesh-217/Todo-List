import { useEffect, useState } from 'react';
import './todo.css';

const TODO_STORAGE_KEY = 'todos';

function TodoList() {
  // =====================================================
  // 1. TODO LIST STATE
  // =====================================================
  const [todos, setTodos] = useState(() => {
    try {
      const storedTodos = localStorage.getItem(TODO_STORAGE_KEY);
      const parsedTodos = storedTodos ? JSON.parse(storedTodos) : [];
      return Array.isArray(parsedTodos) ? parsedTodos : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // =====================================================
  // 2. INPUT BOX STATE
  // =====================================================
  const [input, setInput] = useState("");

  // =====================================================
  // 3. EDIT ID STATE
  // Stores which todo is currently being edited
  // =====================================================
  const [editId, setEditId] = useState(null);

  // =====================================================
  // 4. EDIT TEXT STATE
  // Stores the text inside edit input
  // =====================================================
  const [editText, setEditText] = useState("");

  // =====================================================
  // ADD TODO
  // =====================================================
  const handleAdd = () => {
    // Empty input check
    if (input.trim() === "") {
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    // Add new todo
    setTodos([...todos, newTodo]);

    // Clear input
    setInput("");
  };

  // =====================================================
  // UPDATE TODO
  // =====================================================
  const handleUpdate = () => {
    // Empty edit text check
    if (editText.trim() === "") {
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === editId
          ? {
              ...todo,
              text: editText.trim(),
            }
          : todo
      )
    );

    // Exit edit mode
    setEditId(null);

    // Clear edit text
    setEditText("");
  };

  // =====================================================
  // DELETE TODO
  // =====================================================
  const handleDelete = (id) => {
    setTodos(
      todos.filter((todo) => todo.id !== id)
    );

    // If deleting the currently edited todo
    if (editId === id) {
      setEditId(null);
      setEditText("");
    }
  };

  // =====================================================
  // COMPLETE / UNCOMPLETE TODO
  // =====================================================
  const handleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  };

  // =====================================================
  // START EDIT
  // =====================================================
  const handleEdit = (todo) => {
    // Store todo ID
    setEditId(todo.id);

    // Put existing text inside edit input
    setEditText(todo.text);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================
  const handleCancel = () => {
    // Exit edit mode
    setEditId(null);

    // Clear edit input
    setEditText("");
  };

  // =====================================================
  // MAIN INPUT KEYBOARD EVENTS
  // Enter → Add Todo
  // =====================================================
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  // =====================================================
  // EDIT INPUT KEYBOARD EVENTS
  // Enter  → Update
  // Escape → Cancel
  // =====================================================
  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    }

    if (e.key === "Escape") {
      handleCancel();
    }
  };

  // =====================================================
  // COMPLETED TASK COUNT
  // =====================================================
  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  // =====================================================
  // JSX
  // =====================================================
  return (
    <div className="todo-container">

      <h1>Todo List</h1>

      {/* =================================================
          MAIN INPUT SECTION
      ================================================= */}
      <div className="input-section">

        <input
          type="text"
          placeholder="Enter your task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />

        <button onClick={handleAdd}>
          Add
        </button>

      </div>

      {/* =================================================
          TODO LIST
      ================================================= */}
      <ul className="todo-list">

        {todos.length === 0 ? (
          <p className="empty-message">
            No tasks yet. Add a task!
          </p>
        ) : (
          todos.map((todo) => (

            <li
              key={todo.id}
              className="todo-item"
            >

              {/* =================================================
                  EDIT MODE
              ================================================= */}
              {editId === todo.id ? (

                <div className="edit-section">

                  <input
                    type="text"
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    onKeyDown={handleEditKeyDown}
                    autoFocus
                  />

                  <button
                    className="save-btn"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                </div>

              ) : (

                /* =================================================
                   NORMAL / VIEW MODE
                ================================================= */
                <>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      handleComplete(todo.id)
                    }
                  />

                  {/* Todo Text */}
                  <span
                    className={
                      todo.completed
                        ? "completed"
                        : ""
                    }
                  >
                    {todo.text}
                  </span>

                  {/* Buttons */}
                  <div className="buttons">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(todo)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(todo.id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                </>

              )}

            </li>

          ))
        )}

      </ul>

      {/* =================================================
          TASK COUNT
      ================================================= */}
      <div className="task-count">

        <span>
          Total Tasks: {todos.length}
        </span>

        <span>
          Completed: {completedCount}
        </span>

      </div>

    </div>
  );
}

export default TodoList;

