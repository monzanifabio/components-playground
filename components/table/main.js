import "@krakentech/tako-html/lib/tako.min.css";
import "./table.css";

document.querySelectorAll("[data-selectable-table]").forEach((table) => {
  const selectAllCheckbox = table.querySelector("[data-select-all]");
  const rowCheckboxes = [...table.querySelectorAll("tbody input[type='checkbox']")];

  function syncSelectAllCheckbox() {
    const selectedCount = rowCheckboxes.filter((checkbox) => checkbox.checked).length;
    selectAllCheckbox.checked = rowCheckboxes.length > 0 && selectedCount === rowCheckboxes.length;
    selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < rowCheckboxes.length;
  }

  table.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.type !== "checkbox") {
      return;
    }

    if (event.target === selectAllCheckbox) {
      rowCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
        checkbox.closest("tr")?.classList.toggle("tako-table__row--selected", checkbox.checked);
      });
      syncSelectAllCheckbox();
      return;
    }

    event.target.closest("tr")?.classList.toggle("tako-table__row--selected", event.target.checked);
    syncSelectAllCheckbox();
  });
});
