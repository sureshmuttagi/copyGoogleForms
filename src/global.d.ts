declare module "*.scss";

declare global {
    interface Window {
        navigateTo: (route: string) => void;
    }
}
export {};