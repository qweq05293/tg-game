import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import path from 'path';

// Конфигурация путей и ключей
const CONFIG = {
  backend: {
    envPath: path.resolve(__dirname, '../packages/backend/.env'),
    key: 'FRONTEND_URL',
  },
  frontend: {
    envPath: path.resolve(__dirname, '../packages/frontend/.env'),
    key: 'VITE_BACK_BASE_URL',
  },
} as const;


// Запуск утилиты concurrently для генерации туннелей
const child: ChildProcessWithoutNullStreams = spawn(
  'npx',
  [
    'concurrently',
    'cloudflared tunnel --url http://localhost:5173',
    'cloudflared tunnel --url http://localhost:3000'
  ],
  { shell: false }
);

/**
 * Обновляет или добавляет переменную окружения в указанный .env файл.
 */
function updateEnvFile(filePath: string, key: string, value: string): void {
  try {
    // Создаем файл, если он не существует
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, `${key}=${value}\n`);
      console.log(`[EnvUpdater] Created file and set ${key}`);
      return;
    }

    let content: string = fs.readFileSync(filePath, 'utf8');
    const regex: RegExp = new RegExp(`^${key}=.*`, 'm');

    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      // Добавляем с новой строки, если переменной не было
      content = content.trim() ? `${content.trim()}\n${key}=${value}\n` : `${key}=${value}\n`;
    }

    fs.writeFileSync(filePath, content);
    console.log(`[EnvUpdater] Updated ${key} in ${path.basename(filePath)} -> ${value}`);
  } catch (error) {
    console.error(`[EnvUpdater] Error updating ${filePath}:`, error);
  }
}

// Обработка потока вывода (stdout)
child.stdout.on('data', (chunk: Buffer): void => {
  const output: string = chunk.toString();
  process.stdout.write(output); // Дублируем вывод туннелей в терминал

  const lines: string[] = output.split('\n');

  lines.forEach((line: string) => {
    if (!line.includes('trycloudflare.com')) return;

    // Регулярное выражение для поиска URL
    const urlMatch: RegExpMatchArray | null = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (!urlMatch) return;

    const url: string = urlMatch[0];

    // Проверяем префиксы concurrently [0] и [1]
    if (line.startsWith('[0]')) {
      // Порт 5173 (Фронтенд) -> записываем адрес фронтенда в бэкенд
      updateEnvFile(CONFIG.backend.envPath, CONFIG.backend.key, url);
    } else if (line.startsWith('[1]')) {
      // Порт 3000 (Бэкенд) -> записываем адрес бэкенда во фронтенд
      updateEnvFile(CONFIG.frontend.envPath, CONFIG.frontend.key, url);
    }
  });
});

// Обработка ошибок (stderr)
child.stderr.on('data', (chunk: Buffer): void => {
  process.stderr.write(chunk.toString());
});

// Логика завершения процесса
child.on('close', (code: number | null): void => {
  process.exit(code ?? 0);
});
