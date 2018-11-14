/**
 * @format
 * @flow
 */
import React, { PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  Easing
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AnimatedFlatList from "../components/AnimatedFlatList";
import PrimaryHeader from "../components/PrimaryHeader";
import { AnimatedTitle, Title, Subtitle } from "../components/Typos";
import { colors, metrics } from "../utils/themes";
import Icon from "react-native-vector-icons/Ionicons";

import search_books from "../sampledata/categories.json";

class SearchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      keyword: ""
    };
    this._contentOffset = new Animated.Value(metrics.headerHeight);
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._navListener = navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("light-content", true);
    });
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  renderCateogryItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("VideoScreen", {
            uri: item.uri,
            title: item.name
          })
        }
      >
        <View style={styles.category}>
          <Title>{item.name}</Title>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { categories } = this.props;
    const { keyword, isFocused } = this.state;
    const fadeOutAnimation = {
      opacity: this._contentOffset.interpolate({
        inputRange: [-metrics.headerHeightX2, -metrics.headerHeight],
        outputRange: [0, 1],
        extrapolate: "clamp"
      })
    };
    const animatedY = this._contentOffset.interpolate({
      inputRange: [-metrics.screenHeight / 2, 0, metrics.headerHeight],
      outputRange: [
        metrics.headerHeight - 10,
        -metrics.headerHeight,
        -metrics.headerHeightX2
      ],
      extrapolate: "clamp"
    });
    const switchPageAnimation = {
      transform: [
        {
          translateY: this._contentOffset.interpolate({
            inputRange: [-metrics.headerHeightX2, -metrics.headerHeight],
            outputRange: [0, -metrics.screenHeight],
            extrapolateRight: "clamp"
          })
        }
      ]
    };
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.searchResult, switchPageAnimation]}>
          <View style={[styles.page, styles.result]}>
            <Feather
              name="search"
              size={100}
              color={colors.black}
              style={styles.icon}
            />
            <Title>Tìm cuốn sách yêu thích</Title>
            <Text>Có thể tìm theo tên sách hoặc tên tác giả</Text>
          </View>
          <View style={[styles.page, styles.categories]}>
            <AnimatedFlatList
              data={search_books}
              numColumns={2}
              keyExtractor={item => item.key}
              renderItem={this.renderCateogryItem}
            />
          </View>
        </Animated.View>
        <PrimaryHeader animatedY={animatedY}>
          <View style={styles.headerText}>
            <Animated.View
              style={[
                { marginHorizontal: 5 },
                { transform: [{ rotate: spin }] }
              ]}
            >
              <Icon name="ios-football" size={30} />
            </Animated.View>

            <Text
              style={[{ fontSize: 20, fontWeight: "600" }, styles.textWhite]}
            >
              Zamelk fans
            </Text>
          </View>
        </PrimaryHeader>
      </View>
    );
  }
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: metrics.statusBarHeight + metrics.padding,
    paddingHorizontal: metrics.padding,
    backgroundColor: colors.white,
    flex: 1
  },
  headerText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: metrics.screenWidth,
    paddingHorizontal: metrics.extraPadding,
    paddingVertical: metrics.lessPadding,
    marginVertical: 30,
    height: 200
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  search: {
    flex: 1,
    flexDirection: "row",
    borderRadius: metrics.radius,
    backgroundColor: colors.lightOpacity,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    marginHorizontal: metrics.lessPadding
  },
  textInput: {
    flex: 1,
    padding: 6,
    color: colors.black
  },
  buttonClear: {
    paddingHorizontal: metrics.lessPadding
  },
  searchResult: {
    position: "absolute",
    width: metrics.screenWidth,
    height: metrics.screenHeight * 2,
    backgroundColor: colors.background
  },
  page: {
    paddingTop: metrics.headerHeight,
    width: metrics.screenWidth,
    height: metrics.screenHeight
  },
  result: {
    alignItems: "center"
  },
  categories: {
    paddingTop: metrics.headerHeightX2 + metrics.padding
  },
  category: {
    width: (metrics.screenWidth - metrics.lessPadding * 2) / 2,
    margin: metrics.lessPadding / 2,
    padding: metrics.lessPadding,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: metrics.radius
  },
  textWhite: {
    color: colors.white
  },
  footerComponent: {
    height: 100
  }
});
