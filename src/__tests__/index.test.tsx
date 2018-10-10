import * as React from "react";
// @ts-ignore
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import { MenuItem, ReactMegaMenu } from "../index";
import { MOCK_CATEGORIES } from "../../demo/src/MOCK_DATA.js";

// @ts-ignore
configure({ adapter: new Adapter() });
describe("ReactMegaMenu", () => {
  describe("MenuItem SubComponent", () => {
    let fn: any;
    let result: any;
    describe("unselected", () => {
      beforeEach(() => {
        fn = jest.fn();
        const fixture = (
          <MenuItem
            selected={false}
            label="test"
            props={{ className: "notSelected" }}
            selectedProps={{ className: "selected" }}
            mouseEntered={fn}
          />
        );
        // Act
        result = shallow(fixture);
      });
      // Arrange
      it("should render trigger mouseEntered function on mouseEnter", () => {
        result.simulate("mouseEnter");
        expect(fn).toHaveBeenCalledTimes(1);
      });
      it("should have notSelected className", () => {
        expect(result.props().className.includes("selected")).toBeFalsy();
        expect(result.props().className.includes("notSelected")).toBeTruthy();
      });
      it("should have label as text", () => {
        expect(result.text()).toEqual("test");
      });
    });
    describe("selected", () => {
      it("should have selected (w/ data) className", () => {
        fn = jest.fn();
        const fixture = (
          <MenuItem
            selected={true}
            hasData={true}
            label="test"
            props={{ className: "notSelected" }}
            selectedProps={{ className: "selected" }}
            mouseEntered={fn}
          />
        );
        // Act
        result = shallow(fixture);

        expect(result.props().className.includes("selected")).toBeTruthy();
      });
    });
  });
  describe("ReactMegaMenu Component", () => {
    let result: any;
    let exitFn: any;
    let instance: any;
    beforeEach(() => {
      exitFn = jest.fn();
      const fixture = <ReactMegaMenu data={MOCK_CATEGORIES} onExit={exitFn} />;
      result = mount(fixture);
      instance = result.instance();
    });
    describe("ReactMegaMenu subfunctions", () => {
      it("should call onExit & set activeRow to -1 on mouseLeave", () => {
        instance.setState({ activeRow: 1 });
        expect(result.state().activeRow).toEqual(1);

        instance.mouseLeave();

        expect(result.state().activeRow).toEqual(-1);
        expect(exitFn).toHaveBeenCalledTimes(1);
      });

      it("should call possiblyActivate w/ row # on mouseEnterRow", () => {
        jest.spyOn(instance, "possiblyActivate");

        instance.mouseEnterRow(1)();

        expect(instance.possiblyActivate).toHaveBeenCalledWith(1);
      });

      describe("possiblyActivate", () => {
        it("should activate if delay is 0", () => {
          jest.spyOn(instance, "activate");
          instance.getActivationDelay = jest.fn().mockReturnValue(0);
          instance.possiblyActivate(1);
          expect(instance.activate).toHaveBeenCalledWith(1);
        });
        it("should not activate & setTimeOut if delay > 0", () => {
          jest.spyOn(instance, "activate");
          instance.getActivationDelay = jest.fn().mockReturnValue(999);
          instance.possiblyActivate(1);
          expect(result.state().timeoutID).toBeTruthy();
          expect(instance.activate).not.toHaveBeenCalled();
        });
      });

      describe("activate", () => {
        it("should not set state if same row is already active", () => {
          jest.spyOn(instance, "setState");
          instance.setState({ activeRow: 1 });
          instance.activate(1);
          expect(instance.setState).toHaveBeenCalledTimes(1);
          expect(instance.setState).toHaveBeenCalledWith({ activeRow: 1 });
        });
      });

      it("genCoords should return input as {x,y} object", () => {
        jest.spyOn(instance, "genCoords");
        instance.genCoords(1, 2);
        expect(instance.genCoords).toReturnWith({ x: 1, y: 2 });
      });

      it("recordMouse should record mouse location", () => {
        jest.spyOn(instance, "setState");
        instance.recordMouse({ pageX: 10, pageY: 20 });
        expect(result.state().mouseLocs).toEqual([{ x: 10, y: 20 }]);
      });

      it("calcSlope should return slope", () => {
        const a = { x: 10, y: 10 };
        const b = { x: 20, y: 20 };
        jest.spyOn(instance, "calcSlope");

        instance.calcSlope(a, b);
        expect(instance.calcSlope).toReturnWith(1);
      });

      it("enterSubMenu should call dismissTimeout", () => {
        jest.spyOn(instance, "dismissTimeout");
        instance.enterSubMenu();
        expect(instance.dismissTimeout).toHaveBeenCalledTimes(1);
      });

      it("dismissTimeout should call clearTimeout w/timeoutID", () => {
        instance.setState({ timeoutID: 1 });
        jest.spyOn(window, "clearTimeout");
        instance.dismissTimeout();
        expect(clearTimeout).toHaveBeenCalledWith(1);
      });

      describe("getActivationDelay", () => {
        beforeEach(() => {
          jest.spyOn(instance, "getActivationDelay");
          jest.spyOn(instance.instance.current, "getBoundingClientRect");
          instance.instance.current.getBoundingClientRect.mockReturnValue({
            left: 0,
            top: 0,
            height: 200,
            width: 200
          });
        });
        it("should return 0 w/ no active row", () => {
          instance.getActivationDelay();
          expect(instance.getActivationDelay).toReturnWith(0);
        });
        it("should return 0 w/ no mouseLocations", () => {
          instance.setState({ activeRow: 1 });
          instance.getActivationDelay();
          expect(instance.getActivationDelay).toReturnWith(0);
        });
        it("should return 0 if mouseLocs were out of bounds", () => {
          instance.setState({ activeRow: 1 });
          instance.setState({
            mouseLocs: [{ x: -999, y: -999 }, { x: 50, y: 50 }]
          });
          instance.getActivationDelay();
          expect(instance.getActivationDelay).toReturnWith(0);
        });
        it("should return 0 if mouse hasnt moved", () => {
          instance.setState({ activeRow: 1 });
          instance.setState({
            lastDelayLoc: { x: 50, y: 50 },
            mouseLocs: [{ x: 50, y: 50 }, { x: 50, y: 50 }]
          });

          instance.getActivationDelay();
          expect(instance.getActivationDelay).toReturnWith(0);
        });
        it("should return DELAY if moving towards submenu", () => {
          instance.setState({ activeRow: 1 });
          instance.setState({
            lastDelayLoc: { x: 20, y: 20 },
            mouseLocs: [{ x: 50, y: 50 }, { x: 60, y: 55 }]
          });
          jest.spyOn(instance, "setState");
          instance.getActivationDelay();
          expect(instance.setState).toHaveBeenCalledWith({
            lastDelayLoc: { x: 60, y: 55 }
          });
          expect(instance.getActivationDelay).toReturnWith(ReactMegaMenu.DELAY);
        });
        it("should return 0 & reset lastDelayLoc as default (mouse moves up/down).", () => {
          instance.setState({ activeRow: 1 });
          instance.setState({
            lastDelayLoc: { x: 20, y: 20 },
            mouseLocs: [{ x: 50, y: 50 }, { x: 50, y: 70 }]
          });
          jest.spyOn(instance, "setState");
          instance.getActivationDelay();
          expect(instance.setState).toHaveBeenCalledWith({
            lastDelayLoc: undefined
          });
          expect(instance.getActivationDelay).toReturnWith(0);
        });
      });
    });
    it("should render correctly", () => {
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });
});
