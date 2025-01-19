import { ELogLevels } from "@/constants/logs";

type TLog = {
    err: Error;
    level: (typeof ELogLevels)[keyof typeof ELogLevels];
  };
export const sendLog = async (log: TLog) => {
    //TODO: Implement sentry or corologix here
    console.log(log.err.message);
}
