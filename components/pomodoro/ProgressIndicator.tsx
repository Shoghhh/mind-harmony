import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Circle, G, Svg } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { Box, Text, VStack } from 'native-base';
import colors from '@/styles/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressIndicator = ({
  currentTime,
  totalTime,
  mode,
  cycles,
  type = 'circle'
}: {
  currentTime: number;
  totalTime: number;
  mode: 'pomodoro' | 'shortRest' | 'longRest';
  cycles: number;
  type?: 'circle' | 'bar' | 'percentage';
}) => {
  const progress = useSharedValue(currentTime / totalTime);
  const circumference = 2 * Math.PI * 90;
  const strokeWidth = 10;

  useEffect(() => {
    progress.value = withTiming(currentTime / totalTime, {
      duration: 1000,
      easing: Easing.out(Easing.linear),
    });
  }, [currentTime, totalTime]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${Math.max(1, progress.value * 100)}%`,
  }));

  const PercentageText = () => {
    return (
      <Animated.Text style={{ 
        color: colors.primary[900],
        fontSize: 48,
        fontWeight: 'bold'
      }}>
        {Math.round(progress.value * 100)}%
      </Animated.Text>
    );
  };

  const renderCircleProgress = () => (
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
  );

  const renderBarProgress = () => (
    <Box width="100%" alignItems="center">
      <VStack space={4} alignItems="center" width="80%">
        <Text fontSize="5xl" fontWeight="bold" color='primary.900'>
          {formatTime(currentTime)}
        </Text>
        <Box width="100%" height={10} bg="primary.200" borderRadius={5} overflow="hidden">
          <Animated.View 
            style={[{
              height: '100%',
              backgroundColor: colors.primary[550],
              borderRadius: 5,
            }, animatedBarStyle]}
          />
        </Box>
        <Text fontSize="lg" color={'primary.525'} >
          Cycle #{cycles}
        </Text>
      </VStack>
    </Box>
  );

  const renderPercentageProgress = () => (
    <Box alignItems="center">
      <VStack space={4} alignItems="center">
        <PercentageText />
        <Text fontSize="xl" fontWeight="bold" color='primary.900'>
          {formatTime(currentTime)}
        </Text>
        <Text fontSize="md" color={'primary.525'} >
          Cycle #{cycles}
        </Text>
      </VStack>
    </Box>
  );

  return (
    <Box alignItems="center" justifyContent="center" flex={1}>
      {type === 'circle' && renderCircleProgress()}
      {type === 'bar' && renderBarProgress()}
      {type === 'percentage' && renderPercentageProgress()}
    </Box>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default ProgressIndicator;