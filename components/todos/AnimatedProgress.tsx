import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import colors from "@/styles/colors";

const AnimatedProgress = ({ value }: { value: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value, { duration: 500 });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={{ width: "100%", height: 20, backgroundColor: colors.primary[200], borderRadius: 10, overflow: "hidden" }}>
      <Animated.View style={[animatedStyle, { height: "100%", backgroundColor: colors.primary[600] }]} />
    </View>
  );
};

export default AnimatedProgress;
