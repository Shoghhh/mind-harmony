import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function TodoSingle() {
    const { id } = useLocalSearchParams();
    return <View>
        <Text>This is single page of {id} todo </Text>
    </View>

}