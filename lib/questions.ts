export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export const questions: Question[] = [
  {
    id: 1,
    question: 'What is the primary purpose of artificial intelligence?',
    options: [
      'To replace all human workers',
     'To enhance human capabilities and solve complex problems',
      'To create sentient robots',
      'To automate only repetitive tasks',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which of the following is not a machine learning algorithm?',
    options: ['Linear Regression', 'Decision Trees', 'Rainbow Sort', 'Neural Networks'],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: 'What does API stand for?',
    options: [
      'Advanced Programming Interface',
      'Application Programming Interface',
      'Automated Process Integration',
      'Advanced Process Integration',
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: 'In web development, what does CSS primarily control?',
    options: [
      'Server-side logic',
      'Database management',
      'Styling and layout of web pages',
      'Network protocols',
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: 'Which data structure follows the LIFO principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: 'What is the main advantage of cloud computing?',
    options: [
      'It reduces internet speed',
      'It provides scalability and flexibility',
      'It eliminates the need for security',
      'It makes programming easier',
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: 'In object-oriented programming, what is encapsulation?',
    options: [
      'Wrapping data and methods together to hide internal details',
      'Creating multiple copies of objects',
      'Transforming one object into another',
      'Storing objects in arrays',
    ],
    correctAnswer: 0,
  },
  {
    id: 9,
    question: 'What does HTTP stand for?',
    options: [
      'Hyper Text Transmission Protocol',
      'HyperText Transfer Protocol',
      'High Tech Transfer Protocol',
      'Home Terminal Transfer Protocol',
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: 'Which of these is a NoSQL database?',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
    correctAnswer: 2,
  },
  {
    id: 11,
    question: 'What is a REST API?',
    options: [
      'A method to rest between API calls',
      'An API that uses HTTP requests to perform CRUD operations',
      'A type of database query language',
      'A security protocol for APIs',
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    question: 'In React, what is a component?',
    options: [
      'A database table',
      'A reusable piece of UI with its own state and logic',
      'A CSS styling rule',
      'A server request method',
    ],
    correctAnswer: 1,
  },
  {
    id: 13,
    question: 'What is the purpose of version control systems like Git?',
    options: [
      'To delete old code',
      'To track changes and manage code collaboration',
      'To compile code faster',
      'To encrypt source code',
    ],
    correctAnswer: 1,
  },
  {
    id: 14,
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'],
    correctAnswer: 2,
  },
  {
    id: 15,
    question: 'What is the purpose of unit testing?',
    options: [
      'To measure the weight of software',
      'To test individual components in isolation',
      'To test the entire application at once',
      'To measure code execution speed',
    ],
    correctAnswer: 1,
  },
  {
    id: 16,
    question: 'In networking, what is the OSI model?',
    options: [
      'A physical network device',
      'A framework for understanding network communication',
      'A type of internet service',
      'A programming language',
    ],
    correctAnswer: 1,
  },
  {
    id: 17,
    question: 'What does CRUD stand for?',
    options: [
      'Create, Read, Upload, Delete',
      'Create, Read, Update, Delete',
      'Copy, Read, Use, Delete',
      'Create, Replicate, Update, Download',
    ],
    correctAnswer: 1,
  },
  {
    id: 18,
    question: 'Which of these is a front-end framework?',
    options: ['Django', 'Flask', 'Vue.js', 'Spring Boot'],
    correctAnswer: 2,
  },
  {
    id: 19,
    question: 'What is containerization in software development?',
    options: [
      'Storing code in physical containers',
      'Packaging applications with dependencies in isolated environments',
      'Creating smaller versions of applications',
      'A method of data compression',
    ],
    correctAnswer: 1,
  },
  {
    id: 20,
    question: 'What does DevOps emphasize?',
    options: [
      'Only development work',
      'Only operations work',
      'Integration and collaboration between development and operations',
      'Using only open-source tools',
    ],
    correctAnswer: 2,
  },
]
