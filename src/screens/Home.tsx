import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();

const minimumSummaryDateSizes = 18 * 5;
const amoutOfDaysToFill = minimumSummaryDateSizes - datesFromYearStart.length;

interface SummaryProps {
  id: string;
  date: Date;
  amout: number;
  completed: number;
}

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps[]>([]);

  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("summary");
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

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
            {weekDay}
          </Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => {
            const dayWithHabits = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                date={date}
                amout={dayWithHabits?.amout}
                completed={dayWithHabits?.completed}
                onPress={() => navigate("habit", { date: date.toISOString() })}
                key={date.toString()}
              />
            );
          })}
          {amoutOfDaysToFill > 0 &&
            Array.from({ length: amoutOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
              ></View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
