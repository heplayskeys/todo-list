import React from "react";
import shortid from "shortid";

import "./todo-form.styles.scss";

class TodoForm extends React.Component {
  constructor() {
    super();

    this.state = {
      text: ""
    };
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    // Submit Form
    if (this.state.text === "") {
      // TODO: Empty Input Field Error Handling Here
      return;
    }

    this.props.onSubmit({
      id: shortid.generate(),
      text: this.state.text,
      complete: false
    });
    this.setState({
      text: ""
    });
  };

  render() {
    return (
      <div className="todo-form">
        <form className="form-container" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="text"
            value={this.state.text}
            onChange={this.handleChange}
            placeholder="Enter Your ToDos Here"
            className="form-control"
          />
          <button
            className="add-todo-btn btn btn-dark"
            onClick={this.handleSubmit}
          >
            Add ToDo
          </button>
        </form>
      </div>
    );
  }
}

export default TodoForm;
