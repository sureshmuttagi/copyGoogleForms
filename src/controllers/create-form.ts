export function initializeCreateForm() {
  let rowIdCounter = 0;
  let formId: Number;
  localStorage.removeItem("tempForm");
  let tableBody: HTMLDivElement;

  if (localStorage.getItem("isNewForm") === "yes") {
    tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
    formId = Number(localStorage.getItem("formCounter"));
    localStorage.setItem("currentFormId", formId.toString());
    // Add first row by default
    createRow();
  } else {
    formId = Number(localStorage.getItem("currentFormId"));
    let formsList = JSON.parse(localStorage.getItem("formList") as string);
    let formData = "";
    formsList.forEach(
      (form: { userId: number; formId: number; formData: string }) => {
        if (
          form.userId === Number(localStorage.getItem("userId")) &&
          formId === Number(form.formId)
        ) {
          formData = form.formData;
        }
      }
    );
    const tableBody = document.querySelector("#form") as HTMLDivElement;
    tableBody.innerHTML = formData;
  }

  const addRowButton = document.getElementById("addRow") as HTMLButtonElement;
  // Add row on button click
  addRowButton.addEventListener("click", createRow);

  const saveFormButton = document.getElementById(
    "saveForm"
  ) as HTMLButtonElement;
  // Save Form
  saveFormButton.addEventListener("click", saveForm);

  const previewFormButton = document.getElementById(
    "previewForm"
  ) as HTMLButtonElement;
  // Preview Form
  previewFormButton.addEventListener("click", previewForm);

  // Function to create a new row
  function createRow() {
    const rowId = rowIdCounter++;
    const row = document.createElement("tr");
    row.setAttribute("data-id", rowId.toString());

    row.innerHTML = `
          <td class="row-container">
              <!-- First Row -->
              <div class="top-row">
                  <input type="text" class="question-textbox textbox" placeholder="Enter your question here ...">
                  <button class="button delete-row admin-control">X</button>
              </div>
    
              <!-- Second Row -->
              <div class="middle-row">
                  <div class="control-container"></div>
                  <select class="control-dropdown admin-control">
                      <option value="">Select Control</option>
                      <option value="textbox">Textbox</option>
                      <option value="checkbox">Multi Select Checkbox</option>
                      <option value="radio">Radio Button</option>
                  </select>
              </div>
    
              <!-- Third Row -->
              <div class="bottom-row admin-control">
                  <span> Required: </span>
                  <label class="switch">
                    <input type="checkbox" class="required-checkbox" disabled>
                    <span class="slider round"></span>
                  </label>  
              </div>
          </td>
      `;

    // Event Listener for Delete Button
    const deleteButton = row.querySelector(".delete-row") as HTMLButtonElement;
    deleteButton.addEventListener("click", () => deleteRow(rowId));

    // Event Listener for Dropdown Change
    const dropdown = row.querySelector(
      ".control-dropdown"
    ) as HTMLSelectElement;
    dropdown.addEventListener("change", () =>
      handleControlChange(rowId, dropdown.value)
    );

    // Update the value attribute of the question textbox, whenever there is a change in the textbox value
    const questionTextbox = row.querySelector(
      ".question-textbox"
    ) as HTMLInputElement;

    questionTextbox.addEventListener("input", (event: Event) => {
      const input = event.target as HTMLInputElement;
      input.setAttribute("value", input.value); // Update the value attribute dynamically
    });

    // Event Listener for Required Checkbox Toggle
    const requiredCheckbox = row.querySelector(
      ".required-checkbox"
    ) as HTMLInputElement;
    requiredCheckbox.addEventListener("change", () =>
      handleRequiredFlag(rowId)
    );

    tableBody.appendChild(row);
  }

  // Function to delete a row
  function deleteRow(rowId: number): void {
    const row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
      row.remove();
    }
  }

  // Function to handle control changes
  function handleControlChange(rowId: number, selectedType: string): void {
    const row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (!row) return;
    // disbale the required flag
    const requiredCheckbox = row.querySelector(
      ".required-checkbox"
    ) as HTMLInputElement;
    requiredCheckbox.checked = false;
    requiredCheckbox.disabled = true;

    const controlContainer = row.querySelector(
      ".control-container"
    ) as HTMLDivElement;
    controlContainer.innerHTML = ""; // Clear previous controls

    if (selectedType === "textbox") {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter text";
      input.classList.add("control-element", "textbox");
      controlContainer.appendChild(input);
    } else if (selectedType === "checkbox") {
      const checkboxContainer = document.createElement("div");

      const addOptionButton = document.createElement("button");

      const optionText = document.createElement("input");
      optionText.placeholder = "Option text";
      optionText.classList.add("option-textbox", "admin-control");
      addOptionButton.textContent = "Add Option";
      addOptionButton.classList.add("add-option-btn", "admin-control");
      addOptionButton.onclick = () =>
        optionText.value.trim().length > 0 &&
        addCheckboxOption(checkboxContainer, optionText.value.trim(), rowId);

      controlContainer.appendChild(checkboxContainer);
      controlContainer.appendChild(optionText);
      controlContainer.appendChild(addOptionButton);
    } else if (selectedType === "radio") {
      const radioContainer = document.createElement("div");

      const addOptionButton = document.createElement("button");
      const optionText = document.createElement("input");
      optionText.placeholder = "Option text";
      optionText.name = "radio-group";
      optionText.classList.add("option-textbox", "admin-control");

      addOptionButton.textContent = "Add Option";
      addOptionButton.classList.add("add-option-btn", "admin-control");
      addOptionButton.onclick = () =>
        optionText.value.trim().length > 0 &&
        addRadioOption(radioContainer, optionText.value.trim(), rowId);

      controlContainer.appendChild(radioContainer);
      controlContainer.appendChild(optionText);
      controlContainer.appendChild(addOptionButton);
    }

    const requiredFlag = row.querySelector(
      ".required-checkbox"
    ) as HTMLInputElement;
    requiredFlag.disabled = false;
  }

  // Function to add a checkbox option
  function addCheckboxOption(
    container: HTMLDivElement,
    optionText: string,
    rowId: number
  ): void {
    const label = document.createElement("label");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("control-element");
    label.appendChild(input);
    label.appendChild(document.createTextNode(optionText));

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.classList.add("admin-control");
    removeButton.onclick = () => label.remove();

    label.appendChild(removeButton);
    container.appendChild(label);

    handleRequiredFlag(rowId);

    // empty the option text box option-textbox
    const row = document.querySelector(
      `tr[data-id="${rowId}"]`
    ) as HTMLDivElement;
    // Enable the required flag for control
    const optionTextbox = row.querySelector(
      ".option-textbox"
    ) as HTMLInputElement;
    optionTextbox.value = "";
  }

  // Function to add a radio button option
  function addRadioOption(
    container: HTMLDivElement,
    optionText: string,
    rowId: number
  ): void {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "radio-group";
    input.classList.add("control-element");
    label.appendChild(input);
    label.appendChild(document.createTextNode(optionText));

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.classList.add("admin-control");
    removeButton.onclick = () => label.remove();

    label.appendChild(removeButton);
    container.appendChild(label);
    handleRequiredFlag(rowId);

    // empty the option text box option-textbox
    const row = document.querySelector(
      `tr[data-id="${rowId}"]`
    ) as HTMLDivElement;
    // Enable the required flag for control
    const optionTextbox = row.querySelector(
      ".option-textbox"
    ) as HTMLInputElement;
    optionTextbox.value = "";
  }

  // On required flag toggle
  function handleRequiredFlag(id: number) {
    const row = document.querySelector(`tr[data-id="${id}"]`) as HTMLDivElement;
    // Enable the required flag for control
    const controls = row.querySelectorAll<HTMLInputElement>(".control-element");
    const requiredCheckbox = row.querySelector(
      ".required-checkbox"
    ) as HTMLInputElement;

    controls.forEach((control: HTMLInputElement) => {
      if (requiredCheckbox.checked) {
        control.required = true;
      } else {
        control.required = false;
      }
    });
  }

  function saveForm() {
    // Form the payload to store user entered details alogn with form details
    let payload = {
      userId: Number(localStorage.getItem("userId")),
      formId: formId,
      formData: (
        document.querySelector(".table-container") as HTMLDivElement
      ).innerHTML.toString(),
    };
    let formsList = JSON.parse(
      (localStorage.getItem("formList") as string) || "[]"
    );
    // Get existing forms list & push new one or else update
    if (localStorage.getItem("isNewForm") === "yes") {
      formsList.push(payload);
    } else {
      // update the current form in the list
      formsList.forEach(
        (form: { userId: number; formId: number; formData: string }) => {
          if (
            form.userId === Number(localStorage.getItem("userId")) &&
            formId === Number(form.formId)
          ) {
            form.formData = payload.formData;
          }
        }
      );
    }

    // Save the form data to localStorage
    localStorage.setItem("formList", JSON.stringify(formsList));
    window.navigateTo("listing");
  }

  function previewForm() {
    localStorage.setItem(
      "tempForm",
      (
        document.querySelector(".table-container") as HTMLDivElement
      ).innerHTML.toString()
    );
    window.navigateTo("preview");
  }
}

interface TableRow {
  id: number;
  rowElement: HTMLTableRowElement;
}
