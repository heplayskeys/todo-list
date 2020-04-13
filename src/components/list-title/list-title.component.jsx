import React from "react";

import "./list-title.styles.scss";

class ListTitle extends React.Component {
  constructor() {
    super();

    this.state = {
      title: "This is my Temp Title",
      editMode: false
    };
  }

  handleChange = event => {
    this.setState({
      title: event.target.value
    });
  };

  handleClick = () => {
    if (this.state.title === "") {
      return;
    }

    this.setState(state => ({
      editMode: !state.editMode
    }));

    this.render();
  };

  keyPressHandler = event => {
    if (this.state.title === "") {
      return;
    }

    if (event.key === "Enter") {
      this.setState({
        editMode: false
      });
    }
  };

  componentDidUpdate() {
    if (this.state.editMode) {
      document.querySelector("#title-input").focus();
    }
  }

  render() {
    let { title } = this.state;
    let listTitle = this.state.editMode ? (
      <input
        id="title-input"
        type="text"
        value={title}
        onBlur={this.handleClick}
        onChange={this.handleChange}
        onKeyPress={event => this.keyPressHandler(event)}
        maxLength="30"
        className={`${this.state.title ? "filled" : "empty"}`}
        placeholder="Feed me a title!"
      />
    ) : (
      <h1 className="title" onClick={this.handleClick}>
        {title}
        <span id="edit-title">&#9998;</span>
      </h1>
    );

    return <div className="title-container">{listTitle}</div>;
  }
}

export default ListTitle;
