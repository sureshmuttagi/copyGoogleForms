export function initializePreview(): void {
  const previewContainer = document.querySelector(
    "#preview-container"
  ) as HTMLDivElement;
  let formData = "";
  let currentFormId = Number(localStorage.getItem("currentFormId"));

  if (localStorage.getItem("tempForm")) {
    // Previewing temp form
    formData = localStorage.getItem("tempForm") as string;
    previewContainer.innerHTML = formData;
  } else {
    // User is filling data
    let formsList = JSON.parse(localStorage.getItem("formList") as string);
    let formData = "";
    formsList.forEach(
      (form: { userId: number; formId: number; formData: string }) => {
        if (
          Number(form.userId) === Number(localStorage.getItem("userId")) &&
          currentFormId === Number(form.formId)
        ) {
          formData = form.formData;
        }
      }
    );

    previewContainer.innerHTML = formData;
  }

  // Remove admin related controls
  const adminControls =
    previewContainer.querySelectorAll<HTMLInputElement>(".admin-control");

  adminControls.forEach((element: HTMLInputElement) => {
    element.remove();
  });

  // Disable the question textbox
  const questionTextboxList =
    previewContainer.querySelectorAll<HTMLInputElement>(".question-textbox");

  questionTextboxList.forEach((element: HTMLInputElement) => {
    element.disabled = true;
  });

  document
    .querySelector("#saveDetails")
    ?.addEventListener("click", handleSaveDetails);

  function handleSaveDetails() {
    const form = document.querySelector("form") as HTMLFormElement;
    const statusDiv = document.querySelector("#statusMsg") as HTMLDivElement;
    statusDiv.innerText = "";

    if (!form.checkValidity()) {
      statusDiv.innerText = "Please fill the manadatory fields...";
      return;
    }
    // Collect all input field values
    const formData: Record<string, string> = {};
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      const inputField = field as HTMLInputElement;
      formData[inputField.name] = inputField.value;
    });

    // Form the payload to store user entered details along with form details
    let payload = {
      userId: localStorage.getItem("userId"),
      formId: currentFormId,
      userData: formData,
    };
    let savedUserDetails = JSON.parse(
      localStorage.getItem("savedUserDetails") || "[]"
    );

    savedUserDetails.push(payload);

    // Save the form data to localStorage in "savedUserDetails" key
    localStorage.setItem("savedUserDetails", JSON.stringify(savedUserDetails));

    // Show confirmation message
    statusDiv.innerText = "Form successfully saved!";
  }
}
