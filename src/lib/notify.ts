export type NoticeType = "success" | "error" | "info";

export interface NoticeDetail {
  message: string;
  type: NoticeType;
}

export function notify(message: string, type: NoticeType = "info") {
  window.dispatchEvent(
    new CustomEvent<NoticeDetail>("expertedge:notice", {
      detail: { message, type },
    }),
  );
}
