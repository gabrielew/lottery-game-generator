export enum StorageKeys {
  GAMES = "@LOTTERY:GAMES",
}

export function useStorage() {
  function get<T>(key: StorageKeys): T | null {
    const current = localStorage.getItem(key);
    if (!!current) return JSON.parse(current);

    return null;
  }

  function set(key: StorageKeys, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  return { get, set };
}
