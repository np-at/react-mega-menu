import React, { Component } from "react";
import { render } from "react-dom";

import Example from "../../src";
import { MOCK_CATEGORIES } from "./MOCK_DATA";

const values = ["LEFT", "RIGHT"];

class Demo extends Component {
  state = {
    direction: values[1]
  };

  clickButton = direction => () => {
    this.setState({ direction });
  };

  render() {
    return (
      <div>
        <h1>react-mega-menu Demo</h1>
        <div>
          {values.map(val => (
            <button key={val} onClick={this.clickButton(val)}>
              {val}
            </button>
          ))}
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: `${
              this.state.direction !== "LEFT" ? "row" : "row-reverse"
            }`
          }}
        >
          <Example
            styleConfig={{
              menuProps: {
                style: {
                  border: "2px solid red",
                  height: "20em",
                  width: "10em",
                  padding: "2px",
                  margin: "0"
                }
              },
              contentProps: {
                style: {
                  width: "10em",
                  border: "2px solid yellow",
                  padding: "2px"
                }
              },
              menuItemProps: {
                style: {
                  border: "2px solid green",
                  padding: "2px",
                  height: "2em"
                }
              },
              menuItemSelectedProps: {
                style: {
                  border: "2px solid purple",
                  padding: "2px",
                  height: "2em",
                  backgroundColor: "grey"
                }
              },
              containerProps: {
                style: {
                  border: "2px solid blue",
                  padding: "2px"
                }
              }
            }}
            direction={this.state.direction}
            data={MOCK_CATEGORIES}
          />
        </div>
        <div style={{ position: "absolute", top: "50%" }}>
          <h2>Component Outline:</h2>
          <fieldset
            style={{
              width: "30em",
              height: "20em",
              borderColor: "blue"
            }}
          >
            <legend>
              <b>container</b>
            </legend>
            <div
              style={{
                width: "100%",
                height: "95%",
                display: "flex",
                flexDirection: "row"
              }}
            >
              <fieldset style={{ borderColor: "red", width: "20%" }}>
                <legend>
                  <b>menu</b>
                </legend>
                <fieldset style={{ borderColor: "green" }}>
                  <legend>
                    <b>menuItem</b>
                  </legend>
                </fieldset>
                <fieldset style={{ borderColor: "green" }}>
                  <legend>
                    <b>menuItem</b>
                  </legend>
                </fieldset>
                <fieldset style={{ borderColor: "purple" }}>
                  <legend>
                    <b>menuItemSelected</b>
                  </legend>
                </fieldset>
              </fieldset>
              <fieldset style={{ borderColor: "orange", width: "80%" }}>
                <legend>
                  <b>content</b>
                </legend>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <label>data[selected].items</label>
                </div>
              </fieldset>
            </div>
          </fieldset>
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
