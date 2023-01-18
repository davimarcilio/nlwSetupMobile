import { View, Text } from "react-native";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export function Home() {
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className={"text-zinc-400 text-xl font-bold text-center mx-1"}
            style={{ width: DAY_SIZE }}
          >
            {" "}
            {weekDay}{" "}
          </Text>
        ))}
      </View>
      <HabitDay />
    </View>
  );
}
