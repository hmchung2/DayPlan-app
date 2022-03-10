import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  Platform,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
const STORAGE_KEY = "@toDos";
const STATUS_KEY = "@status";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [editingKey, setEditingKey] = useState("");

  const saveToDos = async (toSave) => {
    try {
      const s = JSON.stringify(toSave);
      await AsyncStorage.setItem(STORAGE_KEY, s);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeText = (payload) => {
    setText(payload);
    console.log("changed : " + text);
  };

  const saveStatus = async (status) => {
    try {
      console.log("Saving Working : " + status);
      const s = JSON.stringify(status);
      await AsyncStorage.setItem(STATUS_KEY, s);
    } catch (error) {
      console.log(error);
    }
  };

  const travel = () => {
    cancelEdit();
    setEditingKey("");
    setWorking(false);
    saveStatus(false);
    console.log("travel");
  };

  const work = () => {
    cancelEdit();
    setEditingKey("");
    setWorking(true);
    saveStatus(true);
    console.log("work");
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setToDos(JSON.parse(s));
    }
    console.log(s);
  };

  const loadStatus = async () => {
    console.log("loading Status");
    const s = await AsyncStorage.getItem(STATUS_KEY);
    if (s) {
      console.log(s);
      setWorking(JSON.parse(s));
    }
  };

  const editTodo = async (key) => {
    if (text === "") {
      return;
    }

    const editingTodo = toDos[key];
    console.log(editingTodo);
    editingTodo["text"] = text;
    const newTodos = toDos;
    newTodos[key] = editingTodo;
    setToDos(newTodos);
    await saveToDos(newTodos);
    setText("");
    setEditingKey("");
  };

  const addTodo = async () => {
    if (text === "") {
      return;
    }
    //alert(text);
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, work: working, complete: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const logText = () => {
    console.log("log : " + text);
  };

  const editText = (key) => {
    setEditingKey(key);
  };

  const completeTodo = async (key) => {
    const newTodos = { ...toDos };
    const completeTodo = newTodos[key];
    completeTodo["complete"] = true;
    console.log("completed : ", completeTodo);

    newTodos[key] = completeTodo;
    setToDos(newTodos);
    await saveToDos(newTodos);
  };

  const cancelEdit = () => {
    setText("");
    setEditingKey("");
  };

  const deleteTodo = async (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do  you want to delete this To Do?");
      if (ok) {
        const newTodos = { ...toDos };
        delete newTodos[key];
        setToDos(newTodos);
        await saveToDos(newTodos);
      }
    } else {
      Alert.alert("Delete to Do? ", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const newTodos = { ...toDos };
            delete newTodos[key];
            setToDos(newTodos);
            await saveToDos(newTodos);
          },
        },
      ]);
    }
  };

  // const handleBackButtonClick = () => {
  //   console.log("back Button Clicked");
  //   cancelEdit();
  //   return true;
  // };

  //console.log(toDos);
  useEffect(() => {
    //BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    loadStatus();
    loadToDos();
    // return () => {
    //   BackHandler.removeEventListener(
    //     "hardwareBackPress",
    //     handleBackButtonClick
    //   );
    // };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableHighlight
          underlayColor="grey"
          activeOpacity={0.01}
          onPress={travel}
        >
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableHighlight>

        {/* <Pressable>
          <Text style={styles.btnText}>Travel</Text>
        </Pressable> */}
        {/* <TouchableOpacity activeOpacity={0}>
          <Text style={styles.btnText}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.btnText}>Travel</Text>
        </TouchableOpacity> */}
      </View>

      <TextInput
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        returnKeyType="done"
        autoFocus={true}
        value={text}
        keyboardType="default"
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={editingKey == "" ? styles.input : null}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          working == toDos[key].work ? (
            <View style={styles.toDo} key={key}>
              {key == editingKey ? (
                <TextInput
                  onSubmitEditing={() => editTodo(key)}
                  onChangeText={onChangeText}
                  returnKeyType="done"
                  value={text}
                  autoFocus={true}
                  keyboardType="default"
                  style={styles.editInput}
                  onEndEditing={cancelEdit}
                ></TextInput>
              ) : (
                <Text
                  style={
                    toDos[key].complete
                      ? {
                          ...styles.toDoText,
                          textDecorationLine: "line-through",
                          color: theme.grey,
                          fontWeight: "300",
                        }
                      : styles.toDoText
                  }
                >
                  {toDos[key].text}
                </Text>
              )}

              <View style={styles.emoJibtn}>
                <TouchableOpacity
                  style={styles.eachEmoji}
                  onPress={() => deleteTodo(key)}
                >
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.eachEmoji}
                  onPress={() => editText(key)}
                >
                  <AntDesign name="edit" size={18} color="black" />
                </TouchableOpacity>

                {!toDos[key].complete ? (
                  <TouchableOpacity
                    style={styles.eachEmoji}
                    onPress={() => completeTodo(key)}
                  >
                    <Fontisto name="check" size={18} color={theme.grey} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity></TouchableOpacity>
                )}
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    flex: 1,
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText: {
    flex: 5,
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  emoJibtn: {
    flex: 3,
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },
  eachEmoji: {
    marginHorizontal: 10,
  },
  editInput: {
    backgroundColor: "#D3D3D3",
  },
});
