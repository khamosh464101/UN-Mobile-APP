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
  Image,
  useWindowDimensions
} from "react-native";
import SendIcon from "../../../../../assets/icons/send.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import Toast from 'react-native-toast-message';
import RenderHTML from 'react-native-render-html';
import axios from "../../../../../utils/axios";
import { getErrorMessage } from "../../../../../utils/tools";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskUpdates = ({ task, setTask }) => {
  const { theme } = useContext(ThemeContext);
  const [input, setInput] = useState("");
  const { width } = useWindowDimensions();
  const [editId, setEditId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setAuthUserId(parsedUser.id); // or whatever property holds the user ID
      }
    } catch (error) {
      console.error('Error reading user from AsyncStorage:', error);
    }
  };

  fetchUser();
}, []);

  const handleAddComment = async () => {
    if (!input.trim()) return;

    let url = `/api/ticket-comments`;
    if (editId) {
      url = `/api/ticket-comments/${editId}`;
    }
    try {
      const payload = {
          ticket_id: task.id,
          content: input,
        };
      const {data:result} = editId
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

        if (editId) {
          let tmp = task.comments.map((item) => {
            if (item.id === editId) {
              return { ...item, content: result.data.content };
            }
            return item;
          });
          setTask((prv) => ({...prv, comments: tmp}));
        } else {
           setTask((prv) => ({...prv, comments: [...prv.comments, result.data]}));
        }
        setEditId(null);
        setInput("");
        setSelectedCommentId(null);
        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: 'Successfully added 👋'
        });
    } catch (error) {
      Toast.show({
          type: 'error',
          text1: 'Failed!',
          text2: getErrorMessage(error)
        });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/ticket-comments/${commentId}`);
      setTask(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId)
      }));
      setSelectedCommentId(null);
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Comment deleted successfully'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
    }
  };

  const handleEditComment = (comment) => {
    setInput(comment.content);
    setEditId(comment.id);
    setSelectedCommentId(null);
  };

  const handleCommentPress = (commentId) => {
    if (selectedCommentId === commentId) {
      setSelectedCommentId(null);
    } else {
      setSelectedCommentId(commentId);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        {task?.comments?.length === 0 ? (
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
            {task.comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <Image
                  source={
                    comment?.user?.photo
                      ? { uri: comment.user.photo }
                      : require('../../../../../assets/images/Head.png')
                  }
                  style={[styles.avatar, { backgroundColor: theme.colors.lightBlack }]}
                  resizeMode="cover"
                />
                
                <View style={styles.commentWrapper}>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => handleCommentPress(comment.id)}
                  >
                    <View
                      style={[
                        styles.commentBox,
                        { backgroundColor: theme.colors.lightBlack },
                      ]}
                    >
                      <Text style={[styles.author, { color: theme.colors.text }]}>
                        {comment?.user?.name}
                      </Text>
                      <Text style={[styles.message, { color: theme.colors.text }]}>
                        <RenderHTML
                          contentWidth={width}
                          source={{
                              html: comment?.content,
                            }}
                          baseStyle={{ color: theme.colors.text }}
                        />
                      </Text>
                      <Text
                        style={[
                          styles.timestamp,
                          { color: theme.colors.secondaryText },
                        ]}
                      >
                        {comment?.created_at} 
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {selectedCommentId === comment.id && comment?.user?.id === authUserId &&(
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => handleEditComment(comment)}
                      >
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: "#A52A2A" }]}
                        onPress={() => handleDeleteComment(comment.id)}
                      >
                        <Text style={styles.actionButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
  commentWrapper: {
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
  },
});