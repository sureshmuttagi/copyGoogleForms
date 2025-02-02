class InputFormControl extends BaseFormControl {
	
	constructor(){
		super();
	}
	
	// return control in string format
	getControlHtml():string{
		return `<input ${this.buildAttributes()}>`;
	}
	
	// dynamically update or remove attributes
    updateAttribute(key: string, value: string | boolean | number) {
        if (value === false) {
            delete this.attributes[key];
        } else {
            this.attributes[key] = value;
        }
    }
		
	// build attribute string
	private buildAttributes(): string {
        return Object.entries(this.attributes)
            .map(([key, value]) => (typeof value === "boolean" ? key : `${key}="${value}"`))
            .join(" ");
    }
	
	// get the atttributes or specific attribute
	getControlAttributes(key?: string){
		return key ? this.attributes[key] : this.attributes;
	}
	
	// load the control html value within specific container based on containerID value
	render(containerId: string){
		const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }

        container.innerHTML = this.getControlHtml();
	}
	
	
}
