// import errorMessages from "@/data/error-messages.json";
import errorMessages from "@/data/error-messages.json";
type CustomErrorMessage = {
  title: string;
  description: string;
};

export function getErrorMessages(statusCode: number): CustomErrorMessage {
  let { title, description } = errorMessages.default;

  const range = errorMessages.range.find(
    (entry) => entry.min <= statusCode && entry.max >= statusCode
  );
  if (range) {
    title = range.title ?? title;
    description = range.description ?? description;
  }

  const specific = errorMessages.specific.find((entry) => entry.statusCode === statusCode);
  if (specific) {
    title = specific.title ?? title;
    description = specific.description ?? description;
  }

  return {
    title,
    description,
  };
}
