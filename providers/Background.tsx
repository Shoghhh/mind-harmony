import { ImageBackground } from "react-native";
import { View } from "react-native";

const Background = ({ children }: any) => {
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/images/back.jpg')}
                resizeMode="cover"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />
            {children}
        </View>
    );
};


export default Background