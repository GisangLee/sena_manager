import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Select,
  Portal,
  Tag,
  Button,
  Grid,
} from "@chakra-ui/react";
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { Member } from '../data/types';
import { MEMBERS_KEY, NON_PARTICIPANTS_KEY } from "../data/constants";
import dayjs from "dayjs";

const getDaysInMonth = (year: number, month: number) => {
  const start = dayjs(`${year}-${month}-01`);
  const days = [];
  const startOfWeek = start.startOf('month').day();
  const daysInMonth = start.daysInMonth();

  for (let i = 0; i < startOfWeek; i++) {
    days.push(null); // fill empty
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
};

const CalendarCell = ({ day, year, month, nonParticipants, setNonParticipants, members }: any) => {
  const dateKey = `${year}-${month}-${day}`;
  const current = nonParticipants[dateKey] || [];

  const removeNonParticipant = (name: string) => {
    setNonParticipants((prev: any) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((n: string) => n !== name),
    }));
  };

  const addNonParticipant = (value: any) => {
    const memberName = value?.value?.[0];
    if (!current.includes(memberName)) {
      console.log("?");
      setNonParticipants((prev: any) => ({
        ...prev,
        [dateKey]: [...current, memberName],
      }));
    }
  };

  return (
    <Box borderWidth="1px" p={2} minH="120px">
      <Text fontWeight="bold" mb={2}>{day}</Text>
      <Select.Root key={"subtle"} variant={"subtle"} onValueChange={(value: any) => addNonParticipant(value)}>
        <Select.HiddenSelect/>
        <Select.Label>단두대</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText/>
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
            {members
              .filter((m: any) => !current.includes(m.name))
              .map((m: any) => (
                <Select.Item key={m.name} item={m.name}>
                  <Select.ItemText>{m.name}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))
            }
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      {/* Display non-participants */}
      <Stack align="start" mt={2}>
        {current.map((name: string) => (
          <Tag.Root key={name} size="sm" colorScheme="red" colorPalette={"orange"}>
            <Tag.Label>{name}</Tag.Label>
            <Tag.EndElement onClick={() => removeNonParticipant(name)}>
              <Tag.CloseTrigger />
            </Tag.EndElement>
          </Tag.Root>
        ))}
      </Stack>
    </Box>
  );
};

const ParticipationCalendar = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [nonParticipants, setNonParticipants] = useState<{ [date: string]: string[] }>({});

  const year = currentDate.year();
  const month = currentDate.month() + 1;
  const days = getDaysInMonth(year, month);

  useEffect(() => {
    const storedMembers = loadFromStorage(MEMBERS_KEY);
    const storedNonParticipants = loadFromStorage(NON_PARTICIPANTS_KEY);

    if (storedMembers && Array.isArray(storedMembers)) {
      setMembers(storedMembers);
    }

    if (storedNonParticipants) {
      try {
        const parsed = JSON.parse(storedNonParticipants);
        if (typeof parsed === 'object' && parsed !== null) {
          setNonParticipants(parsed);
        }
      } catch (e) {
        console.warn("미참여자 로딩 오류:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(nonParticipants).length > 0) {
      saveToStorage(NON_PARTICIPANTS_KEY, JSON.stringify(nonParticipants));
    }
    console.log("🔥 최종 nonParticipants:", nonParticipants);
  }, [nonParticipants]);


  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>← 이전달</Button>
        <Heading size="md">{year}년 {month}월</Heading>
        <Button onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>다음달 →</Button>
      </HStack>
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <Box textAlign="center" fontWeight="bold" key={day}>{day}</Box>
        ))}
        {days.map((day, idx) => (
          <Box key={idx}>
            {day ? (
              <CalendarCell
                day={day}
                year={year}
                month={month}
                nonParticipants={nonParticipants}
                setNonParticipants={setNonParticipants}
                members={members}
              />
            ) : (
              <Box />
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default ParticipationCalendar;