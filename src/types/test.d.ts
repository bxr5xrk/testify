export interface Data {
  id: string;
  question: string;
  answer: string;
}

export interface Stat {
  id: string;
  test_id: string;
  question_id: string;
  answer_id: string;
  true_answer_id: string;
  answer_time: string;
  is_cheat: string;
  cheat_time: string;
}

export interface Question {
  id: string;
  text: string;
  user_answer: string;
  answers: {
    id: string;
    text: string;
  }[];
}

export interface Response {
  questions: Question[];
  stat: Stat[];
  category: string;
}
