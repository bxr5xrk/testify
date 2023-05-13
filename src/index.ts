'use strict';
import axios, { AxiosRequestConfig } from 'axios';
import { accessSync, readFileSync, writeFile, writeFileSync } from 'fs';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { log } from './utils/log';
import { Data, Response } from './types/test';
import { URL } from './config';

const cookie = process.argv.slice(2)[0];

// check cookie
if (!cookie) {
  log('error', 'set cookie!');

  process.exit();
}

const JSON_FILE_PATH = 'database.json';
const DOCX_FILE_PATH = 'Database.docx';

const fetch = async () => {
  const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json, text/plain, */*',
      cookie,
    },
  });

  const config: AxiosRequestConfig = {
    method: 'POST',
    url: URL,
  };

  const { data } = await axiosInstance.request<Response>(config);

  const questions = data.questions;
  const stats = data.stat;
  const category = data.category;

  return { questions, stats, category };
};

try {
  accessSync(JSON_FILE_PATH);

  console.log(`File '${JSON_FILE_PATH}' already exists.`);
} catch (err) {
  // If the file doesn't exist, create it
  if (err) {
    console.log(`File '${JSON_FILE_PATH}' does not exist. Creating it...`);
    writeFileSync(JSON_FILE_PATH, '[]', 'utf-8');
  } else {
    // If there was some other error, log it
    console.error(`Error accessing file '${JSON_FILE_PATH}':`, err);
  }
}

const data = readFileSync(JSON_FILE_PATH, 'utf-8');

async function main() {
  const database: Data[] = [...(JSON.parse(data) as Data[])];

  try {
    const { questions, stats, category } = await fetch();
    console.log('id:', category, 'before: ', database.length);

    // stringify data
    questions.forEach((question) => {
      const findQuestion = stats.find((i) => i.question_id === question.id);
      const answer = question.answers.find(
        (i) => i.id === findQuestion?.true_answer_id
      );
      const newData: Data = {
        id: question.id,
        question: question.text.replace(/\s+/g, ' '),
        answer: answer ? answer.text.replace(/\s+/g, ' ') : 'No answer',
      };

      database.push(newData);
    });

    // filter items
    const uniqueItems = database
      .map((i) => ({
        id: i.id,
        question: i.question.replace(/\s+/g, ' '),
        answer: i.answer.replace(/\s+/g, ' '),
      }))
      .filter((item, index, self) => {
        return index === self.findIndex((p) => p.id === item.id);
      });

    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                ...uniqueItems
                  .map((i, index) => [
                    new TextRun({
                      text: `${index + 1}. ${i.question.replace(/\s+/g, ' ')}`,
                      break: 2,
                      bold: true,
                    }),
                    new TextRun({
                      text: i.answer.replace(/\s+/g, ' '),
                      break: 1,
                    }),
                  ])
                  .flat(),
              ],
            }),
          ],
        },
      ],
    });

    console.log('after: ', uniqueItems.length);

    // write json file
    writeFile(JSON_FILE_PATH, JSON.stringify(uniqueItems), (err) => {
      if (err) {
        console.error(`${JSON_FILE_PATH} ERROR!`);
        return;
      }
      console.log(`${JSON_FILE_PATH} written successfully!`);
    });

    // write docx file
    Packer.toBuffer(doc)
      .then((buffer) => {
        writeFileSync(DOCX_FILE_PATH, buffer);
      })
      .catch(() => console.error(`${DOCX_FILE_PATH} ERROR!`))
      .then(() => console.log(`${DOCX_FILE_PATH} written successfully!`));
  } catch (error) {
    console.error(error);
  }
}

main().catch((err) => console.log('err', err));
