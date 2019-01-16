import React from 'react';
import {Animated, View, AppRegistry, Text, Easing} from 'react-native';

export default class GradientBg extends React.Component {
    state = { 
        fadeAnim: new Animated.Value(0),
    }
    componentDidMount() {
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 15000,
            easing: Easing.linear
        }).start();
    }

    render() {
        let {fadeAnim} = this.state;
        return (
            <Animated.View style={
                {
                    width: 550,
                    height: 750,
                    // backgroundColor: '#924FF6',
                    backgroundColor: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#72F6FD", "#924FF6"]
                        // outputRange: [0, 700]
                    }),
                }
            }>
              <Text >wuqingyun</Text>
            </Animated.View>
        );
    }
}

AppRegistry.registerComponent("GradientBg", () => GradientBg);

