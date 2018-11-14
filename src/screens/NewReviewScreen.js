/**
 * @format
 * @flow
 */
import React, { PureComponent } from "react";
import {
  Animated,
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
  TouchableOpacity,
  Text
} from "react-native";
import StarRating from "../components/StarRating";
import { SubText } from "../components/Typos";
import { colors, metrics } from "../utils/themes";
import Header from "../components/Header";

import { client } from "../app";
import { CREATE_REVIEW_MUTATION } from "../graphql/mutation/createComment";
import { getPlayers as MAIN } from "../graphql/query/getPlayers";
import { Mutation } from "react-apollo";

class NewReviewScreen extends PureComponent {
  constructor(props) {
    super(props);
    this._contentOffset = new Animated.Value(0);
    this.state = {
      title: "",
      rate: 0,
      getRates: 0,
      description: "",
      haveAccount: false,
      error: ""
    };
  }
  async componentDidMount() {
    const t = await AsyncStorage.getItem("token");
    t
      ? this.setState({ haveAccount: true })
      : this.setState({ haveAccount: false });
  }
  getNumberOfRates = getRates => {
    this.setState({ getRates });
    if (this.state.error === "rates are required") this.setState({ error: "" });
  };
  handlePress = async () => {
    try {
      await client.mutate({
        mutation: CREATE_REVIEW_MUTATION,
        variables: {
          title: this.state.title,
          rating: "" + this.state.getRates,
          content: this.state.description,
          playerId: this.props.navigation.state.params._id
        }
      });
      const getPlayers = client.readQuery({ query: getPlayers });
      alert(getPlayers);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };
  render() {
    return (
      <Mutation
        mutation={CREATE_REVIEW_MUTATION}
        update={(cache, { data: { createComment } }) => {
          const r = cache.readQuery({ query: MAIN });

          const index = r.getPlayers.findIndex(
            item => item._id === this.props.navigation.state.params._id
          );
          if (
            r.getPlayers[index].reviews.findIndex(
              item => item._id === createComment._id
            ) !== -1
          ) {
            cache.writeQuery({
              query: MAIN,
              data: {
                getPlayers: r
              }
            });
          }

          r.getPlayers[index].reviews.unshift(createComment);
          r.getPlayers[index].rating.unshift(createComment.rating);
        }}
      >
        {createComment => (
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
              <View style={styles.center}>
                <StarRating
                  rating={2}
                  dynamic
                  getRate={this.getNumberOfRates}
                />
                <SubText style={styles.welcome}>rate the player</SubText>
              </View>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                placeholder="Title"
                value={this.state.title}
                onChangeText={title => this.setState({ title, error: "" })}
                onEndEditing={() => {
                  if (this.state.title === "")
                    this.setState({ error: "title are required" });
                  else if (this.state.title.length < 4)
                    this.setState({ error: "title need to be longer" });
                }}
              />
              <TextInput
                multiline
                style={[styles.input, styles.multiline]}
                autoCorrect={false}
                placeholder="Description"
                value={this.state.description}
                onChangeText={description =>
                  this.setState({ description, error: "" })
                }
                onEndEditing={() => {
                  if (this.state.title === "")
                    this.setState({ error: "title are required" });
                  else if (this.state.title.length < 4)
                    this.setState({ error: "title need to be longer" });
                  else if (this.state.description === "")
                    this.setState({ error: "description required" });
                  else if (this.state.description.length < 4)
                    this.setState({ error: "description need to be longer" });
                  else if (this.state.getRates === 0) {
                    this.setState({ error: "rates are required" });
                  }
                }}
                returnKeyType="send"
              />
              {this.state.error !== "" && (
                <Text style={styles.error}>{this.state.error}</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  createComment({
                    variables: {
                      title: this.state.title,
                      rating: "" + this.state.getRates,
                      content: this.state.description,
                      playerId: this.props.navigation.state.params._id
                    }
                  });
                  this.setState({ getRates: 0, description: "", title: "" });
                }}
                disabled={
                  this.state.error.length > 0 ||
                  this.state.description === "" ||
                  this.state.title === ""
                    ? true
                    : false
                }
                style={[
                  styles.submit,
                  {
                    backgroundColor:
                      this.state.error === "" &&
                      this.state.description.length > 3 &&
                      this.state.title.length > 3 &&
                      this.state.getRate > 0
                        ? colors.primary
                        : "gray"
                  }
                ]}
              >
                <Text style={styles.submitText}>submit</Text>
              </TouchableOpacity>
              <Header
                hasBackButton
                animatedOpacity={this._contentOffset.interpolate({
                  inputRange: [0, 60, 70],
                  outputRange: [0, 0.3, 1],
                  extrapolate: "clamp"
                })}
                animatedY={this._contentOffset.interpolate({
                  inputRange: [0, 70],
                  outputRange: [60, 0],
                  extrapolate: "clamp"
                })}
                title="Viết cảm nhận"
                rightButton={{
                  onPress: () => null,
                  iconName: "send"
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: metrics.headerHeight
  },
  center: {
    marginTop: metrics.extraPadding,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    backgroundColor: colors.background,
    padding: metrics.lessPadding,
    borderRadius: metrics.radius,
    marginTop: metrics.padding,
    marginHorizontal: metrics.padding,
    fontSize: 16
  },
  multiline: {
    height: 120
  },
  submit: {
    width: "50%",
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.accent
  },
  submitText: {
    color: colors.lightOpacity,
    fontSize: 20,
    fontWeight: "400"
  },
  error: {
    textAlign: "center",
    marginTop: 10,
    color: "red",
    fontWeight: "800"
  }
});

export default NewReviewScreen;
