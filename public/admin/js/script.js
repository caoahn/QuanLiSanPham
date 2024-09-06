// const { set } = require("mongoose");

//button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href; // chuyen huong sang href
    });
  });
}
//end button status

// form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// end form search

// pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      let url = new URL(window.location.href);
      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }

      window.location.href = url.href;
    });
  });
}
// pagination

// check box multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// end checkbox multi

//form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;

    if (typeChange == "delete-all") {
      const isConfirm = confirm(
        "Bạn có chắc chắn muốn xóa những sản phẩm này không?"
      );
      if (!isConfirm) {
        return;
      }
    } else if (typeChange == "restore-all") {
      const isConfirm = confirm(
        "Bạn có chắc chắn muốn khôi phục những sản phẩm này không?"
      );
      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];

      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
    }
  });
}
// end form change multi

//Show Thong bao
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End show thong bao

//preview image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  const buttonDeleteImage = document.querySelector("[button-delete-image]");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
  buttonDeleteImage.addEventListener("click", () => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
  });
}
//end preview image

// sort
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;
  });

  // thêm selected cho option

  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;

    const optionSelected = sortSelect.querySelector(
      `option[value='${stringSort}']`
    );
    optionSelected.selected = true;
  }
}
// end sort
