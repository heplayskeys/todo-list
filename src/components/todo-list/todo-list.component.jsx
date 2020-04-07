import React from "react";
import TodoForm from "../todo-form/todo-form.component";
import Todo from "../todo/todo.component";

class TodoList extends React.Component {
  state = {
    todos: [],
    todoFilter: "all"
  };

  addTodo = todo => {
    this.setState(state => ({
      todos: [todo, ...state.todos]
    }));
  };

  deleteTodo = id => {
    this.setState(state => ({
      todos: state.todos.filter(todo => todo.id !== id)
    }));
  };

  deleteCompleteTodos = () => {
    this.setState(state => ({
      todos: state.todos.filter(todo => !todo.complete)
    }));
  };

  markAllComplete = () => {
    this.setState(state => ({
      todos: state.todos.map(todo => ({
        ...todo,
        complete: true
      }))
    }));
  };

  setAllActive = () => {
    this.setState(state => ({
      todos: state.todos.map(todo => ({
        ...todo,
        complete: false
      }))
    }));
  };

  filterTodos = event => {
    this.setState({
      todoFilter: event.target.name
    });
  };

  toggleComplete = id => {
    this.setState(state => ({
      todos: state.todos.map(todo => {
        if (todo.id === id) {
          todo.complete = !todo.complete;
        }
        return todo;
      })
    }));
  };

  render() {
    let todos = [];
    let clearTodosBtn = this.state.todos.some(todo => todo.complete) ? (
      <button onClick={this.deleteCompleteTodos}>Clear Completed</button>
    ) : null;

    let allComplete = this.state.todos.some(todo => !todo.complete) ? (
      <button onClick={this.markAllComplete}>Mark All Complete</button>
    ) : null;

    let allActive = this.state.todos.some(todo => todo.complete) ? (
      <button onClick={this.setAllActive}>Set All Active</button>
    ) : null;

    switch (this.state.todoFilter) {
      case "active":
        todos = this.state.todos.filter(todo => !todo.complete);
        break;

      case "completed":
        todos = this.state.todos.filter(todo => todo.complete);
        break;

      default:
        todos = this.state.todos;
    }

    return (
      <div className="list-container">
        <div className="todo-input">
          <TodoForm onSubmit={this.addTodo} />
          {todos.map(todo => (
            <Todo
              key={todo.id}
              id={todo.id}
              deleteTodo={() => this.deleteTodo(todo.id)}
              toggleComplete={() => this.toggleComplete(todo.id)}
              todo={todo}
            />
          ))}
        </div>
        <div className="active-todos">
          Still Todos: {this.state.todos.filter(todo => !todo.complete).length}
        </div>
        <button name="all" onClick={this.filterTodos}>
          All
        </button>
        <button name="active" onClick={this.filterTodos}>
          Active
        </button>
        <button name="completed" onClick={this.filterTodos}>
          Completed
        </button>
        <div className="bulk-actions">
          {allComplete}
          {allActive}
          {clearTodosBtn}
        </div>
      </div>
    );
  }
}

export default TodoList;
