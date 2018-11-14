import React from "react";
import { createStackNavigator } from "react-navigation";
import Feather from "react-native-vector-icons/Feather";
import createBottomTabNavigator from "./tabNavigator/createTabNavigator";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import AccountScreen from "./screens/AccountScreen";
import BookScreen from "./screens/PlayerScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import NewReviewScreen from "./screens/NewReviewScreen";
import CategoryScreen from "./screens/CategoryScreen";
import VideoScreen from "./screens/VideoScreen";
import { colors } from "./utils/themes";

const MAP_ROUTER_ICON_NAME = {
  Home: "book",
  Search: "search",
  Account: "user"
};

const HomeTabNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      path: "/"
    },
    BookScreen: {
      screen: BookScreen,
      path: "/book/:id"
    },
    ReviewsScreen: {
      screen: ReviewsScreen,
      path: "/review/:id"
    },
    NewReviewScreen: {
      screen: NewReviewScreen,
      path: "/new-review"
    },
    VideoScreen: {
      screen: VideoScreen
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
);

const SearchNavigator = createStackNavigator(
  {
    Search: {
      screen: SearchScreen,
      path: "/"
    },
    VideoScreen: {
      screen: VideoScreen
    },
    CategoryScreen: {
      screen: CategoryScreen,
      path: "/category/:id"
    },
    BookScreen: {
      screen: BookScreen,
      path: "/book/:id"
    },
    ReviewsScreen: {
      screen: ReviewsScreen,
      path: "/review/:id"
    },
    NewReviewScreen: {
      screen: NewReviewScreen,
      path: "/new-review"
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
);

const TabbarStack = createBottomTabNavigator(
  {
    Home: {
      screen: HomeTabNavigator,
      path: "/home/"
    },
    Search: {
      screen: SearchNavigator,
      path: "/search/"
    },
    Account: {
      screen: AccountScreen,
      path: "/account/"
    }
  },
  {
    //  crossTabsComponent: <Player />,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => (
        <Feather
          name={MAP_ROUTER_ICON_NAME[navigation.state.routeName]}
          size={25}
          color={tintColor}
        />
      )
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.black,
      inactiveTintColor: colors.textSecondary,
      activeBackgroundColor: colors.lightOpacity,
      inactiveBackgroundColor: colors.lightOpacity,
      style: {
        borderTopWidth: 0
      }
    }
  }
);

export default TabbarStack;
