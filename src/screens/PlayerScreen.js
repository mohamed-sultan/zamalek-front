/**
 * @format
 * @flow
 */
import React, { PureComponent } from "react";
import {
  ScrollView,
  Animated,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from "react-native";
import zget from "zget";
import Feather from "react-native-vector-icons/Feather";
import { getPlayers } from "../graphql/query/getPlayers";
import { client } from "../app";

import Header from "../components/Header";
import BookCover from "../components/PlayerCover";
import Category from "../components/Category";
import StarRating from "../components/StarRating";
import FooterSpace from "../components/FooterSpace";
import Reviews from "../components/Reviews";
import ButtonNewReview from "../components/ButtonNewReview";
import { Title, Text, SubText, TextButton } from "../components/Typos";
import { colors, metrics } from "../utils/themes";
import Postion from "../components/Position";
import SectionHeader from "../components/SectionHeader";

class PlayerScreen extends PureComponent {
  constructor(props) {
    super(props);
    this._contentOffset = new Animated.Value(0);
    this.state = {
      collapsed: true,
      playerId: this.props.navigation.state.params.item._id,
      playerReviews: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._navListener = navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content", true);
    });
    this.navLisener2 = this.props.navigation.addListener(
      "willFocus",
      payload => {
        this.forceUpdate();
      }
    );
  }

  componentWillUnmount() {
    this._navListener.remove();
    this.navLisener2.remove();
  }

  getPlayerReviewFromStore = () => {
    return this.props.navigation.state.params.recentReviews
      ? recentReviews
      : client.cache
          .readQuery({ query: getPlayers })
          .getPlayers.filter(item => item._id === this.state.playerId)[0]
          .reviews.reverse()
          .sort(function(a, b) {
            var c = new Date(a.createdAt);
            var d = new Date(b.createdAt);
            return d - c;
          });
  };

  averageRate = rating => {
    let rates = 0;
    rating.map(i => (rates += parseInt(i)));
    return rates / rating.length;
  };

  render() {
    const { navigation } = this.props;
    const { collapsed } = this.state;
    const item = navigation.state.params.item;
    const isPlaying = false;

    return (
      <View style={styles.container}>
        <Animated.ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.list}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this._contentOffset } }
              }
            ],
            { useNativeDriver: true }
          )}
        >
          <View style={styles.paddingLeft}>
            <BookCover imageSource={item.image} />
            <Text>{item.name}</Text>
            <Text>nickName: {item.shortName}</Text>
            <Category data={item.teams} />
            <View style={styles.line} />
            <StarRating rating={this.averageRate(item.rating)} />
            <Postion
              position={item.teams[0]}
              isPlaying={isPlaying}
              onPress={() => this.play(0)}
            />
          </View>
          <ScrollView style={styles.playlist}>
            {item.videos && <SectionHeader title="videos" />}

            {item.videos &&
              item.videos.map((track, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate("VideoScreen", {
                      uri: track.uri,
                      title: track.title
                    })
                  }
                >
                  <View style={styles.chapter}>
                    <Feather
                      name="play-circle"
                      size={24}
                      color={colors.primary}
                      style={styles.chapterIcon}
                    />
                    <View>
                      <TextButton>{track.title}</TextButton>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <SectionHeader title="description" />
          <Text>{item.bio}</Text>
          {/* {collapsed ? (
            <View>
              <Text numberOfLines={3}>{item.bio}</Text>
              <TextButton
                style={{ fontSize: 14 }}
                onPress={() => this.setState({ collapsed: false })}
              >
                comments
              </TextButton>
            </View>
          ) : (
          )} */}
          <SectionHeader
            title="reviews"
            right={
              <TextButton
                onPress={() => {
                  navigation.push("ReviewsScreen", {
                    reviews: this.getPlayerReviewFromStore(),
                    rating: item.rating,
                    name: item.name,
                    _id: item._id
                  });
                }}
              >
                view all
              </TextButton>
            }
          />
          <Reviews reviews={this.getPlayerReviewFromStore()} />
          <ButtonNewReview _id={item._id} />
          <SectionHeader title="nationality" />
          <SubText>{item.nationality}</SubText>
          <FooterSpace />
        </Animated.ScrollView>
        <Header
          hasBackButton
          title={item.shortName}
          rightButton={{
            onPress: () => this.play(0),
            iconName: "ios-football"
          }}
          animatedY={this._contentOffset.interpolate({
            inputRange: [0, 70],
            outputRange: [60, 0],
            extrapolate: "clamp"
          })}
          animatedOpacity={this._contentOffset.interpolate({
            inputRange: [0, 60, 70],
            outputRange: [0, 0.3, 1],
            extrapolate: "clamp"
          })}
        />
      </View>
    );
  }
}

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: metrics.headerHeight
  },
  list: {
    padding: metrics.lessPadding
  },
  paddingLeft: {
    paddingLeft: metrics.coverWidth + metrics.padding,
    paddingBottom: metrics.padding,
    minHeight: metrics.coverHeight
  },
  chapter: {
    paddingTop: metrics.lessPadding,
    flexDirection: "row"
  },
  chapterIcon: {
    marginHorizontal: metrics.lessPadding
  }
});
