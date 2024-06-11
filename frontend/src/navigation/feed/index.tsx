import { Dispatch, SetStateAction, createContext, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FeedScreen from "../../screens/feed";

export type FeedStackParamList = {
  feedList: {
    creator: string;
    profile: boolean;
  };
  feedProfile: { hostId: string };
};

interface CurrentUserProfileItemInViewContextType {
  currentUserProfileItemInView: string | null;
  setCurrentUserProfileItemInView: Dispatch<SetStateAction<string | null>>;
}

const { Screen, Navigator } =
  createMaterialTopTabNavigator<FeedStackParamList>();

export const CurrentUserProfileItemInViewContext =
  createContext<CurrentUserProfileItemInViewContextType>({
    currentUserProfileItemInView: null,
    setCurrentUserProfileItemInView: () => {},
  });

const FeedNavigation = () => {
  const [currentUserProfileItemInView, setCurrentUserProfileItemInView] =
    useState<string | null>(null);

  return (
    <CurrentUserProfileItemInViewContext.Provider
      value={{
        currentUserProfileItemInView,
        setCurrentUserProfileItemInView,
      }}
    >
      <Navigator initialRouteName="feedList" tabBar={() => <></>}>
        <Screen
          name="feedList"
          component={FeedScreen}
          initialParams={{ profile: false }}
        />
        {/* <Screen
          name="feedProfile"
          component={ProfileScreen}
          initialParams={{ hostId:  }}
        /> */}
      </Navigator>
    </CurrentUserProfileItemInViewContext.Provider>
  );
};

export default FeedNavigation;
