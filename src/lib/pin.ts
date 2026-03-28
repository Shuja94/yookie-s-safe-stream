// PIN management utility — stores per-user PINs in localStorage
const PIN_KEY = 'halalplay_pin';
const DEFAULT_PIN = '1234';

export function getPin(): string {
  try {
    return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setPin(pin: string): void {
  localStorage.setItem(PIN_KEY, pin);
}

export function verifyPin(input: string): boolean {
  return input === getPin();
}
