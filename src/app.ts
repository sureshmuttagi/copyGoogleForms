document.addEventListener("DOMContentLoaded", () => {
  function navigateTo(route: string) {
    fetch(`${route}.html`)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("app")!.innerHTML = html;
        // Dynamically load the corresponding TypeScript controller
        if (route === "dashboard")
          import("./controllers/dashboard-page").then((mod) =>
            mod.initializeDashboard()
          );
        else if (route === "listing")
          import("./controllers/form-listing").then((mod) =>
            mod.initializeListing()
          );
        else if (route === "preview")
          import("./controllers/preview-page").then((mod) =>
            mod.initializePreview()
          );
        else if (route === "form")
          import("./controllers/create-form").then((mod) =>
            mod.initializeCreateForm()
          );
      });
  }

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      navigateTo(target.getAttribute("data-route")!);
    });
  });

  // Exposing navigateTo method to window object for using in other ts files
  (window as any).navigateTo = navigateTo;


  navigateTo("listing");
});
