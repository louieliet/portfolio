const STORAGE_KEY = "scroll-positions";
const HOME_RETURN_STORAGE_KEY = "home-return-scroll-position";
const HOME_RETURN_PROJECT_STORAGE_KEY = "home-return-project-id";

type ScrollPositions = Record<string, number>;

function readScrollPositions(): ScrollPositions {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScrollPositions) : {};
  } catch {
    return {};
  }
}

function writeScrollPositions(positions: ScrollPositions) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

export function getScrollPosition(pathname: string) {
  const positions = readScrollPositions();
  return typeof positions[pathname] === "number" ? positions[pathname] : 0;
}

export function saveScrollPosition(pathname: string, position: number) {
  const positions = readScrollPositions();
  positions[pathname] = Math.max(0, position);
  writeScrollPositions(positions);
}

export function getHomeReturnScrollPosition() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(HOME_RETURN_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  const position = Number(raw);
  return Number.isFinite(position) ? position : null;
}

export function saveHomeReturnScrollPosition(position: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    HOME_RETURN_STORAGE_KEY,
    String(Math.max(0, position))
  );
}

export function clearHomeReturnScrollPosition() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(HOME_RETURN_STORAGE_KEY);
}

export function getHomeReturnProjectId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(HOME_RETURN_PROJECT_STORAGE_KEY);
}

export function saveHomeReturnProjectId(projectId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(HOME_RETURN_PROJECT_STORAGE_KEY, projectId);
}

export function clearHomeReturnProjectId() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(HOME_RETURN_PROJECT_STORAGE_KEY);
}
