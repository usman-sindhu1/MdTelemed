import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import CustomDrawer from './CustomDrawer';

interface DrawerWrapperProps {
  children: React.ReactNode;
  onItemPress?: (itemId: string) => void;
}

export const DrawerContext = React.createContext<{
  openDrawer: () => void;
  closeDrawer: () => void;
}>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const DrawerProvider: React.FC<DrawerWrapperProps> = ({ children, onItemPress }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <Modal
        visible={isDrawerOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDrawer}
      >
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <CustomDrawer onClose={closeDrawer} onItemPress={onItemPress} />
        </TouchableWithoutFeedback>
      </Modal>
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within DrawerProvider');
  }
  return context;
};

