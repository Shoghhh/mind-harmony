import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate
} from 'react-native-reanimated';

const CustomSlider = ({
  defaultValue = 50,
  minValue = 0,
  maxValue = 100,
  onChange,
  onChangeEnd,
  width = '100%',
  height = 40,
  thumbSize = 20,
  trackHeight = 4,
  thumbColor = '#0ea5e9',
  trackColor = '#0ea5e9',
  inactiveTrackColor = '#d3d3d3'
}: any) => {
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderValue = useSharedValue(defaultValue);
  const isSliding = useSharedValue(false);
  const thumbScale = useSharedValue(1);
  const startValue = useSharedValue(defaultValue); // Track initial value on gesture start
  const [displayValue, setDisplayValue] = useState(defaultValue);

  const handleLayout = (event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const updateDisplayValue = useCallback((value: number) => {
    setDisplayValue(value);
    onChange?.(value);
  }, [onChange]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isSliding.value = true;
      thumbScale.value = withSpring(1.2);
      startValue.value = sliderValue.value; // Store current value when gesture starts
    })
    .onUpdate((e) => {
      if (sliderWidth > 0) {
        // Calculate new value based on translation and initial value
        const newValue = startValue.value + (e.translationX / sliderWidth) * (maxValue - minValue);
        const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
        sliderValue.value = clampedValue;
        runOnJS(updateDisplayValue)(clampedValue);
      }
    })
    .onEnd(() => {
      isSliding.value = false;
      thumbScale.value = withSpring(1);
      onChangeEnd && runOnJS(onChangeEnd)(sliderValue.value);
    })
    .minDistance(1)
    .activeOffsetX([-10, 10]);

  const trackStyle = useAnimatedStyle(() => {
    const percentage = ((sliderValue.value - minValue) / (maxValue - minValue)) * 100;
    return {
      width: `${percentage}%`,
      backgroundColor: trackColor,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const percentage = ((sliderValue.value - minValue) / (maxValue - minValue)) * 100;
    return {
      transform: [
        {
          translateX: interpolate(
            percentage,
            [0, 100],
            [0, sliderWidth - thumbSize],
            'clamp'
          )
        },
        { scale: thumbScale.value }
      ],
      backgroundColor: thumbColor,
    };
  });

  return (
    <View style={[styles.container, { width }]}>
      {/* <Text style={styles.valueText}>Value: {Math.round(displayValue)}</Text> */}
      <GestureDetector gesture={panGesture}>
        <View
          ref={sliderRef}
          onLayout={handleLayout}
          style={[styles.sliderContainer, { height }]}
        >
          <View style={[styles.sliderBackground, {
            height: trackHeight,
            backgroundColor: inactiveTrackColor
          }]}>
            <Animated.View style={[styles.sliderTrack, trackStyle]} />
          </View>
          <Animated.View style={[
            styles.thumb,
            thumbStyle,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              top: (height - thumbSize) / 2,
            }
          ]} />
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  sliderContainer: {
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  sliderBackground: {
    width: '100%',
    borderRadius: 2,
  },
  sliderTrack: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    left: 0,
  },
  valueText: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CustomSlider;