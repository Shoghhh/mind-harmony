import { icons } from '@/assets/icons';
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, LayoutRectangle, findNodeHandle, UIManager } from 'react-native';
import colors from '@/styles/colors';
import globalStyles from '@/styles/globalStyles';
import globalTextStyles from '@/styles/globalTextStyles';

type DropdownProps = {
  options: { value: number, label: string }[];
  selectedOption: string;
  onSelect: (option: number) => void;
  style?: {},
  btnStyle?: {}
};

const Dropdown: React.FC<DropdownProps> = ({ options, selectedOption, onSelect, style, btnStyle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
  const buttonRef = useRef<View>(null);

  const openDropdown = () => {
    const handle = findNodeHandle(buttonRef.current);
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setButtonLayout({ x: pageX, y: pageY, width, height });
        setIsVisible(true);
      });
    }
  };

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.dropdownButton, btnStyle]}
        onPress={openDropdown}
      >
        <Text style={globalTextStyles.regular14PrimaryDark}>{selectedOption}</Text>
        {icons['keyArrowDown']()}
      </TouchableOpacity>

      {isVisible && buttonLayout && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsVisible(false)} />
          <View
            style={[
              styles.dropdownMenu,
              {
                top: buttonLayout.y + buttonLayout.height,
                left: buttonLayout.x,
                width: buttonLayout.width,
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => {
                return <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onSelect(item.value);
                    setIsVisible(false);
                  }}
                >
                  <Text style={globalTextStyles.regular14PrimaryDark}>{item.label}</Text>
                </TouchableOpacity>
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginRight: 10,
  },
  dropdownButton: {
    borderColor: colors.secondaryLight,
    borderWidth: 1,
    paddingLeft: 5,
    paddingVertical: 4,
    borderRadius: 10,
    ...globalStyles.rowSpaceBetween
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});

export default Dropdown;
