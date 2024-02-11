export const getErrorMessage = (error: unknown) => {
  let message;
  if (error instanceof Error) message = error.message;
  else message = String(error);

  return message;
};

export const reportError = ({
  customMessage,
  message
}: {
  customMessage: string;
  message: string;
}) => {
  console.error(`${customMessage}: ${message} `);
};
