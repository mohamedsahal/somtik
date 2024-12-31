const onViewableItemsChanged = useCallback(({ viewableItems }) => {
  // console.log('Viewable items:', viewableItems);
  if (viewableItems.length > 0) {
    setCurrentIndex(viewableItems[0].index);
  }
}, []); 

// When navigating to a user profile
const handleUserPress = (userId: string) => {
  router.push(`/user/${userId}`);
}; 