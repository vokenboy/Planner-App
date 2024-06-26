import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../Components/Header";
import Calendar from "../Components/Calendar";
import { eventMonthCount } from "../Components/API/Events/EventMonthCount";
import { getGroupId } from "../Components/Storage/userDataStorage";
import { GlobalColor } from "../Styles";

const HomeScreen = () => {
  return (
    <View style={styles.view}>
      <Header title={"Home"} />
      <Calendar
        showEvents={true}
        eventMonthCount={eventMonthCount}
        getGroupId={getGroupId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: GlobalColor,
  },
});

export default HomeScreen;
