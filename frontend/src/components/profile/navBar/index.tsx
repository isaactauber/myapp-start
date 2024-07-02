import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { RootState } from "../../../redux/store";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../../navigation/main";
import { Host } from "../../../../types";


interface NavBarProps {
  route: RouteProp<MainStackParamList, "createHost">;
}

export default function ProfileNavBar({host}: { host: Host | null }, { route }: NavBarProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  return (
    host && (
      <View style={styles.container}>
        <TouchableOpacity>
          <Feather name="search" size={20} />
        </TouchableOpacity>
        <Text style={styles.text}>{host.hostName}</Text>
        <TouchableOpacity onPress={ () => navigation.navigate("createHost") }>
          <Feather name="plus" size={24} />
        </TouchableOpacity>
      </View>
    )
  );
}
