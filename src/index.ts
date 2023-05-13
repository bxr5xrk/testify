import { getUniqueTests, setNewTestsToDatabase } from './utils/testUtils';
('use strict');
import { writeFile } from 'fs/promises';
import { Data } from './types/test';
import { getTestStats } from './api/getTestStats';
import { loadData } from './utils/fileUtils';
import path from 'path';
import { log } from './utils/log';
import { createDocContent, writeDocFile } from './utils/docxUtils';

const JSON_FILES_FOLDER = 'json';
const DOCX_FILES_FOLDER = 'docx';

async function main() {
  try {
    const { questions, stats, category } = await getTestStats();

    const JSON_FILE_PATH = path.join(JSON_FILES_FOLDER, category + '.json');
    const DOCX_FILE_PATH = path.join(DOCX_FILES_FOLDER, category + '.docx');

    // read existing questions
    const database: Data[] = [...(await loadData(JSON_FILE_PATH))];
    log('success', 'tests before:', database.length);

    // set new question
    database.push(...setNewTestsToDatabase(questions, stats));

    // filter items
    const uniqueItems = getUniqueTests(database);

    log('success', 'tests after:', uniqueItems.length);

    // write json file
    await writeFile(JSON_FILE_PATH, JSON.stringify(uniqueItems)).then(() =>
      log('success', JSON_FILE_PATH.split('/').at(-1), 'created')
    );

    // write docx file
    const doc = createDocContent(uniqueItems);
    await writeDocFile(doc, DOCX_FILE_PATH);
  } catch (error) {
    console.error(error);
  }
}

main().catch((err) => log('error', 'Error:', err));
