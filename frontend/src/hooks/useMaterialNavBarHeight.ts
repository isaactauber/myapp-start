//! FIX VALUES TO FIT DEVICE (CURRENTLY SET FOR PIXEL PRO 7: 24, 104)
// VALUES FOR IPHONE 14 PRO MAX: 25, 139

import { useSafeAreaInsets } from "react-native-safe-area-context";

const useMaterialNavBarHeight = (withoutBottomTabs: boolean) => {
  const { bottom, top } = useSafeAreaInsets();

  // TODO: dynamically redner based on height of Tab.Navigator 
  // return bottom - Math.floor(top) + (withoutBottomTabs ? 24 : 104);
  return 114;
};

export default useMaterialNavBarHeight;
