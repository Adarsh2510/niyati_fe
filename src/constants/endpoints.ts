export enum EBackendEndpoints {
  INITIALIZE_INTERVIEW = '/api/v1/initialize-interview',
  GET_NEXT_QUESTION = '/api/v1/get-next-question',
  SUBMIT_ANSWER = '/api/v1/submit-answer',
  GET_INTERVIEW_SUMMARY = '/api/v1/get-interview-summary',
  GET_CURRENT_QUESTION = '/api/v1/get-current-question',
  INTERVIEW_ROOM_WS = '/ws/interview-room',
}

export enum EJudge0Endpoints {
  SUBMIT_CODE = '/submissions',
  GET_SUBMISSION_RESULT = '/submissions/',
}
