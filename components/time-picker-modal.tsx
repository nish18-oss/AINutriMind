import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppTheme } from "@/constants/theme";

type TimePickerModalProps = {
  visible: boolean;
  title?: string;
  initialValue?: string;
  onClose: () => void;
  onSelect: (value: string) => void;
};

type Period = "AM" | "PM";

export default function TimePickerModal({
  visible,
  title = "Choose time",
  initialValue = "",
  onClose,
  onSelect,
}: TimePickerModalProps) {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] =
    useState<Period>("AM");

  useEffect(() => {
    if (!visible) {
      return;
    }

    const parsed = parseInitialTime(
      initialValue
    );

    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [visible, initialValue]);

  function increaseHour() {
    setHour((current) =>
      current === 12 ? 1 : current + 1
    );
  }

  function decreaseHour() {
    setHour((current) =>
      current === 1 ? 12 : current - 1
    );
  }

  function increaseMinute() {
    setMinute((current) => {
      const next = current + 5;

      if (next >= 60) {
        increaseHour();
        return 0;
      }

      return next;
    });
  }

  function decreaseMinute() {
    setMinute((current) => {
      const next = current - 5;

      if (next < 0) {
        decreaseHour();
        return 55;
      }

      return next;
    });
  }

  function confirmTime() {
    const formattedHour =
      hour.toString();

    const formattedMinute =
      minute.toString().padStart(2, "0");

    onSelect(
      `${formattedHour}:${formattedMinute} ${period}`
    );
  }

  const hourText =
    hour.toString().padStart(2, "0");

  const minuteText =
    minute.toString().padStart(2, "0");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <View style={styles.modalCard}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>
                TIME
              </Text>

              <Text style={styles.title}>
                {title}
              </Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons
                name="close"
                size={20}
                color="#CBD5E1"
              />
            </Pressable>
          </View>

          <View style={styles.timePreview}>
            <View style={styles.timeValueBlock}>
              <Text style={styles.timeValue}>
                {hourText}
              </Text>

              <Text style={styles.timeUnit}>
                HOUR
              </Text>
            </View>

            <Text style={styles.colon}>
              :
            </Text>

            <View style={styles.timeValueBlock}>
              <Text style={styles.timeValue}>
                {minuteText}
              </Text>

              <Text style={styles.timeUnit}>
                MIN
              </Text>
            </View>
          </View>

          <View style={styles.adjustRow}>
            <View style={styles.adjustGroup}>
              <Pressable
                style={styles.adjustButton}
                onPress={decreaseHour}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color="#CBD5E1"
                />
              </Pressable>

              <Text style={styles.adjustLabel}>
                HOUR
              </Text>

              <Pressable
                style={[
                  styles.adjustButton,
                  styles.adjustButtonActive,
                ]}
                onPress={increaseHour}
              >
                <Ionicons
                  name="add"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.adjustGroup}>
              <Pressable
                style={styles.adjustButton}
                onPress={decreaseMinute}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color="#CBD5E1"
                />
              </Pressable>

              <Text style={styles.adjustLabel}>
                MIN
              </Text>

              <Pressable
                style={[
                  styles.adjustButton,
                  styles.adjustButtonActive,
                ]}
                onPress={increaseMinute}
              >
                <Ionicons
                  name="add"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.periodSelector}>
            <Pressable
              style={[
                styles.periodButton,
                period === "AM" &&
                  styles.periodButtonSelected,
              ]}
              onPress={() =>
                setPeriod("AM")
              }
            >
              <Ionicons
                name="sunny-outline"
                size={17}
                color={
                  period === "AM"
                    ? "#FFFFFF"
                    : "#98A2B3"
                }
              />

              <Text
                style={[
                  styles.periodText,
                  period === "AM" &&
                    styles.periodTextSelected,
                ]}
              >
                AM
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.periodButton,
                period === "PM" &&
                  styles.periodButtonSelected,
              ]}
              onPress={() =>
                setPeriod("PM")
              }
            >
              <Ionicons
                name="moon-outline"
                size={16}
                color={
                  period === "PM"
                    ? "#FFFFFF"
                    : "#98A2B3"
                }
              />

              <Text
                style={[
                  styles.periodText,
                  period === "PM" &&
                    styles.periodTextSelected,
                ]}
              >
                PM
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.setButton}
            onPress={confirmTime}
          >
            <Text style={styles.setButtonText}>
              Set time
            </Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function parseInitialTime(value: string): {
  hour: number;
  minute: number;
  period: Period;
} {
  const fallback = {
    hour: 7,
    minute: 0,
    period: "AM" as Period,
  };

  if (!value) {
    return fallback;
  }

  const normalized =
    value.trim().toUpperCase();

  const twelveHour =
    normalized.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
    );

  if (twelveHour) {
    const parsedHour =
      Number(twelveHour[1]);

    const parsedMinute =
      Number(twelveHour[2]);

    if (
      parsedHour >= 1 &&
      parsedHour <= 12 &&
      parsedMinute >= 0 &&
      parsedMinute <= 59
    ) {
      return {
        hour: parsedHour,
        minute: parsedMinute,
        period:
          twelveHour[3] as Period,
      };
    }
  }

  const twentyFourHour =
    normalized.match(
      /^(\d{1,2}):(\d{2})$/
    );

  if (twentyFourHour) {
    const rawHour =
      Number(twentyFourHour[1]);

    const parsedMinute =
      Number(twentyFourHour[2]);

    if (
      rawHour >= 0 &&
      rawHour <= 23 &&
      parsedMinute >= 0 &&
      parsedMinute <= 59
    ) {
      const convertedPeriod:
        Period =
        rawHour >= 12 ? "PM" : "AM";

      let convertedHour =
        rawHour % 12;

      if (convertedHour === 0) {
        convertedHour = 12;
      }

      return {
        hour: convertedHour,
        minute: parsedMinute,
        period: convertedPeriod,
      };
    }
  }

  return fallback;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor:
      "rgba(4, 10, 20, 0.68)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "100%",
    maxWidth: 370,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#344054",
    backgroundColor: "#101828",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 20,
  },

  handle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#475467",
    marginBottom: 17,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eyebrow: {
    color:
      AppTheme.colors.accentBright,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  title: {
    marginTop: 3,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1D2939",
    justifyContent: "center",
    alignItems: "center",
  },

  timePreview: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  timeValueBlock: {
    width: 90,
    alignItems: "center",
  },

  timeValue: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -1,
  },

  timeUnit: {
    marginTop: -1,
    color: "#667085",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  colon: {
    marginHorizontal: 5,
    marginBottom: 18,
    color:
      AppTheme.colors.accentBright,
    fontSize: 36,
    fontWeight: "500",
  },

  adjustRow: {
    marginTop: 22,
    minHeight: 60,
    borderRadius: 18,
    backgroundColor: "#1D2939",
    flexDirection: "row",
    alignItems: "center",
  },

  adjustGroup: {
    flex: 1,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  adjustButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#27364A",
    justifyContent: "center",
    alignItems: "center",
  },

  adjustButtonActive: {
    backgroundColor:
      AppTheme.colors.accentDark,
  },

  adjustLabel: {
    color: "#98A2B3",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#344054",
  },

  periodSelector: {
    marginTop: 14,
    height: 48,
    borderRadius: 16,
    padding: 4,
    backgroundColor: "#1D2939",
    flexDirection: "row",
  },

  periodButton: {
    flex: 1,
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  periodButtonSelected: {
    backgroundColor:
      AppTheme.colors.accentDark,
  },

  periodText: {
    marginLeft: 6,
    color: "#98A2B3",
    fontSize: 13,
    fontWeight: "800",
  },

  periodTextSelected: {
    color: "#FFFFFF",
  },

  setButton: {
    marginTop: 16,
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 17,
    backgroundColor:
      AppTheme.colors.accent,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  setButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});