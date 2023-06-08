export function capitalize (value: string): string {
  return `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`;
}

export function assertMatch (value1: string, value2: string): void {
  if (value1 !== value2) {
    throw new Error('Strings do not match');
  }
}
