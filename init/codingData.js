const tcsCodingQuestions = [
  {
    question: "Find Factorial",
    description: "Given an integer n, return its factorial.",
    input_format: "Integer n",
    output_format: "Integer factorial of n",
    sample_input: "5",
    sample_output: "120",
    sampleTestCases: [
      { input: "3", output: "6" }
    ],
    hiddenTestCases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" },
      { input: "7", output: "5040" }
    ],
    difficulty: "easy",
    tags: ["math", "recursion"],
    company: "tcs",
    test_name: "tcs-coding",
    marks: 100
  },

  {
    question: "Check Palindrome Number",
    description: "Given an integer n, check whether it is a palindrome.",
    input_format: "Integer n",
    output_format: "true or false",
    sample_input: "121",
    sample_output: "true",
    sampleTestCases: [
      { input: "121", output: "true" }
    ],
    hiddenTestCases: [
      { input: "123", output: "false" },
      { input: "11", output: "true" },
      { input: "10", output: "false" }
    ],
    difficulty: "easy",
    tags: ["math"],
    company: "tcs",
    test_name: "tcs-coding",
    marks: 100
  },

  {
    question: "Count Vowels",
    description: "Given a string, count the number of vowels.",
    input_format: "String s",
    output_format: "Integer count",
    sample_input: "hello",
    sample_output: "2",
    sampleTestCases: [
      { input: "hello", output: "2" }
    ],
    hiddenTestCases: [
      { input: "education", output: "5" },
      { input: "xyz", output: "0" },
      { input: "AEIOU", output: "5" }
    ],
    difficulty: "easy",
    tags: ["string"],
    company: "tcs",
    test_name: "tcs-coding",
    marks: 100
  },

  {
    question: "Find Maximum Element",
    description: "Given an array of integers, find the maximum element.",
    input_format: "Array of integers (space separated)",
    output_format: "Integer (maximum value)",
    sample_input: "1 2 3 4 5",
    sample_output: "5",
    sampleTestCases: [
      { input: "1 2 3", output: "3" }
    ],
    hiddenTestCases: [
      { input: "10 20 5", output: "20" },
      { input: "-1 -2 -3", output: "-1" },
      { input: "7", output: "7" }
    ],
    difficulty: "easy",
    tags: ["array"],
    company: "tcs",
    test_name: "tcs-coding",
    marks: 100
  },

  {
    question: "Nth Fibonacci Number",
    description: "Given n, return the nth Fibonacci number.",
    input_format: "Integer n",
    output_format: "Integer",
    sample_input: "5",
    sample_output: "5",
    sampleTestCases: [
      { input: "4", output: "3" }
    ],
    hiddenTestCases: [
      { input: "6", output: "8" },
      { input: "0", output: "0" },
      { input: "1", output: "1" }
    ],
    difficulty: "medium",
    tags: ["recursion", "dp"],
    company: "tcs",
    test_name: "tcs-coding",
    marks: 100
  }
];

module.exports = tcsCodingQuestions;