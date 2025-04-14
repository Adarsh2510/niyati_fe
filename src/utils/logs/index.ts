import { ELogLevels } from '@/constants/logs';

type TLog = {
  err: Error;
  level: (typeof ELogLevels)[keyof typeof ELogLevels];
  message?: string;
  service?: string;
  function?: string;
};
export const sendLog = async (log: TLog) => {
  //TODO: Implement sentry or corologix here
  console.log(log.level, log.message, log.err.message, log.service, log.function);
};
