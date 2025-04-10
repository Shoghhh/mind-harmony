import React, { useCallback, useMemo } from "react";
import { StyleSheet, Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { KeyboardAvoidingView } from "react-native";

const MyBottomSheet = ({
  bottomSheetRef,
  Component,
  componentProps,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  Component: React.FC<any> | null;
  componentProps: any;
}) => {
  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom Sheet State:", index);
    if (index === -1) {
      Keyboard.dismiss();
    }
  }, []);

  const snapPoints = useMemo(() => ['90%'], []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      activeOffsetY={[-10, 10]}
      onChange={handleSheetChanges}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
      enableHandlePanningGesture
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {Component ? <Component {...componentProps} /> : null}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
    height: 4,
  },
  background: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
});

export default MyBottomSheet;