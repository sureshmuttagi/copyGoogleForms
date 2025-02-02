export function initializeListing(): void {
  localStorage.removeItem("currentFormId");

  const formsTableBody = document.getElementById(
    "formsTableBody"
  ) as HTMLTableSectionElement;
  const createFormBtn = document.getElementById(
    "createForm"
  ) as HTMLButtonElement;
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Check if user is Admin

  // Retrieve Forms List from LocalStorage
  const formsList: { userId: number; formId: number; userData: string }[] =
    JSON.parse(localStorage.getItem("formList") || "[]");

  // Display Forms in the Table
  function renderFormsTable() {
    formsTableBody.innerHTML = ""; // Clear existing rows

    formsList.forEach((form) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                    <td>${form.userId}</td>
                    <td>${form.formId}</td>
                    <td>
                        <button class="preview-btn" data-formid="${
                          form.formId
                        }">Preview</button>
                        ${
                          isAdmin
                            ? `<button class="edit-btn" data-formid="${form.formId}">Edit</button>`
                            : ""
                        }
                    </td>
                `;

      formsTableBody.appendChild(row);
    });

    if (formsList.length === 0) {
      formsTableBody.innerHTML = `<tr><td colspan="3">No saved forms available.</td></tr>`;
      return;
    }

    // Attach Event Listeners to Preview & Edit Buttons
    document.querySelectorAll(".preview-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const formId = (btn as HTMLButtonElement).getAttribute("data-formid");
        localStorage.setItem("currentFormId", formId || "");
        window.navigateTo("preview"); // Redirect to preview page
      });
    });

    if (isAdmin) {
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const formId = (btn as HTMLButtonElement).getAttribute("data-formid");
          localStorage.setItem("currentFormId", formId || "");
          localStorage.setItem("isNewForm", "no");

          window.navigateTo("form"); // Redirect to create form page
        });
      });
    }
  }

  // Hide "Create Form" Button if User is Not Admin
  if (!isAdmin) {
    createFormBtn.style.display = "none";
  } else {
    createFormBtn.addEventListener("click", () => {
      let currentFormCount =
        Number(localStorage.getItem("formCounter") || 0) + 1;
      localStorage.setItem("formCounter", currentFormCount.toString() || "");
      localStorage.setItem("isNewForm", "yes");
      window.navigateTo("form"); // Redirect to create form page
    });
  }

  renderFormsTable();

  // save form details operations
  const savedFormsTableBody = document.getElementById(
    "savedFormsTableBody"
  ) as HTMLTableSectionElement;

  // Retrieve saved user form details from localStorage
  const savedUserDetails: { userId: string; formId: string; userData: any }[] =
    JSON.parse(localStorage.getItem("savedUserDetails") || "[]");

  // Function to populate table with saved forms
  function renderSavedFormsTable() {
    savedFormsTableBody.innerHTML = ""; // Clear existing rows

    if (savedUserDetails.length === 0) {
      savedFormsTableBody.innerHTML = `<tr><td colspan="3">No saved user forms available.</td></tr>`;
      return;
    }

    savedUserDetails.forEach((form) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${form.userId}</td>
                <td>${form.formId}</td>
                <td>
                    <button class="delete-btn" data-formid="${form.formId}" data-userid="${form.userId}">Delete</button>
                </td>
            `;

      savedFormsTableBody.appendChild(row);
    });

    // Attach event listeners to "View" buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const formId = Number(
          (btn as HTMLButtonElement).getAttribute("data-formid")
        );
        const userId = Number(
          (btn as HTMLButtonElement).getAttribute("data-userid")
        );

       let updatedSavedUserDetails = savedUserDetails.filter(
          (details) =>
            Number(details.userId) !== userId &&
            Number(details.formId) !== formId
        );

        localStorage.setItem(
          "savedUserDetails",
          JSON.stringify(updatedSavedUserDetails)
        );
      });
    });
  }

  renderSavedFormsTable();
}
