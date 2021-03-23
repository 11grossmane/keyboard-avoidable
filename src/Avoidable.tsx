import * as React from "react";
import {
  Dimensions,
  Keyboard,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

const { width, height } = Dimensions.get("screen");

export type AvoidableProps = {
  containerStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  focusedItemStyle?: ViewStyle;
};

export const Avoidable: React.FC<AvoidableProps> = ({
  children,
  containerStyle,
  overlayStyle,
  focusedItemStyle,
}) => {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [touchable, setTouchable] = React.useState("");

  React.useEffect(() => {
    Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
  }, []);

  const getStyle = (str: string): StyleProp<ViewStyle> => {
    console.log(touchable, str, "tpucj", "sdfs");
    if (keyboardHeight && touchable === str) {
      return {
        zIndex: 2,
        position: "absolute",
        width,
        bottom: keyboardHeight + 20,
        ...focusedItemStyle,
      };
    }
    return {};
  };
  console.log("touchable", touchable);
  return (
    <View style={containerStyle}>
      {!!keyboardHeight && !!touchable && (
        <View
          style={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,1)",
            opacity: 0.5,
            height,
            width,
            ...overlayStyle,
          }}
        />
      )}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return false;
        if (!child?.key) throw new Error("children keys must be present");
        let keyStr = child.key.toString();
        return (
          <TouchableWithoutFeedback
            onFocus={() => {
              console.log("keyStr", keyStr);
              setTouchable(keyStr);
            }}
          >
            <View style={[getStyle(keyStr)]}>{child}</View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};
