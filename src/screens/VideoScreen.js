import React, { Component } from "react";
import { WebView, Text, View, Animated, Easing } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";

import { colors } from "../utils/themes";

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }

  render() {
    const { uri, title } = this.props.navigation.state.params;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", marginTop: 30 }}>
          <Feather
            name={"arrow-left"}
            size={35}
            color={colors.black}
            style={{ marginLeft: 20 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{ marginLeft: 10, flexDirection: "row" }}>
            <Animated.View
              style={{
                marginLeft: 5,
                height: 20,
                marginTop: 10,
                transform: [{ rotate: spin }]
              }}
            >
              <Icon name="ios-football" size={20} />
            </Animated.View>
            <View>
              <Text
                style={{
                  color: colors.accent,
                  textAlign: "center",
                  fontSize: 25,
                  fontWeight: "600",
                  flex: 1,
                  marginLeft: 10,
                  marginRight: 5
                }}
              >
                {title}
              </Text>
            </View>
          </View>
        </View>
        <WebView
          source={{ uri }}
          style={{ marginVertical: 20, marginHorizontal: 5, borderRadius: 14 }}
        />
      </View>
    );
  }
}
