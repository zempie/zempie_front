// development, local  에서만 씀
export const colorLog = (message: any, color?: string) => {

  color = color || "white";

  switch (color) {
    case "success":
      color = "Green";
      break;
    case "info":
      color = "DodgerBlue";
      break;
    case "error":
      color = "Red";
      break;
    case "warning":
      color = "Orange";
      break;
    default:
      color = color;
  }

  console.log("%c" + message, "color:" + color);
}