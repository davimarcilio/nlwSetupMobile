import { View } from "react-native";
import Logo from "../assets/Logo.svg";
export function Header() {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Logo />
    </View>
  );
}
