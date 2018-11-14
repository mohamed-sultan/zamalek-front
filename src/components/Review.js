import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import DistanceInWordsToNow from "date-fns/distance_in_words_to_now";

import StarRating from "./StarRating";
import { Subtitle, Text, SubText } from "./Typos";
import { colors, metrics } from "../utils/themes";

class Review extends PureComponent {
  render() {
    const { width, height } = this.props;
    const { user, createdAt, title, content, rating } = this.props.item;
    const USER =
      user && user.userName.length > 2 ? user.userName : "Anonymouse";
    return (
      <View
        style={[
          styles.container,
          width && {
            width: width
          },
          height && { height: height }
        ]}
      >
        <Subtitle>{USER}</Subtitle>
        <StarRating mini rating={parseInt(rating)} />
        <Text>{content}</Text>
        <View style={styles.author}>
          <SubText>{`${DistanceInWordsToNow(createdAt)} ago`}</SubText>
        </View>
      </View>
    );
  }
}

export default Review;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: metrics.padding,
    marginBottom: metrics.padding,
    borderRadius: metrics.radius
  },
  author: {
    position: "absolute",
    right: metrics.padding,
    top: metrics.padding
  }
});
