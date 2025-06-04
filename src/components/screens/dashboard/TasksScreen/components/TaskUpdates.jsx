import React, { useState, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SendIcon from "../../../../../assets/icons/send.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const TaskUpdates = ({ task }) => {
  const { theme } = useContext(ThemeContext);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState(task.comments || []);

  const handleAddComment = () => {
    if (!input.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: "You",
      message: input,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setComments([...comments, newComment]);
    setInput("");
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        {task.comments.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: theme.colors.secondaryText,
                textAlign: "center",
              }}
            >
              No updates yet on this task
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.lightBlack },
                  ]}
                />
                <View
                  style={[
                    styles.commentBox,
                    { backgroundColor: theme.colors.lightBlack },
                  ]}
                >
                  <Text style={[styles.author, { color: theme.colors.text }]}>
                    {comment.author}
                  </Text>
                  <Text style={[styles.message, { color: theme.colors.text }]}>
                    {comment.message}
                  </Text>
                  <Text
                    style={[
                      styles.timestamp,
                      { color: theme.colors.secondaryText },
                    ]}
                  >
                    {comment.timestamp.split(" ")[0]} 
                    {comment.timestamp.split(" ")[1]}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.lightBlack,
                color: theme.colors.text,
              },
            ]}
            placeholder="Type here ..."
            placeholderTextColor={theme.colors.secondaryText}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={handleAddComment}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TaskUpdates;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 16,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  author: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
});
