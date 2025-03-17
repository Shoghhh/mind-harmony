import React, { useCallback } from "react";
import { StyleSheet, Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { KeyboardAvoidingView, TextInput } from "react-native";

const MyBottomSheet = ({
  bottomSheetRef,
  component,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  component: any;
}) => {
  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom Sheet State:", index);
    if (index === -1) {
      Keyboard.dismiss(); // Close the keyboard when the bottom sheet is dismissed
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onChange={handleSheetChanges}
      index={-1}
      enableHandlePanningGesture
      snapPoints={['50%']}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.4}
          onPress={() => Keyboard.dismiss()} // Close the keyboard when backdrop is pressed
        />
      )}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <BottomSheetView style={styles.contentContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            {component()}
          </KeyboardAvoidingView>
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    backgroundColor: 'blue',
    flex: 1, // Ensure the content container takes up the full height
  },
});

export default MyBottomSheet;