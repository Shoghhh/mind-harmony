import { Audio } from "expo-av";
import { useCallback, useEffect, useState } from "react";
import { Platform, Vibration } from "react-native";
import * as Haptics from 'expo-haptics'; 

export function useTimerFeedback() {
    const [sound, setSound] = useState<Audio.Sound>();
  
    const playSound = useCallback(async () => {
      try {
        await sound?.unloadAsync();
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/sound1.wav'),
          { shouldPlay: true, volume: 0.8 }
        );
        setSound(newSound);
        setTimeout(() => newSound.unloadAsync(), 1000);
      } catch (error) {
        triggerFeedback();
      }
    }, [sound]);
  
    const triggerFeedback = useCallback(() => {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          .catch(() => Vibration.vibrate(200));
      } else {
        Vibration.vibrate(500);
      }
    }, []);
  
    useEffect(() => {
      return () => {
        sound?.unloadAsync();
      };
    }, [sound]);
  
    return { playSound, triggerFeedback };
  }