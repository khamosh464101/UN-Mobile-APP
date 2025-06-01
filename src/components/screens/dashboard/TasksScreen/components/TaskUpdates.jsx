import React, { useState } from "react";

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

import { COLORS } from "../../../../../styles/colors";

import SendIcon from "../../../../../assets/icons/send.svg";

const TaskUpdates = ({ task }) => {
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
            <Text style={{ fontSize: 13, color: "#888", textAlign: "center" }}>
              No updates yet on this task
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <View style={styles.avatar} />
                <View style={styles.commentBox}>
                  <Text style={styles.author}>{comment.author}</Text>
                  <Text style={styles.message}>{comment.message}</Text>
                  <Text style={styles.timestamp}>
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
            style={styles.input}
            placeholder="Type here ..."
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
    backgroundColor: COLORS.lightGray,
    marginRight: 12,
  },
  commentBox: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 12,
  },
  author: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    color: COLORS.black,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.subtitle,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderTopColor: COLORS.lightGray,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
});
