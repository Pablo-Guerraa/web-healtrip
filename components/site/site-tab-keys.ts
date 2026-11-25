import type { KeyboardEvent } from "react";

export function selectSiteTabByKey(event: KeyboardEvent<HTMLElement>) {
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const current = tabs.indexOf(event.target as HTMLButtonElement);
  if (current < 0) return;

  let next: number;
  switch (event.key) {
    case "ArrowUp":
    case "ArrowLeft":
      next = (current + tabs.length - 1) % tabs.length;
      break;
    case "ArrowDown":
    case "ArrowRight":
      next = (current + 1) % tabs.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = tabs.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}
