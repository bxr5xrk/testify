import { Data, Question, Stat } from '../types/test';

export const getUniqueTests = (data: Data[]) =>
  data
    .map(({ id, question, answer }) => ({
      id,
      question,
      answer,
    }))
    .filter((item, index, self) => {
      return index === self.findIndex((p) => p.id === item.id);
    });

export const setNewTestsToDatabase = (questions: Question[], stats: Stat[]) =>
  questions.map((question) => {
    const findQuestion = stats.find((i) => i.question_id === question.id);
    const answer = question.answers.find(
      (i) => i.id === findQuestion?.true_answer_id
    );
    const newData: Data = {
      id: question.id,
      question: question.text.replace(/\s+/g, ' '),
      answer: answer ? answer.text.replace(/\s+/g, ' ') : 'No answer',
    };

    return newData;
  });
