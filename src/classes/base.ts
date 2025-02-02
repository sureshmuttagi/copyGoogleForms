abstract class BaseFormControl {
  protected attributes: { [key: string]: string | boolean | number };

  constructor() {
    this.attributes = {};
  }

  abstract getControlHtml(): string; // will provide the HTML of the control

  abstract updateAttribute(key: string, value: string | boolean | number): void; // update the HTML according to the user

  abstract getControlAttributes(key?: string): {} | string | boolean | number; // responds with list of attributes or specific attribute based on the key

  abstract render(containerId: string): void; // load the control html value within specific container containerID value
}
