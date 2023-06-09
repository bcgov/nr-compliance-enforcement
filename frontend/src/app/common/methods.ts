import format from "date-fns/format";

export const getAvatarInitials = (input: string): string => {
  const tokens = input.split(" ");

  if (tokens && tokens.length >= 1) {
    let result = tokens.map((item) => {
      return item.charAt(0);
    });

    return result.join("");
  } else {
    return input.charAt(0);
  }
};

export const formatDate = (input: string): string => {
  return format(Date.parse(input), "MM/dd/yyyy");
};

export const formatTime = (input: string): string => {
  return format(Date.parse(input), "kk:mm:ss");
};
