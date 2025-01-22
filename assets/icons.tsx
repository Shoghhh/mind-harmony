import { AntDesign, Feather } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import colors from "@/styles/colors";

type IconProps = {
    color?: string;
    size?: number
};

export const icons: Record<string, (props?: IconProps) => React.ReactNode> = {
    dashboard: (props) => <MaterialIcons name="dashboard" size={26} {...props} />,
    todos: (props) => <FontAwesome5 name="tasks" size={24} {...props} />,
    habits: (props) => <Ionicons name="checkmark-done" size={26} {...props} />,
    // mood: (props) => <MaterialIcons name="mood" size={26} {...props} />,
    pomodoro: (props) => <Ionicons name="timer-outline" size={24} {...props} />,
    profile: (props) => <AntDesign name="user" size={26} {...props} />,
    list: () => <MaterialCommunityIcons name="format-list-bulleted" size={24} color={colors.secondary} />,
    groupedList: () => <MaterialCommunityIcons name="format-list-group" size={24} color={colors.secondary} />,
    keyArrowDown: () => <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.secondaryLight} />,
    keyArrowRight: (props) => <MaterialIcons name="keyboard-arrow-right" size={34} color={colors.secondary} {...props}/>,
    keyArrowLeft: (props) => <MaterialIcons name="keyboard-arrow-left" size={34} color={colors.secondary} {...props} />,
    add: () => <MaterialIcons name="add" size={32} color={colors.white} />,
    calendarCheck: () => <FontAwesome5 name="calendar-check" size={20} color={colors.secondary}/>,
    asc: () => <MaterialCommunityIcons name="sort-ascending" size={24} color={colors.secondary} />,
    desc: () => <MaterialCommunityIcons name="sort-descending" size={24} color={colors.secondary} />,
    check: () => <Entypo name="check" size={26} color={colors.primary} />,
    uncheckedCircle: () => <MaterialIcons name="radio-button-unchecked" size={26} color={colors.primary} />,
    trash: () => <MaterialIcons name="delete" size={24} color={colors.error} />,
    edit: (props) => <FontAwesome5 name="edit" size={20} color={colors.primary} {...props}/>
};