import React, { PureComponent } from "react";
import {
  Animated,
  StatusBar,
  View,
  StyleSheet,
  Easing,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { AnimatedHeading, Text } from "../components/Typos";
import AnimatedFlatList from "../components/AnimatedFlatList";
import PrimaryHeader from "../components/PrimaryHeader";
import CardBook from "../components/CardBook";
import { colors, metrics } from "../utils/themes";

import quotes from "../sampledata/quotes.json";
import gql from "graphql-tag";
import { getPlayers } from "../graphql/query/getPlayers";
import { Query } from "react-apollo";
import { client } from "../app";

const pickRandomProperty = obj => {
  var result;
  var count = 0;
  for (var prop in obj) if (Math.random() < 1 / ++count) result = prop;
  return result;
};

const LOGO_SIZE = 24;
const HEADER_OFFSET = metrics.screenWidth / 2 - 40;
const PAGE_SIZE = 10;

class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this._contentOffset = new Animated.Value(0);
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    // await client
    //   .query({
    //     query: gql`
    //       {
    //         getPlayers {
    //           name
    //           shortName
    //           image
    //         }
    //       }
    //     `
    //   })
    //   .then(r => {
    //     alert(JSON.stringify(r));
    //   })
    //   .catch(e => alert(JSON.stringify(e)));
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

  render() {
    const { navigation } = this.props;
    const randomQuoteKey = pickRandomProperty(quotes);

    const animatedY = this._contentOffset.interpolate({
      inputRange: [-metrics.screenHeight / 2, 0, metrics.headerHeight],
      outputRange: [
        metrics.headerHeight - 10,
        -metrics.headerHeight,
        -metrics.headerHeightX2
      ],
      extrapolate: "clamp"
    });

    const fadeOutAnimation = {
      opacity: this._contentOffset.interpolate({
        inputRange: [0, metrics.headerHeight * 0.5, metrics.headerHeight],
        outputRange: [0.9, 0.2, 0],
        extrapolate: "clamp"
      })
    };

    const fadeInAnimation = {
      opacity: this._contentOffset.interpolate({
        inputRange: [0, metrics.headerHeight * 0.8, metrics.headerHeight],
        outputRange: [0.2, 0.5, 1],
        extrapolate: "clamp"
      })
    };

    const scaleAnimation = {
      scale: this._contentOffset.interpolate({
        inputRange: [0, metrics.headerHeight * 0.8, metrics.headerHeight],
        outputRange: [1, 2, 1],
        extrapolate: "clamp"
      })
    };

    const titleLeftAnimation = {
      transform: [
        {
          translateX: this._contentOffset.interpolate({
            inputRange: [0, metrics.headerHeight],
            outputRange: [-HEADER_OFFSET + 40, 0],
            extrapolate: "clamp"
          })
        },
        scaleAnimation
      ]
    };

    const titleRightAnimation = {
      transform: [
        {
          translateX: this._contentOffset.interpolate({
            inputRange: [0, metrics.headerHeight],
            outputRange: [HEADER_OFFSET, 0],
            extrapolate: "clamp"
          })
        },
        scaleAnimation
      ]
    };
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    return (
      <Query query={getPlayers}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Icon name="ios-football" size={100} />
                </Animated.View>
              </View>
            );
          if (error) {
            if (error.message === "Network error: Network request failed") {
              return (
                <View
                  style={{
                    width: "100%",
                    marginTop: 10,
                    height: 30,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 14, fontWeight: "800" }}
                  >
                    no internet connection!!
                  </Text>
                </View>
              );
            }
            return <Text>{error.graphQLErrors[0].message}</Text>;
          }
          return (
            <View style={styles.container}>
              <AnimatedFlatList
                data={data.getPlayers}
                keyExtractor={item => item._id}
                ListHeaderComponent={<View style={styles.headerComponent} />}
                renderItem={({ item, index }) => (
                  <CardBook
                    item={item}
                    index={index % PAGE_SIZE}
                    onPress={() =>
                      navigation.navigate("BookScreen", {
                        id: item._id,
                        item: item
                      })
                    }
                  />
                )}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: { contentOffset: { y: this._contentOffset } }
                    }
                  ],
                  { useNativeDriver: true }
                )}
              />
              <PrimaryHeader animatedY={animatedY}>
                <View>
                  <Animated.View style={[styles.headerText, fadeOutAnimation]}>
                    {quotes[randomQuoteKey] ? (
                      <Text style={styles.textWhite}>
                        &ldquo;
                        {quotes[randomQuoteKey].quote}
                        &rdquo; - {quotes[randomQuoteKey].author}
                      </Text>
                    ) : null}
                  </Animated.View>
                  <Animated.View style={[styles.headerTitle, fadeInAnimation]}>
                    <Animated.View
                      //   source={require("../images/zz.jpeg")}
                      style={[styles.logo, titleLeftAnimation]}
                    >
                      <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Icon name="ios-football" size={30} />
                      </Animated.View>
                    </Animated.View>
                    <AnimatedHeading
                      style={[styles.textWhite, titleRightAnimation]}
                    >
                      zamalek fans
                    </AnimatedHeading>
                  </Animated.View>
                </View>
              </PrimaryHeader>
            </View>
          );
        }}
      </Query>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  headerTitle: {
    position: "absolute",
    bottom: 0,
    width: metrics.screenWidth,
    padding: metrics.lessPadding,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  headerText: {
    position: "absolute",
    bottom: 0,
    width: metrics.screenWidth,
    paddingHorizontal: metrics.extraPadding,
    paddingVertical: metrics.lessPadding
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginHorizontal: metrics.lessPadding
  },
  textWhite: {
    color: colors.white
  },
  list: {
    flex: 1
  },
  headerComponent: {
    height: metrics.headerHeightX2
  }
});
