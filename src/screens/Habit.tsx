import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";
interface HabitParams {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps>({
    completedHabits: [],
    possibleHabits: [],
  });
  // const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        dayInfo.completedHabits.length
      )
    : 0;

  async function handleToggleHabit(habitId: string) {
    try {
      let completedHabits: string[] = [];
      await api.patch(`/habits/${habitId}/toggle`);
      if (dayInfo?.completedHabits.includes(habitId)) {
        completedHabits = dayInfo.completedHabits.filter(
          (id) => id !== habitId
        );
      } else {
        completedHabits = [...dayInfo!.completedHabits, habitId];
      }
      setDayInfo((state) => {
        return {
          possibleHabits: state!.possibleHabits,
          completedHabits,
        };
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "N??o foi poss??vel atualizar o status do h??bito");
    }
  }

  async function fetchHabits() {
    try {
      setLoading(true);
      const parsedFetchDate = dayjs(date).endOf("day").toDate();

      const response = await api.get("day", {
        params: { date: parsedFetchDate },
      });
      console.log(response.data);

      setDayInfo(response.data);
      // setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "N??o foi carregar as informa????es dos h??bitos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className=" text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>
        <ProgressBar progress={habitsProgress} />
        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits.length > 0 ? (
            dayInfo?.possibleHabits.map((habit) => (
              <Checkbox
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
                checked={dayInfo.completedHabits.includes(habit.id)}
                key={habit.id}
                title={habit.title}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>
        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Voc?? n??o pode editar h??bitos de uma data passada!
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
