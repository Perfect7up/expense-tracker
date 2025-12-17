

export const generateMessageId = (counter: number) =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${counter}`;

export const triggerDownload = (url: string, filename: string) => {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error("Download error:", error);
    return false;
  }
};

export const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
