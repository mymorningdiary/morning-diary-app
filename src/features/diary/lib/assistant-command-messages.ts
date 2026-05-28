const DAY_MS = 1000 * 60 * 60 * 24;

const FIXED_ASSISTANT_COMMAND_MESSAGES = {
  '@사랑해오빠': '뭐라고?',
  '@사랑해오빠야': '나도사랑해 😚😚💛🤍💛🤍',
  '@기성이는': '재섭이반쪽',
  '@재섭이는': '기성이반쪽',
  '@규현': '오늘 하루도 고생했다 얘들아',
  '@보니': '이 형 또 밑밥 존나까네 ㅋㅋ',
  '@보고싶다': '나도 보고싶다',
} satisfies Record<string, string>;

type FixedAssistantCommand = keyof typeof FIXED_ASSISTANT_COMMAND_MESSAGES;

export function getDiaryAssistantCommandMessage(command: string) {
  if (isFixedAssistantCommand(command)) {
    return FIXED_ASSISTANT_COMMAND_MESSAGES[command];
  }

  const togetherSinceDate = command.match(/^@함께한지(\d{8})$/)?.[1];
  if (togetherSinceDate) {
    const elapsedDays = getElapsedDays(togetherSinceDate);
    return elapsedDays === null ? null : `+${elapsedDays}일 💛`;
  }

  return null;
}

function isFixedAssistantCommand(command: string): command is FixedAssistantCommand {
  return command in FIXED_ASSISTANT_COMMAND_MESSAGES;
}

function getElapsedDays(dateText: string) {
  const year = Number(dateText.slice(0, 4));
  const month = Number(dateText.slice(4, 6));
  const date = Number(dateText.slice(6, 8));

  const startDate = new Date(year, month - 1, date);
  if (
    startDate.getFullYear() !== year ||
    startDate.getMonth() !== month - 1 ||
    startDate.getDate() !== date
  ) {
    return null;
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return Math.floor((todayStart.getTime() - startDate.getTime()) / DAY_MS) + 1;
}
