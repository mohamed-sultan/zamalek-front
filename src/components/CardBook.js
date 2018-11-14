import React, { PureComponent } from "react";
import {
  Animated,
  Easing,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import { colors, metrics } from "../utils/themes";
import { Title, Text, Caption } from "./Typos";
import BookCover from "./PlayerCover";
import Category from "./Category";
import StarRating from "./StarRating";

class CardBook extends PureComponent {
  constructor(props) {
    super(props);
    this._visibility = new Animated.Value(0);
  }

  componentDidMount() {
    const { index } = this.props;
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: index * 500,
      useNativeDriver: true,
      easing: Easing.ease
    }).start();
  }
  averageRate = rating => {
    let rates = 0;
    rating.map(i => (rates += parseInt(i)));
    return rates / rating.length;
  };
  render() {
    const { item, onPress, index } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        underlayColor={colors.transparent}
      >
        <View />
        <Animated.View
          style={{
            opacity: this._visibility,
            transform: [
              {
                translateY: this._visibility.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 1]
                })
              }
            ]
          }}
        >
          <View style={styles.cardHeader}>
            <StarRating rating={this.averageRate(item.rating)} />
          </View>
          <View style={styles.card}>
            <Title numberOfLines={2}>{item.name}</Title>
            <Text>{item.shortName}</Text>
            <Category data={item.teams} />
            <View style={styles.line} />
            <Caption>nationality: {item.nationality}</Caption>
          </View>
          <BookCover imageSource={item.image} />
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

export default CardBook;

const styles = StyleSheet.create({
  container: {
    margin: metrics.padding
  },
  cardHeader: {
    marginLeft: metrics.coverWidth + metrics.lessPadding
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: metrics.radius,
    padding: metrics.lessPadding,
    minHeight: metrics.coverHeight - 30,
    marginLeft: metrics.coverWidth / 3,
    paddingLeft: (metrics.coverWidth * 2) / 3 + metrics.padding
    // ...colors.shadow
  },
  line: {
    height: 2,
    width: metrics.extraPadding,
    backgroundColor: colors.textSecondary,
    marginBottom: metrics.padding / 2
  }
});
