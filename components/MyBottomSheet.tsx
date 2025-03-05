import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MyBottomSheet = ({
  bottomSheetRef,
  component,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  component: any;
}) => {
  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom Sheet State:", index);
  }, []);



  return (

    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onChange={handleSheetChanges}
      index={0}
      enableHandlePanningGesture
      snapPoints={['50%']}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          appearsOnIndex={0}
          disappearsOnIndex={-1}

          opacity={0.4}
        />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        {component()}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    backgroundColor: 'blue'
    // flex: 1,
    // padding: 36,
    // alignItems: "center",
  },
});

export default MyBottomSheet;
