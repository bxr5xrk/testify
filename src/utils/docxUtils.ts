import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Data } from '../types/test';
import { writeData } from './fileUtils';

export const createDocContent = (data: Data[]) =>
  new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              ...data
                .map(({ answer, question }, index) => [
                  new TextRun({
                    text: `${index + 1}. ${question}`,
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: answer,
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

export const writeDocFile = async (content: Document, path: string) => {
  const buffer = await Packer.toBuffer(content);
  await writeData(path, buffer);
};
