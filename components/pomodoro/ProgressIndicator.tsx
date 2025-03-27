import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Circle, G, Svg } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';
import { Box, Text, VStack } from 'native-base';
import colors from '@/styles/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressIndicator = ({
  currentTime,
  totalTime,
  mode,
  cycles
}: {
  currentTime: number;
  totalTime: number;
  mode: 'pomodoro' | 'shortRest' | 'longRest';
  cycles: number
}) => {

  const progress = useSharedValue(1);
  const circumference = 2 * Math.PI * 90;
  const strokeWidth = 10;

  const _colors = {
    pomodoro: '#e74c3c',
    shortRest: '#f39c12',
    longRest: '#2ecc71',
    background: colors.primary[100]
  };

  useEffect(() => {
    progress.value = withTiming(currentTime / totalTime, {
      duration: 1000,
      easing: Easing.out(Easing.linear),
    });
  }, [currentTime, totalTime]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const PercentageText = () => {
    const animatedProps = useAnimatedProps(() => ({
      children: `${Math.round(progress.value * 100)}%`,
    }));

    return (
      <Animated.Text style={{ color: '#777' }}>
        {animatedProps.children}
      </Animated.Text>
    );
  };

  return (
    <Box alignItems="center" >
      <View style={{ width: 200, height: 200 }}>
        <Svg height="100%" width="100%" viewBox="0 0 200 200">
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke={colors.primary[200]}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <G rotation="-90" origin="100, 100">
            <AnimatedCircle
              cx="100"
              cy="100"
              r="90"
              stroke={colors.primary[550]}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              animatedProps={animatedCircleProps}
              strokeLinecap="round"
              fill="transparent"
            />
          </G>
        </Svg>
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <VStack space={1} alignItems="center">
            <Text fontSize="5xl" fontWeight="bold" color='primary.900'>
              {formatTime(currentTime)}
            </Text>
            <Text fontSize="lg" color={'primary.525'} >
              Cycle #{cycles}
            </Text>
          </VStack>
        </View>
      </View>
    </Box>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default ProgressIndicator;