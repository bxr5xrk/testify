import { access, mkdir, readFile, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { Data } from '../types/test';
import { log } from './log';

export const loadData = async (path: string) => {
  try {
    await access(path);
    log('success', `Reading '${path}'`);
    const rawData = await readFile(path, 'utf-8');
    return JSON.parse(rawData) as Data[];
  } catch (err) {
    if ((err as { code: string }).code === 'ENOENT') {
      const dir = dirname(path);
      try {
        await access(dir);
      } catch (err) {
        if ((err as { code: string }).code === 'ENOENT') {
          log('success', `Directory '${dir}' does not exist. Creating it...`);
          await mkdir(dir, { recursive: true });
        } else {
          throw Error(`Error accessing directory '${dir}': ${err}`);
        }
      }
      log('success', `File '${path}' does not exist. Creating it...`);
      await writeFile(path, '[]', 'utf-8');
      return [] as Data[];
    }

    throw Error(`Error accessing file '${path}': ${err}`);
  }
};

export const writeData = async (path: string, buffer: Buffer) => {
  const dirPath = path.replace(/\/[^/]+$/, '');
  try {
    await access(dirPath);
  } catch (err) {
    if ((err as { code: string }).code === 'ENOENT') {
      log('success', `Directory '${dirPath}' does not exist. Creating it...`);
      await mkdir(dirPath, { recursive: true });
    } else {
      throw Error(`Error accessing directory '${dirPath}': ${err}`);
    }
  }
  await writeFile(path, buffer).then(() => log('success', path.split('/').at(-1), 'created'));
};
