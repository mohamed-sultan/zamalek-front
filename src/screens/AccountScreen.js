import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Animated,
  StatusBar,
  Easing,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import FooterSpace from "../components/FooterSpace";
import { Text } from "../components/Typos";
import { metrics, colors } from "../utils/themes";
import PrimaryHeader from "../components/PrimaryHeader";
import Icon from "react-native-vector-icons/Ionicons";
import * as Yup from "yup";

import { client } from "../app";
import { LoginQuery } from "../graphql/query/login";
import { MeQuery } from "../graphql/query/me";
import { SIGNUP_MUTATION } from "../graphql/mutation/signup";
const INTAILSTATE = {
  email: "",
  password: "",
  userName: "",
  error: ""
};
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Not Valid Email !")
    .required("Email Required !"),
  password: Yup.string()
    .required("Password Required !")
    .min(6, "Password Must Be at Least 6 char "),
  userName: Yup.string()
    .required("Username Required !")
    .min(6, "Username Must Be at Least 6 char ")
});

class AccountScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...INTAILSTATE,
      showSignup: false,
      showLogin: false,
      buttomLodaing: false,
      ready: false
    };
    this._contentOffset = new Animated.Value(metrics.headerHeight);
    this.spinValue = new Animated.Value(0);
  }
  async componentDidMount() {
    const t = await AsyncStorage.getItem("token");
    if (t) {
      this.setState({ ready: true, showLogin: false, showSignup: false });
    } else {
      this.setState({ ready: true, showLogin: true, showSignup: false });
    }
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
  _isValidForm = async () => {
    if (this.state.buttomLodaing || this.state.error.length > 0) return false;
    if (this.state.showLogin) {
      try {
        await schema.validate({
          email: this.state.email,
          password: this.state.password,
          userName: "randomusername"
        });
        return true;
      } catch (error) {
        return false;
      }
    } else {
      try {
        await schema.validate({
          email: this.state.email,
          password: this.state.password,
          userName: this.state.username
        });
        return true;
      } catch (error) {
        return false;
      }
    }
  };
  _saveTokenAndIdToLocalStorage = async token => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      throw error;
    }
    try {
      const { data } = await client.query({
        query: MeQuery
      });

      await AsyncStorage.setItem("_id", data.me._id);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  _handelPress = async () => {
    if (!this.state.showLogin && !this.state.showSignup)
      await AsyncStorage.clear();
    const { email, password, userName } = this.state;
    if (this.state.showLogin || this.state.showSignup)
      this.setState({ buttomLodaing: true, error: "" });
    if (!this.state.showLogin && !this.state.showSignup) {
      await AsyncStorage.clear();
      this.setState({ showLogin: !this.state.showLogin });
    } else if (this.state.showSignup) {
      const response = await client.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { email, password, userName }
      });
      await this._saveTokenAndIdToLocalStorage(response.data.signup.token);
      this.setState({
        buttomLodaing: false,
        showLogin: false,
        showSignup: false,
        error: ""
      });
    } else if (this.state.showLogin) {
      try {
        const response = await client.query({
          query: LoginQuery,
          variables: { email, password }
        });
        await this._saveTokenAndIdToLocalStorage(response.data.login.token);
        this.setState({
          buttomLodaing: false,
          showLogin: false,
          showSignup: false,
          error: ""
        });
      } catch (error) {
        if (error.message === "Network error: Network request failed") {
          return;
        } else {
          this.setState({ error: error.graphQLErrors[0].message });
        }
        this.setState({
          buttomLodaing: false
        });
      }
    }
  };
  _handleDontHaveAccountORAlreadyHaveAccount = () => {
    if (this.state.showLogin) {
      this.setState({ showSignup: true, showLogin: false, ...INTAILSTATE });
    } else {
      this.setState({ showSignup: false, showLogin: true, ...INTAILSTATE });
    }
  };
  render() {
    const animatedY = this._contentOffset.interpolate({
      inputRange: [-metrics.screenHeight / 2, 0, metrics.headerHeight],
      outputRange: [
        metrics.headerHeight - 10,
        -metrics.headerHeight,
        -metrics.headerHeightX2
      ],
      extrapolate: "clamp"
    });
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });
    const DISABLED =
      (!this.state.showLogin && !this.state.userName.length > 5) ||
      this.state.buttomLodaing ||
      this.state.error.length > 0 ||
      this.state.email === "" ||
      this.state.password === "";
    if (!this.state.ready) return null;
    //handling already have acc
    if (!this.state.showLogin && !this.state.showSignup) {
      return (
        <View style={styles.container}>
          <View style={styles.form}>
            <TouchableHighlight
              style={styles.buttom}
              onPress={this._handelPress}
            >
              {this.state.buttomLodaing ? (
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Text style={styles.buttomText}>
                  {this.state.showLogin
                    ? "LogIn"
                    : this.state.showSignup
                    ? "SignUp"
                    : "LogOut"}
                </Text>
              )}
            </TouchableHighlight>
          </View>
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
          <FooterSpace />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            returnKeyType="next"
            placeholder="email"
            style={styles.input}
            placeholderTextColor={colors.black}
            value={this.state.email}
            onChangeText={email => this.setState({ email, error: "" })}
          />
          {this.state.showSignup && (
            <TextInput
              autoCapitalize="none"
              returnKeyType="next"
              placeholder="username"
              style={styles.input}
              placeholderTextColor={colors.black}
              value={this.state.userName}
              onChangeText={userName => this.setState({ userName, error: "" })}
            />
          )}
          <TextInput
            autoCapitalize="none"
            returnKeyType="next"
            placeholder="password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.black}
            value={this.state.password}
            onChangeText={password => this.setState({ password, error: "" })}
          />

          {true ? (
            <View>
              <Text style={styles.error}>{this.state.error}</Text>

              <TouchableHighlight
                style={[
                  styles.buttom,
                  { backgroundColor: DISABLED ? "gray" : colors.primary }
                ]}
                onPress={this._handelPress}
                disabled={DISABLED}
              >
                {this.state.buttomLodaing ? (
                  <ActivityIndicator size="large" color={colors.white} />
                ) : (
                  <Text style={styles.buttomText}>
                    {this.state.showLogin ? "LogIn" : "SignUp"}
                  </Text>
                )}
              </TouchableHighlight>
            </View>
          ) : (
            <Text style={styles.error}>{this.state.error}</Text>
          )}
          <Text
            onPress={this._handleDontHaveAccountORAlreadyHaveAccount}
            style={styles.DontHaveAcc}
          >
            {this.state.showLogin
              ? "Don't have account?"
              : "Already Have account?"}
          </Text>
        </View>

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
        <FooterSpace />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: metrics.padding
  },
  form: {
    marginTop: 100,
    flex: 1,
    alignSelf: "center",

    alignSelf: "stretch"
  },
  input: {
    width: "70%",
    height: 40,
    color: colors.black,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    borderRadius: 5,
    alignSelf: "center",
    borderColor: colors.primary,
    borderWidth: 3,
    marginVertical: 10
  },
  buttom: {
    width: "70%",
    height: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20
  },
  buttomText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 20
  },
  DontHaveAcc: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    fontWeight: "800"
  },
  error: {
    fontSize: 15,
    fontWeight: "800",
    color: "red",
    textAlign: "center"
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
  }
});

export default AccountScreen;
