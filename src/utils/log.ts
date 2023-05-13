const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  RESET: '\x1b[0m',
} as const;

export const log = (status: 'success' | 'error', message: string) =>
  console.log(
    (status === 'success'
      ? COLORS.GREEN + '[SUCCESS]:'
      : COLORS.RED + '[ERROR]:') + COLORS.RESET,
    message.toUpperCase()
  );
