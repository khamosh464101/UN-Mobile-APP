// groupUtils.js

// Parses a flat KoBo survey array into nested groups
export const parseSurveyWithGroups = (survey) => {
  const stack = [];
  const root = [];
  let current = root;

  for (const item of survey) {
    if (item.type === "begin_group") {
      const group = {
        ...item,
        type: "group",
        children: [],
      };
      current.push(group);
      stack.push(current);
      current = group.children;
    } else if (item.type === "end_group") {
      current = stack.pop();
    } else {
      current.push(item);
    }
  }

  return root;
};

// Flattens a nested survey (with groups) to a flat list of questions + groups
export const flattenSurvey = (arr) => {
  if (!Array.isArray(arr)) return []; // 👈 prevent crash

  return arr.reduce((acc, item) => {
    if (item.type === "group") {
      return acc.concat([item], flattenSurvey(item.children));
    }
    return acc.concat(item);
  }, []);
};

// Evaluates a KoBo relevant expression (basic selected(${var},"value") support)
export const evaluateRelevant = (expr, answers, surveyData) => {
  if (!expr) return true;

  const match = expr.match(/selected\(\$\{([^}]+)\},\"([^\"]+)\"\)/);
  if (!match) return true;

  const [, answerKey, expectedValue] = match;

  const flattened = flattenSurvey(surveyData);
  const question = flattened.find((q) => q.name === answerKey);
  const actualValue = answers[answerKey] || answers[question?.id];

  return actualValue === expectedValue;
};

// Checks if question should be visible (self + parent groups relevant)
export const isQuestionRelevant = (
  question,
  answers,
  surveyData,
  parentRelevant = true
) => {
  const selfRelevant = question.relevant
    ? evaluateRelevant(question.relevant, answers, surveyData)
    : true;
  return parentRelevant && selfRelevant;
};
