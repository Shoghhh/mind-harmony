import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Vibration } from "react-native";
import * as Haptics from 'expo-haptics';
import { usePomodoro } from "@/providers/PomodoroContext";
import { DurationOption, SoundOption } from "@/components/pomodoro/PomodoroSettings";

const SOUND_FILES: Record<SoundOption, any> = {
  bell: require('../assets/sounds/bell.mov'),
  ping: require('../assets/sounds/ping.wav'),
  alert: require('../assets/sounds/alert.wav'),
  beep: require('../assets/sounds/beep.wav'),
  chime: require('../assets/sounds/chime.wav'),
};

const PLAY_TIMES_CONFIG: Record<DurationOption, { times: number }> = {
  'once': { times: 1 },
  'twice': { times: 2 },
  '5': { times: 5 },
  '10': { times: 10 },
  'continuous': { times: Infinity }
};

export function useTimerFeedback() {
  const { alarmVolume, alarmSound, alarmDuration, vibration } = usePomodoro();
  const soundRef = useRef<Audio.Sound>();
  const playCounterRef = useRef(0);
  const isPlayingRef = useRef(false);

  const stopSound = useCallback(async () => {
    try {
      isPlayingRef.current = false;
      playCounterRef.current = 0;

      const soundInstance = soundRef.current;
      if (!soundInstance) return;

      const status = await soundInstance.getStatusAsync();

      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundInstance.stopAsync();
        }
        await soundInstance.unloadAsync();
      }

      soundRef.current = undefined;
    } catch (error: any) {
      if (!error.message.includes('not loaded') &&
        !error.message.includes('unloaded')) {
        console.warn('Error stopping sound:', error);
      }
    }
  }, []);

  const triggerFeedback = useCallback(() => {
    if (!vibration) return;

    try {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          .catch(() => Vibration.vibrate(200));
      } else {
        Vibration.vibrate([500, 200, 500]);
      }
    } catch (error) {
      console.error('Error triggering feedback:', error);
    }
  }, [vibration]);

  const playSound = useCallback(async () => {
    await stopSound();

    const soundFile = SOUND_FILES[alarmSound as SoundOption] || SOUND_FILES.bell;
    const config = PLAY_TIMES_CONFIG[alarmDuration as DurationOption] || PLAY_TIMES_CONFIG.once;

    isPlayingRef.current = true;
    playCounterRef.current = 0;

    const playSoundInstance = async () => {
      if (!isPlayingRef.current) return;

      try {
        const { sound } = await Audio.Sound.createAsync(
          soundFile,
          {
            shouldPlay: true,
            volume: alarmVolume / 100,
            isLooping: false
          }
        );

        soundRef.current = sound;
        playCounterRef.current += 1;

        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (!status.isLoaded) return;

          if ('didJustFinish' in status && status.didJustFinish) {
            const shouldContinue = isPlayingRef.current &&
              (playCounterRef.current < config.times || config.times === Infinity);

            if (shouldContinue) {
              playSoundInstance();
            } else {
              await stopSound();
            }
          }
        });

        if (playCounterRef.current === 1 && vibration) {
          triggerFeedback();
        }
      } catch (error) {
        console.error('Playback error:', error);
        if (vibration) triggerFeedback();
        await stopSound();
      }
    };

    playSoundInstance();
  }, [alarmSound, alarmVolume, alarmDuration, vibration, stopSound, triggerFeedback]);



  const previewSound = useCallback((
    soundKey: SoundOption,
    volume: number,
    duration: DurationOption
  ) => {
    stopSound().catch(() => { });
    const soundFile = SOUND_FILES[soundKey] || SOUND_FILES.bell;

    Audio.Sound.createAsync(
      soundFile,
      {
        shouldPlay: true,
        volume: volume / 10,
        isLooping: duration === 'continuous'
      }
    ).then(({ sound }) => {
      soundRef.current = sound;

      switch (duration) {
        case 'once':
          sound.setOnPlaybackStatusUpdate(status => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
            }
          });
          break;
        case 'twice':
          let playCount = 0;
          sound.setOnPlaybackStatusUpdate(status => {
            if (status.isLoaded && status.didJustFinish) {
              playCount++;
              playCount < 2 ? sound.replayAsync() : sound.unloadAsync();
            }
          });
          break;
        case '5':
        case '10':
          const targetCount = parseInt(duration);
          let counter = 0;
          sound.setOnPlaybackStatusUpdate(status => {
            if (status.isLoaded && status.didJustFinish) {
              counter++;
              counter < targetCount ? sound.replayAsync() : sound.unloadAsync();
            }
          });
          break;
        case 'continuous':
          break;
      }
      if (vibration) triggerFeedback();
    }).catch(error => {
      console.warn('Sound playback failed:', error);
      if (vibration) triggerFeedback();
    });
  }, [stopSound, triggerFeedback, vibration]);

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  return {
    playSound,
    stopSound,
    triggerFeedback,
    previewSound
  };
}