/**
 * @format
 * @flow
 */
import React, { PureComponent } from "react";
import { Animated, FlatList, View, StatusBar, StyleSheet } from "react-native";
import zget from "zget";
import Header from "../components/Header";
import Review from "../components/Review";
import StarRating from "../components/StarRating";
import FooterSpace from "../components/FooterSpace";
import ButtonNewReview from "../components/ButtonNewReview";
import { Heading } from "../components/Typos";
import { colors, metrics } from "../utils/themes";

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

class ReviewsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this._contentOffset = new Animated.Value(0);
    this._title = this.props.navigation.state.params.name;
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._navListener = navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content", true);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  renderItem({ item }) {
    return <Review key={item.id} item={item} />;
  }
  averageRate = rating => {
    let rates = 0;
    rating.map(i => (rates += parseInt(i)));
    return rates / rating.length;
  };
  render() {
    const reviews = zget(this.props, "navigation.state.params.reviews") || [];
    const { rating, _id } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <AnimatedFlatlist
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={reviews}
          renderItem={this.renderItem}
          keyExtractor={(item, i) => i}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.title}>
              <Heading>{`${this._title} reviews`}</Heading>
              <StarRating rating={this.averageRate(rating)} />
              <ButtonNewReview _id={_id} />
            </View>
          }
          ListFooterComponent={<FooterSpace />}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this._contentOffset } }
              }
            ],
            { useNativeDriver: true }
          )}
        />
        <Header
          hasBackButton
          title={this._title}
          rightButton={{
            onPress: () => null,
            iconName: "edit"
          }}
          animatedY={this._contentOffset.interpolate({
            inputRange: [0, 70],
            outputRange: [60, 0],
            extrapolate: "clamp"
          })}
          animatedOpacity={this._contentOffset.interpolate({
            inputRange: [0, 70],
            outputRange: [0, 1],
            extrapolate: "clamp"
          })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: metrics.headerHeight
  },
  title: {
    paddingBottom: metrics.padding,
    marginBottom: metrics.padding,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider
  },
  list: {
    justifyContent: "center",
    padding: metrics.lessPadding
  }
});

export default ReviewsScreen;
