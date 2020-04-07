import React from "react";
import "./todo.styles.scss";

const Todo = props => {
  const {
    todo: { id, text, complete },
    toggleComplete,
    deleteTodo
  } = props;

  return (
    <div className="todo-container">
      <div className={`${complete ? "complete" : ""}`} onClick={toggleComplete}>
        {text}
      </div>
      <button className="delete-todo" onClick={deleteTodo}>
        X
      </button>
    </div>
  );
};

export default Todo;

// <input type="checkbox" id={id} name={id} onClick={toggleComplete} />
