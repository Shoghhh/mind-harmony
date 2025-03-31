import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Text,
    Slider,
    Switch,
    Select,
    CheckIcon,
    HStack,
    VStack,
    Divider,
    Heading,
    Pressable,
    Icon,
    FlatList,
    Button
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import CustomSlider from '../MySlider';
import colors from '@/styles/colors';
import { useBottomSheet } from '@/providers/BottomSheetProvider';
import { usePomodoro } from '@/providers/PomodoroContext';
import { useTimerFeedback } from '@/hooks/useTimerFeedback';

export type SoundOption = 'bell' | 'ping' | 'alert' | 'beep' | 'chime';
export type DurationOption = 'once' | 'twice' | '5' | '10' | 'continuous';
export type ProgressStyle = 'circle' | 'bar' | 'percentage';

interface SettingItem {
    type: 'slider' | 'select' | 'switch';
    label: string;
    value: any;
    onChange: (value: any) => void;
    options?: { label: string, value: string }[];
    min?: number;
    max?: number;
    step?: number;
}

interface SettingsSection {
    title: string;
    data: SettingItem[];
}

const SettingsComponent = () => {

    const { closeSheet } = useBottomSheet();

    const {
        defaults,
        pomodoroTime,
        shortRestTime,
        longRestTime,
        cyclesBeforeLongRest,
        alarmSound,
        alarmVolume,
        alarmDuration,
        vibration,
        progressStyle,
        autoStart,
        autoSwitch,
        setPomodoroTime,
        setShortRestTime,
        setLongRestTime,
        setCyclesBeforeLongRest,
        setAlarmVolume,
        setAlarmSound,
        setAlarmDuration,
        setVibration,
        setProgressStyle,
        setAutoStart,
        setAutoSwitch
    } = usePomodoro();

    const { previewSound } = useTimerFeedback();

    const [settings, setSettings] = useState({
        focusDuration: pomodoroTime,
        shortBreak: shortRestTime,
        longBreak: longRestTime,
        cycles: cyclesBeforeLongRest,
        alarmSound,
        alarmVolume,
        alarmDuration,
        vibration,
        progressStyle,
        autoStart,
        autoSwitch
    });

    const saveSettings = useCallback(async () => {
        try {
            setPomodoroTime(settings.focusDuration)
            setShortRestTime(settings.shortBreak)
            setLongRestTime(settings.longBreak)
            setCyclesBeforeLongRest(settings.cycles)
            setAlarmVolume(settings.alarmVolume)
            setAlarmSound(settings.alarmSound)
            setAlarmDuration(settings.alarmDuration)
            setVibration(settings.vibration)
            setProgressStyle(settings.progressStyle)
            setAutoStart(settings.autoStart)
            setAutoSwitch(settings.autoSwitch)
        } catch (e) {
            console.error('Failed to save settings', e);
        } finally {
            closeSheet()
        }
    }, [settings]);

    const resetSettings = useCallback(() => {
        setSettings(defaults);
        setPomodoroTime(defaults.focusDuration);
        setShortRestTime(defaults.shortBreak);
        setLongRestTime(defaults.longBreak);
        setCyclesBeforeLongRest(defaults.cycles);
        setAlarmVolume(defaults.alarmVolume);
        setAlarmSound(defaults.alarmSound);
        setAlarmDuration(defaults.alarmDuration);
        setVibration(defaults.vibration);
        setProgressStyle(defaults.progressStyle)
        setAutoStart(defaults.autoStart)
        setAutoSwitch(defaults.autoSwitch)
    }, [
        setPomodoroTime,
        setShortRestTime,
        setLongRestTime,
        setCyclesBeforeLongRest,
        setAlarmVolume,
        setAlarmSound,
        setAlarmDuration,
        setVibration,
        setProgressStyle,
        setAutoStart,
        setAutoSwitch
    ]);

    const handleChange = useCallback((key: keyof typeof settings, value: any) => {
        setSettings((prev: any) => {
            const newSettings = { ...prev, [key]: value };

            if (key === 'alarmSound') {
                previewSound(value, newSettings.alarmVolume, newSettings.alarmDuration);
            }
            else if (key === 'alarmVolume') {
                previewSound(newSettings.alarmSound, value, newSettings.alarmDuration);
            }
            else if (key === 'alarmDuration') {
                previewSound(newSettings.alarmSound, newSettings.alarmVolume, value);
            }

            return newSettings;
        });
    }, [previewSound]);

    const settingsSections: SettingsSection[] = [
        {
            title: "Core Timer",
            data: [
                {
                    type: "slider",
                    label: "Focus Duration",
                    value: settings.focusDuration,
                    min: 15,
                    max: 60,
                    step: 1,
                    onChange: (v) => handleChange('focusDuration', v)
                },
                {
                    type: "slider",
                    label: "Short Break Duration",
                    value: settings.shortBreak,
                    min: 3,
                    max: 10,
                    step: 1,
                    onChange: (v) => handleChange('shortBreak', v)
                },
                {
                    type: "slider",
                    label: "Long Break Duration",
                    value: settings.longBreak,
                    min: 10,
                    max: 30,
                    step: 5,
                    onChange: (v) => handleChange('longBreak', v)
                },
                {
                    type: "slider",
                    label: "Cycles Before Long Break",
                    value: settings.cycles,
                    min: 2,
                    max: 8,
                    step: 1,
                    onChange: (v) => handleChange('cycles', v)
                }
            ]
        },
        {
            title: "Sound & Notifications",
            data: [
                {
                    type: "slider",
                    label: "Alarm Volume",
                    value: settings.alarmVolume,
                    min: 1,
                    max: 10,
                    step: 1,
                    onChange: (v) => handleChange('alarmVolume', v)
                },
                {
                    type: "select",
                    label: "Alarm Sound",
                    value: settings.alarmSound,
                    options: [
                        { label: "Classic Bell", value: "bell" },
                        { label: "Ping", value: "ping" },
                        { label: "Alert Tone", value: "alert" },
                        { label: "Digital Beep", value: "beep" },
                        { label: "Chime", value: "chime" },
                    ],
                    onChange: (v) => handleChange('alarmSound', v)
                },
                {
                    type: "select",
                    label: "Alarm Duration",
                    value: settings.alarmDuration,
                    options: [
                        { label: "Once", value: "once" },
                        { label: "Twice", value: "twice" },
                        { label: "5 Times", value: "5" },
                        { label: "10 Times", value: "10" },
                        { label: "Continuous", value: "continuous" }
                    ],
                    onChange: (v) => handleChange('alarmDuration', v)
                },
                {
                    type: "switch",
                    label: "Vibration",
                    value: settings.vibration,
                    onChange: (v) => handleChange('vibration', v)
                }
            ]
        },
        {
            title: "Display & Behavior",
            data: [
                {
                    type: "select",
                    label: "Progress Display",
                    value: settings.progressStyle,
                    options: [
                        { label: "Circle", value: "circle" },
                        { label: "Progress Bar", value: "bar" },
                        { label: "Percentage", value: "percentage" }
                    ],
                    onChange: (v) => handleChange('progressStyle', v)
                },
                {
                    type: "switch",
                    label: "Auto-start Next Session",
                    value: settings.autoStart,
                    onChange: (v) => handleChange('autoStart', v),
                },
                {
                    type: "switch",
                    label: "Auto-switch Modes",
                    value: settings.autoSwitch,
                    onChange: (v) => handleChange('autoSwitch', v)
                }
            ]
        }
    ];

    function createSettingsLookup<T extends object>(settings: T) {
        const lookup = new Map<unknown, keyof T>();

        (Object.keys(settings) as Array<keyof T>).forEach(key => {
            lookup.set(settings[key], key);
        });

        return {
            getKey: (value: unknown) => lookup.get(value) as keyof T | undefined
        };
    }

    const settingsLookup = createSettingsLookup(settings);

    const renderSettingItem = ({ item }: { item: SettingItem }) => {
        switch (item.type) {
            case "slider":
                return (
                    <Box mb={4}>
                        <HStack justifyContent="space-between" mb={1}>
                            <Text fontSize="md" color="primary.525">{item.label}</Text>
                            <Text fontSize="md" color="primary.600" fontWeight="medium">
                                {item.value}{item.label.includes("Duration") ? " min" : ""}
                            </Text>
                        </HStack>
                        <CustomSlider
                            minValue={item.min}
                            maxValue={item.max}
                            defaultValue={item.value}
                            onChangeEnd={(v: any) => {
                                const settingKey = settingsLookup.getKey(item.value);
                                if (settingKey) {
                                    handleChange(settingKey, Math.round(v));
                                }
                            }}
                            thumbColor={colors.primary[600]}
                            trackColor={colors.primary[600]}
                            inactiveTrackColor={colors.primary[100]}
                            thumbSize={24}
                        />
                    </Box>
                );
            case "select":
                return (
                    <Box mb={3}>
                        <Text fontSize="md" color="primary.525" mb={2}>{item.label}</Text>
                        <Select
                            selectedValue={item.value}
                            onValueChange={item.onChange}
                            bg="white"
                            borderColor="primary.200"
                            borderWidth={1}
                            borderRadius={8}
                            _selectedItem={{
                                bg: "primary.100",
                                endIcon: <CheckIcon size={4} color="primary.600" />
                            }}
                            _item={{
                                _pressed: { bg: "primary.100" }
                            }}
                            placeholder="Select option"
                        >
                            {item.options?.map((opt) => (
                                <Select.Item
                                    key={opt.value}
                                    label={opt.label}
                                    value={opt.value}
                                />
                            ))}
                        </Select>
                    </Box>
                );
            case "switch":
                return (
                    <HStack
                        alignItems="center"
                        justifyContent="space-between"
                        mb={4}
                    >
                        <Text fontSize="md" color="primary.525">{item.label}</Text>
                        <Switch
                            isChecked={item.value}
                            onToggle={() => item.onChange(!item.value)}
                            offTrackColor="primary.100"
                            onTrackColor="primary.200"
                            onThumbColor="primary.600"
                            size="md"
                        />
                    </HStack>
                );
            default:
                return null;
        }
    };

    return (
        <Box flex={1}>
            <HStack
                justifyContent="flex-end"
                alignItems="center"
                p={4}
                borderBottomWidth={1}
                borderBottomColor="primary.100"
            >
                <Pressable
                    onPress={resetSettings}
                    _pressed={{ opacity: 0.6 }}
                >
                    <HStack alignItems="center" space={1}>
                        <Icon
                            as={MaterialIcons}
                            name="restore"
                            size="sm"
                            color="primary.600"
                        />
                        <Text color="primary.600" fontWeight="medium">Reset Defaults</Text>
                    </HStack>
                </Pressable>
            </HStack>

            <FlatList
                data={settingsSections}
                keyExtractor={(item) => item.title}
                renderItem={({ item: section }) => (
                    <Box px={4} pt={4}>
                        <Heading
                            size="md"
                            color="primary.600"
                            mb={4}
                            fontWeight="semibold"
                        >
                            {section.title}
                        </Heading>
                        <VStack space={2} mb={2}>
                            {section.data.map((item, index) => (
                                <Box key={`${section.title}-${index}`}>
                                    {renderSettingItem({ item })}
                                </Box>
                            ))}
                        </VStack>
                        <Divider my={3} bg="primary.100" />
                    </Box>
                )}
            />
            <Button
                onPress={saveSettings}
                bg="primary.600"
                size="lg"
                mx={4}
                my={4}
                _text={{ color: "white" }}
                _pressed={{ bg: "primary.600", opacity: 0.8 }}
                marginBottom={120}
            >
                Save Settings
            </Button>
        </Box>
    );
};

export default SettingsComponent;