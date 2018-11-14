import React from "react";
import { StatusBar, Platform, YellowBox } from "react-native";
import { createStackNavigator } from "react-navigation";
import { colors } from "./utils/themes";
import TabbarStack from "./tabbar";
import { ApolloProvider } from "react-apollo";

import { CLIENT } from "./const";

export const client = CLIENT;
YellowBox.ignoreWarnings([
  "Remote debugger",
  "Trying to animate a view on an unmounted component"
]);

if (Platform.OS === "android") {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor(colors.transparent);
} else {
  StatusBar.setBarStyle("light-content");
}

const AppNavigator = createStackNavigator(
  {
    Tabbar: TabbarStack
    // ActionSheet: {
    //   screen: ActionScreen,
    //   navigationOptions: {
    //     gesturesEnabled: false
    //   }
    // }
  },
  {
    mode: "modal",
    headerMode: "none",
    cardStyle: {
      backgroundColor: colors.transparent
    }
  }
);

const App = () => (
  <ApolloProvider client={client}>
    <AppNavigator />
  </ApolloProvider>
);

export default App;
