import React from "react";
import shortid from "shortid";

class TodoForm extends React.Component {
  state = {
    text: ""
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
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
      <div className="todo-input">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="text"
            value={this.state.text}
            onChange={this.handleChange}
            placeholder="Todo HERE"
          />
          <button onClick={this.handleSubmit}>Add Todo</button>
        </form>
      </div>
    );
  }
}

export default TodoForm;
