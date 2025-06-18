import { useSQLiteContext } from "expo-sqlite";
import { v4 as uuidv4 } from "uuid";

/**
 * Initializes the database tables.
 * Creates 'survey_sessions' and 'survey_answers' tables if they don't exist.
 * Uses db.execAsync for initial schema setup.
 * @param {SQLiteDatabase} db The database instance from useSQLiteContext.
 */
export const initDatabase = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");

    console.log("Initializing database...");

    // Drop existing tables to ensure clean state
    await db.runAsync("DROP TABLE IF EXISTS survey_answers");
    await db.runAsync("DROP TABLE IF EXISTS survey_sessions");

    // Create survey_sessions table with the working schema
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS survey_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        survey_id TEXT,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        end_time TEXT
      )
    `);

    // Create survey_answers table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS survey_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        question_id TEXT NOT NULL,
        value TEXT,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES survey_sessions (id)
      )
    `);

    // Verify table creation
    const sessionsTableInfo = await db.getAllAsync(
      "PRAGMA table_info(survey_sessions)"
    );
    console.log(
      "Created survey_sessions table with schema:",
      sessionsTableInfo
    );

    const answersTableInfo = await db.getAllAsync(
      "PRAGMA table_info(survey_answers)"
    );
    console.log("Created survey_answers table with schema:", answersTableInfo);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

/**
 * Creates a new survey session in the database.
 * @param {Object} db - The SQLite database instance.
 * @param {string|null} surveyId - Optional survey ID.
 * @returns {Promise<number>} The ID of the newly created session.
 */
export const createSurveySession = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");

    // First check if the table exists and has the right schema
    const tableInfo = await db.getAllAsync(
      "PRAGMA table_info(survey_sessions)"
    );
    console.log("Current table schema:", tableInfo);

    // Check if we have any existing sessions
    const existingSessions = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM survey_sessions"
    );
    console.log("Existing sessions count:", existingSessions[0].count);

    const now = new Date().toISOString();
    console.log("Creating new survey session with:", {
      status: "draft",
      created_at: now,
    });

    const result = await db.runAsync(
      "INSERT INTO survey_sessions (status, created_at) VALUES (?, ?)",
      ["draft", now]
    );

    console.log("Survey session created with result:", result);

    // Verify the session was created
    const newSession = await db.getAllAsync(
      "SELECT * FROM survey_sessions WHERE id = ?",
      [result.lastInsertRowId]
    );
    console.log("Verified new session:", newSession[0]);

    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error creating survey session:", error);
    throw error;
  }
};

/**
 * Saves an answer to a question within a session. Updates if exists, inserts if new.
 * @param {SQLiteDatabase} db The database instance.
 * @param {number} sessionId The ID of the survey session.
 * @param {string} questionId The ID of the question.
 * @param {*} value The answer content (will be stringified).
 * @param {string} type The type of the answer (e.g., 'text', 'number', 'array').
 */
export const saveAnswer = async (db, sessionId, questionId, value, type) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const now = new Date().toISOString();

    // Handle different types of answers
    let answerValue = value;

    // Handle photo type answers
    if (type === "input_photo") {
      if (Array.isArray(value)) {
        // Handle array of photos
        if (value.length > 0) {
          // If array is empty, save as empty array string
          answerValue = JSON.stringify(value.map((photo) => photo.uri));
          // answerValue = "[]";
        } else {
          // Only map if we have photos
          console.log("Skipping save of empty photo array");
          return;
        }
      } else if (typeof value === "object" && value.uri) {
        // Handle single photo
        answerValue = value.uri;
      } else {
        // Handle null/undefined case
        // answerValue = null;
        console.log("Skipping save of null photo value");
        return;
      }
    }

    // Handle date type answers
    if (type === "input_date" && value instanceof Date) {
      answerValue = value.toISOString();
    }

    // Handle text and number inputs - ensure they're strings
    if (type === "input_text" || type === "input_number") {
      answerValue = value ? String(value) : null;
    }

    console.log("Saving answer with processed value:", {
      questionId,
      sessionId,
      type,
      value: answerValue,
    });

    await db.runAsync(
      `INSERT INTO survey_answers (session_id, question_id, value, type, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [sessionId, questionId, answerValue, type, now]
    );

    console.log("Answer saved successfully");
  } catch (error) {
    console.error("Error saving answer:", error);
    throw error;
  }
};

/**
 * Retrieves all answers for a specific session.
 * @param {SQLiteDatabase} db The database instance.
 * @param {number} sessionId The ID of the survey session.
 * @returns {Promise<object>} An object mapping question_id to {value, type}.
 */
export const getSessionAnswers = async (db, sessionId) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT question_id, value, type, created_at FROM survey_answers WHERE session_id = ? ORDER BY created_at ASC",
      [sessionId]
    );
    return rows;
  } catch (error) {
    console.error("Error getting session answers:", error);
    throw error;
  }
};

/**
 * Marks a survey session as 'completed'.
 * @param {SQLiteDatabase} db The database instance.
 * @param {number} sessionId The ID of the survey session to complete.
 */
export const completeSurveySession = async (
  db,
  sessionId,
  status = "completed"
) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");

    // First verify the session exists
    const existingSession = await db.getAllAsync(
      "SELECT * FROM survey_sessions WHERE id = ?",
      [sessionId]
    );
    console.log("Existing session before update:", existingSession[0]);

    const now = new Date().toISOString();
    console.log("Updating session with:", {
      sessionId,
      status,
      end_time: now,
    });

    const result = await db.runAsync(
      "UPDATE survey_sessions SET status = ?, end_time = ? WHERE id = ?",
      [status, now, sessionId]
    );

    // Verify the update
    const updatedSession = await db.getAllAsync(
      "SELECT * FROM survey_sessions WHERE id = ?",
      [sessionId]
    );
    console.log("Updated session:", updatedSession[0]);

    console.log(
      `Survey session ${sessionId} marked as ${status}. Changes: ${result.changes}`
    );
  } catch (error) {
    console.error("Error completing survey session:", error);
    throw error;
  }
};

/**
 * Retrieves all survey sessions that are currently 'in_progress'.
 * @param {SQLiteDatabase} db The database instance.
 * @returns {Promise<Array<object>>} An array of incomplete survey session objects.
 */
export const getIncompleteSessions = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT * FROM survey_sessions WHERE status = ?",
      ["in_progress"]
    );
    console.log(`Found ${rows.length} incomplete sessions.`);
    return rows;
  } catch (error) {
    console.error("Error getting incomplete sessions:", error);
    throw error;
  }
};

/**
 * Deletes a survey session and all its associated answers.
 * @param {SQLiteDatabase} db The database instance.
 * @param {number} sessionId The ID of the survey session to delete.
 */
export const deleteSurveySession = async (db, sessionId) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");

    // Using a transaction for multi-step deletion
    await db.withTransactionAsync(async (tx) => {
      // First delete all answers associated with the session
      await tx.runAsync("DELETE FROM survey_answers WHERE session_id = ?", [
        sessionId,
      ]);
      // Then delete the session itself
      await tx.runAsync("DELETE FROM survey_sessions WHERE id = ?", [
        sessionId,
      ]);
    });
    console.log(`Survey session ${sessionId} and its answers deleted.`);
  } catch (error) {
    console.error("Error deleting survey session:", error);
    throw error;
  }
};

/**
 * Retrieves all finalized surveys.
 * @param {SQLiteDatabase} db The database instance.
 * @returns {Promise<Array<object>>} An array of finalized survey session objects.
 */
export const getFinalizedSurveys = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT * FROM survey_sessions WHERE status = ? ORDER BY end_time DESC",
      ["finalized"]
    );
    console.log(`Found ${rows.length} finalized surveys`);
    return rows;
  } catch (error) {
    console.error("Error getting finalized surveys:", error);
    throw error;
  }
};

/**
 * Retrieves a survey session's details.
 * @param {SQLiteDatabase} db The database instance.
 * @param {number} sessionId The ID of the survey session.
 * @returns {Promise<object>} The survey session details.
 */
export const getSurveySession = async (db, sessionId) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT * FROM survey_sessions WHERE id = ?",
      [sessionId]
    );
    if (rows.length === 0) {
      throw new Error(`No survey session found with ID ${sessionId}`);
    }
    return rows[0];
  } catch (error) {
    console.error("Error getting survey session:", error);
    throw error;
  }
};

/**
 * Retrieves all survey questions for a specific survey.
 * @param {SQLiteDatabase} db The database instance.
 * @param {string} surveyId The ID of the survey.
 * @returns {Promise<Array<object>>} An array of survey question objects.
 */
export const getSurveyQuestions = async (db, surveyId) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT * FROM survey_questions WHERE survey_id = ?",
      [surveyId]
    );
    return rows;
  } catch (error) {
    console.error("Error getting survey questions:", error);
    throw error;
  }
};

/**
 * Retrieves all draft surveys.
 * @param {SQLiteDatabase} db The database instance.
 * @returns {Promise<Array<object>>} An array of draft survey session objects.
 */
export const getDraftSurveys = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT * FROM survey_sessions WHERE status = ? ORDER BY end_time DESC",
      ["draft"]
    );
    console.log(`Found ${rows.length} draft surveys`);
    return rows;
  } catch (error) {
    console.error("Error getting draft surveys:", error);
    throw error;
  }
};

/**
 * Resets the database schema.
 * @param {SQLiteDatabase} db The database instance.
 */
export const resetDatabase = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");

    // Drop existing tables
    await db.runAsync("DROP TABLE IF EXISTS survey_answers");
    await db.runAsync("DROP TABLE IF EXISTS survey_sessions");

    // Create survey_sessions table with created_at column
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS survey_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        survey_id TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME
      )
    `);

    // Create survey_answers table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS survey_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER,
        question_id TEXT,
        value TEXT,
        type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES survey_sessions (id)
      )
    `);

    console.log("Database schema reset successfully");
  } catch (error) {
    console.error("Error resetting database schema:", error);
    throw error;
  }
};

// Get all draft survey sessions
export const getDraftSessions = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT id, created_at, end_time FROM survey_sessions WHERE status = 'draft' ORDER BY created_at DESC"
    );
    console.log(`Found ${rows.length} draft surveys`);
    return rows;
  } catch (error) {
    console.error("Error getting draft sessions:", error);
    throw error;
  }
};

// Get all finalized survey sessions
export const getFinalizedSessions = async (db) => {
  try {
    if (!db) throw new Error("Database instance is undefined.");
    const rows = await db.getAllAsync(
      "SELECT id, created_at, end_time FROM survey_sessions WHERE status = 'finalized' ORDER BY created_at DESC"
    );
    return rows;
  } catch (error) {
    console.error("Error getting finalized sessions:", error);
    throw error;
  }
};

// Export all functions as default object for convenience
export default {
  initDatabase,
  createSurveySession,
  saveAnswer,
  getSessionAnswers,
  completeSurveySession,
  getIncompleteSessions,
  deleteSurveySession,
  getFinalizedSurveys,
  getSurveySession,
  getSurveyQuestions,
  getDraftSurveys,
  resetDatabase,
  getDraftSessions,
  getFinalizedSessions,
};
