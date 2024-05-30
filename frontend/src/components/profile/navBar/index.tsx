import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { RootState } from "../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HostViewStackParamList } from "../../../navigation/host";

export default function ProfileNavBar({
  user,
}: {
  user: RootState["auth"]["currentUser"];
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<HostViewStackParamList>>();
  return (
    user && (
      <View style={styles.container}>
        <TouchableOpacity>
          <Feather name="search" size={20} />
        </TouchableOpacity>
        <Text style={styles.text}>{user.email}</Text>
        <TouchableOpacity onPress={(currentUser) => navigation.navigate("createHost")}>
          <Feather name="plus" size={24} />
        </TouchableOpacity>
      </View>
    )
  );
}
