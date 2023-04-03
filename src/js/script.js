// Модалка на вход + запрос на авторизацию----------------------------------------
const token = "a77df976-cc73-4f1b-8224-7f0bab238df9";

const signIn = () => {
  const positionMain = document.querySelector(".main");
  const login = document.querySelector(".header-block__btn");
  const modalLogin = document.querySelector(".modal");
  const closeModal = document.querySelector(".close");
  const createBtn = document.querySelector(".header-block__btn-create");
  login.addEventListener("click", () =>
    modalLogin.classList.toggle("modal--visible")
  );
  closeModal.addEventListener("click", () =>
    modalLogin.classList.remove("modal--visible")
  );

  document.getElementById("login-button").onclick =
    async function requestLogin() {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      event.preventDefault();

      await fetch("https://ajax.test-danit.com/api/v2/cards/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password: password }),
      })
        .then((response) => {
          if (response.ok) {
            modalLogin.style.display = "none";
            login.style.display = "none";
            createBtn.style.display = "flex";
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
          } else {
            console.log("Login failed");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");
  if (storedUsername && storedPassword) {
    document.getElementById("username").value = storedUsername;
    document.getElementById("password").value = storedPassword;
    document.getElementById("login-button").click();
  }
};

signIn();

// Модальное окно создания визита----------------------------------------
class VisitModal {
  constructor() {
    this.modal = null;
  }

  openModal() {
    const modalHtml = this.renderVisit();
    const modalElement = document.createElement("div");
    modalElement.innerHTML = modalHtml;
    this.modal = modalElement.firstChild;
    document.body.appendChild(this.modal);
  }

  renderVisit() {
    return `<form class="main-modal__create-visit">
      <label for="doctor-select">Оберіть лікаря:</label>
      <select id="doctor-select" name="doctor">
        <option value="Кардіолог">Кардіолог</option>
        <option value="Терапевт">Терапевт</option>
        <option value="Стоматолог">Стоматолог</option>
      </select>
      <div id="doctor-fields">
        <label for="purpose">Ціль візиту:</label>
        <input type="text" id="purpose" name="purpose" required><br>

        <label for="description">Короткий опис візиту:</label>
        <textarea id="description" name="description"></textarea><br>

        <label for="urgency">Терміновість:</label>
        <select id="urgency" name="urgency">
          <option value="Звичайна">Звичайна</option>
          <option value="Пріоритетна">Пріоритетная</option>
          <option value="Невідкладна">Невідкладна</option>
        </select><br>
        <label for="fullname">ПІБ:</label>
        <input type="text" id="fullname" name="fullname" required><br>
      </div>
      <div id="doctors-container">
          <label for="pressure">Звичайний тиск:</label>
          <input type="text" id="pressure" name="pressure" required><br>

          <label for="bmi">Індекс маси тіла:</label>
          <input type="text" id="bmi" name="bmi" required><br>

          <label for="heartDiseases">Перенесені захворювання серцево-судинної системи:</label>
          <input type="text" id="heartDiseases" name="heartDiseases" required><br>
          <label for="age">Вік:</label>
          <input type="text" id="age" name="age" required><br>
        </div>
      <button type="submit" class="submit">Записатися на прийом</button>
      <button class="cancel">Закрити</button>
    </form>`;
  }

  therapistRender() {
    return `<div id="doctors-container" >
          <label for="age">Вік:</label>
          <input type="text" id="age" name="age"><br>
        </div>`;
  }

  dentistRender() {
    return `<div id="doctors-container">
          <label for="lastVisit">Дата останього візиту:</label>
          <input type="text" id="lastVisit" name="lastVisit" required><br>
        </div>`;
  }

  cardiologistRender() {
    return `<div id="doctors-container">
          <label for="pressure">Звичайний тиск:</label>
          <input type="text" id="pressure" name="pressure" required><br>

          <label for="bmi">Індекс маси тіла:</label>
          <input type="text" id="bmi" name="bmi" required><br>

          <label for="heartDiseases">Перенесені захворювання серцево-судинної системи:</label>
          <input type="text" id="heartDiseases" name="heartDiseases" required><br>
          <label for="age">Вік:</label>
          <input type="text" id="age" name="age" required><br>
        </div>`;
  }

  initModal() {
    const modal = document.createElement("div");
    modal.classList.add("main-modal");
    modal.innerHTML = this.renderVisit();
    document.body.appendChild(modal);

    const cancelButton = modal.querySelector(".cancel");
    cancelButton.addEventListener("click", this.closeModal.bind(this));
    this.listenForClickOutside();
  }

  listenForClickOutside() {
    this.boundClickOutsideHandler = (event) => {
      const modal = document.querySelector(".main-modal");
      const form = modal.querySelector(".main-modal__create-visit");

      if (!form.contains(event.target)) {
        this.closeModal();
      }
    };

    setTimeout(() => {
      document.addEventListener("click", this.boundClickOutsideHandler);
    }, 0);
  }

  removeClickOutsideListener() {
    document.removeEventListener("click", this.boundClickOutsideHandler);
  }

  closeModal() {
    const modal = document.querySelector(".main-modal");
    this.removeClickOutsideListener();
    modal.parentNode.removeChild(modal);
  }

  whoesDoctor() {
    const doctorFields = document.querySelector("#doctor-fields");
    const doctorsChoose = document.querySelector("#doctor-select");
    doctorsChoose.addEventListener("change", (e) => {
      e.target.value;
      if (e.target.value === "Кардіолог") {
        this.deleteDoctors();
        doctorFields.insertAdjacentHTML("afterend", this.cardiologistRender());
      } else if (e.target.value === "Стоматолог") {
        this.deleteDoctors();
        doctorFields.insertAdjacentHTML("afterend", this.dentistRender());
      } else if (e.target.value === "Терапевт") {
        this.deleteDoctors();
        doctorFields.insertAdjacentHTML("afterend", this.therapistRender());
      }
    });
  }
  deleteDoctors() {
    const removeDoctors = document.querySelector("#doctors-container");
    removeDoctors.remove();
  }

  async pushData() {
    const formElement = document.querySelector(".main-modal__create-visit");
    const submitBtn = document.querySelector(".submit");
    submitBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      if (formElement.checkValidity()) {
        const formData = new FormData(formElement);
        const serverData = Object.fromEntries(formData.entries());
        await requestCreate(serverData);
        this.closeModal();
      } else {
        alert("Будь-ласка, заповніть усі поля.");
      }
    });
  }
}

const requestCreate = async (serverData) => {
  try {
    const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(serverData),
    });
    if (response.ok) {
      await response.json();
      getCards();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
};

// Модалка карточки----------------------------------------
class Cards {
  constructor(
    id,
    fullname,
    doctor,
    purpose,
    description,
    urgency,
    pressure,
    bmi,
    age,
    lastVisit
  ) {
    this.id = id;
    this.fullname = fullname;
    this.doctor = doctor;
    this.purpose = purpose;
    this.description = description;
    this.urgency = urgency;
    this.pressure = pressure;
    this.bmi = bmi;
    this.age = age;
    this.lastVisit = lastVisit;
  }
  renderForm() {
    return `
    <form class="users-card__block" id="${this.id}" data-tab=${this.id} draggable="true" ondragstart="dragStart(event, this)">
      <p class="users-card__title">Дані про Ваш запис (Ваш персональний номер): №${this.id}</p>
      <ul class="users-card__info-list">
        <li class="users-card__info-item" id="fullname">ПІБ: ${this.fullname}</li>
        <li class="users-card__info-item" id="doctor">До лікаря: ${this.doctor}</li>
      </ul>
      <ul class="users-card__full-info-list--hidden" data-tab=${this.id}>
        <li class="users-card__full-info-item" id="purpose">Ціль візиту: ${this.purpose}</li>
        <li class="users-card__full-info-item" id="description">Короткий опис візиту: ${this.description}</li>
        <li class="users-card__full-info-item" id="urgency">Терміновість: ${this.urgency}</li>
        <li class="users-card__full-info-item" id="pressure">Звичайний тиск: ${this.pressure}</li>
        <li class="users-card__full-info-item" id="bmi">Індекс маси тіла: ${this.bmi}</li>
        <li class="users-card__full-info-item" id="heartDiseases">Перенесені захворювання серцево-судинної системи: ${this.heartDiseases}</li>
        <li class="users-card__full-info-item" id="age">Вік: ${this.age}</li>
        <li class="users-card__full-info-item" id="lastVisit">Дата останього візиту: ${this.lastVisit}</li>
      </ul>
      <div class="users-card__delete-icon" onclick="deleteCard(${this.id})"></div>
      <button type="button" class="users-card__button-show-more" onclick="showMore(${this.id}, event)">Показати більше</button>
      <button class="users-card__button-edit" style="display: none;" onclick="editCard(${this.id},event)">Редагувати</button>
    </form>
  `;
  }
  renderEditForm() {
    return `
      <form class="users-card__edit-form" data-tab="${
        this.id
      }" onsubmit="event.preventDefault(); saveEditedCard(${this.id}, this);">
        <label>ПІБ: <input type="text" name="fullname" value="${
          this.fullname
        }"></label>
        <label>Лікар:
        <select name="doctor">
        <option value="Терапевт" ${
          this.doctor === "Терапевт" ? "selected" : ""
        }>Терапевт</option>
        <option value="Кардіолог" ${
          this.doctor === "Кардіолог" ? "selected" : ""
        }>Кардіолог</option>
        <option value="Стоматолог" ${
          this.doctor === "Стоматолог" ? "selected" : ""
        }>Стоматолог</option>
        </select>
        </label>
        <label>Ціль візиту: <input type="text" name="purpose" value="${
          this.purpose
        }"></label>
        <label>Опис візиту: <input type="text" name="description" value="${
          this.description
        }"></label>
        <label>Терміновість:
        <select name="urgency">
        <option value="Звичайна" ${
          this.urgency === "Звичайна" ? "selected" : ""
        }>Звичайна</option>
        <option value="Пріоритетна" ${
          this.urgency === "Пріоритетна" ? "selected" : ""
        }>Пріоритетна</option>
        <option value="Невідкладна" ${
          this.urgency === "Невідкладна" ? "selected" : ""
        }>Невідкладна</option>
        </select>
        </label>
        <label>Звичайний тиск: <input type="text" name="pressure" value="${
          this.pressure
        }"></label>
        <label>Індекс маси тіла: <input type="text" name="bmi" value="${
          this.bmi
        }"></label>
        <label>Вік: <input type="text" name="age" value="${this.age}"></label>
        <label>Дата останього візиту: <input type="text" name="lastVisit" value="${
          this.lastVisit
        }"></label>
        <button type="submit">Зберігти</button>
        <button type="button" onclick="cancelEditing(${
          this.id
        }, event)">Відміна</button>
      </form>
    `;
  }
}
const removeUndefinedEditFields = (id) => {
  const editForm = document.querySelector(
    `form[data-tab="${id}"].users-card__edit-form`
  );
  const inputElements = Array.from(editForm.querySelectorAll("input"));
  inputElements.forEach((input) => {
    if (input.value === "undefined") {
      input.parentElement.remove();
    }
  });
};

const getCards = async () => {
  const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
    method: "GET",
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  });

  const cards = await response.json();
  document.querySelector(".main__users-card").innerHTML = cards
    .map((e) => {
      const newCard = new Cards(
        e.id,
        e.fullname,
        e.doctor,
        e.purpose,
        e.description,
        e.urgency,
        e.pressure,
        e.bmi,
        e.age,
        e.lastVisit
      );
      return newCard.renderForm() + newCard.renderEditForm();
    })
    .join("");
  removeUndefinedFields();
};

const deleteCard = async (id) => {
  const response = await fetch(
    `https://ajax.test-danit.com/api/v2/cards/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    }
  );
  if (response.ok) {
    document.querySelector(`form[data-tab="${id}"]`).remove();
    updateEmptyMessage();
  }
};

const showMore = (id, event) => {
  event.preventDefault();
  const current = document.querySelector(
    `ul[data-tab="${id}"].users-card__full-info-list--hidden`
  );
  const showBtn = event.target;
  const editBtn = document.querySelector(
    `form[data-tab="${id}"] .users-card__button-edit`
  );
  current.classList.remove("users-card__full-info-list--hidden");
  current.classList.add("users-card__full-info-list");
  showBtn.remove();
  editBtn.style.display = "inline-block";
};

const removeUndefinedFields = () => {
  const elements = document.querySelectorAll(
    ".users-card__full-info-list--hidden"
  );
  elements.forEach((element) => {
    const childElements = Array.from(element.children);
    childElements.forEach((child) => {
      if (
        child.textContent.includes("undefined") &&
        child.textContent.trim().length > 0
      ) {
        child.remove();
      }
    });
  });
};

const editCard = (id, event) => {
  event.preventDefault();
  const cardInfo = document.querySelector(`ul[data-tab="${id}"]`);
  const editForm = document.querySelector(
    `form[data-tab="${id}"].users-card__edit-form`
  );
  const deleteIcon = document.querySelector(
    `form[data-tab="${id}"] .users-card__delete-icon`
  );

  cardInfo.style.display = "none";
  editForm.style.display = "block";
  deleteIcon.classList.add("disable-events");
  removeUndefinedEditFields(id);
};

const saveEditedCard = async (id, form) => {
  const formData = new FormData(form);
  const updatedCardData = {};

  formData.forEach((value, key) => {
    if (value !== "undefined") {
      updatedCardData[key] = value;
    }
  });

  const response = await fetch(
    `https://ajax.test-danit.com/api/v2/cards/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${token}`,
      },
      body: JSON.stringify(updatedCardData),
    }
  );

  if (response.ok) {
    getCards();
  } else {
    console.error("Error updating card:", response.status);
  }
};

const cancelEditing = (id, event) => {
  event.preventDefault();
  const cardInfo = document.querySelector(`ul[data-tab="${id}"]`);
  const editForm = document.querySelector(
    `form[data-tab="${id}"].users-card__edit-form`
  );
  const deleteIcon = document.querySelector(
    `form[data-tab="${id}"] .users-card__delete-icon`
  );

  cardInfo.style.display = "block";
  editForm.style.display = "none";
  deleteIcon.classList.remove("disable-events");
};

getCards().then(() => {
  updateEmptyMessage();
});

async function modalToHTML() {
  const createBtn = document.querySelector(".header-block__btn-create");
  createBtn.addEventListener("click", async () => {
    const visitModal = new VisitModal();
    visitModal.initModal();
    visitModal.whoesDoctor();
    await visitModal.pushData();
  });
}

modalToHTML();

// Фильтр карточек
const filterCards = () => {
  const searchInput = document.querySelector("#search");
  const statusSelect = document.querySelector("#status");
  const prioritySelect = document.querySelector("#priority");

  const cards = document.querySelectorAll(".users-card__block");

  cards.forEach((card) => {
    const title = card.querySelector("#fullname").textContent;
    const description = card.querySelector("#description").textContent;
    const status = card.querySelector("#urgency").textContent;
    const priority = card.querySelector("#doctor").textContent;

    const isSearchMatch =
      title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      description.toLowerCase().includes(searchInput.value.toLowerCase());
    const isStatusMatch =
      statusSelect.value === "" || status.includes(statusSelect.value);
    const isPriorityMatch =
      prioritySelect.value === "" || priority.includes(prioritySelect.value);

    if (isSearchMatch && isStatusMatch && isPriorityMatch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

document.querySelector("#search").addEventListener("input", filterCards);
document.querySelector("#status").addEventListener("change", filterCards);
document.querySelector("#priority").addEventListener("change", filterCards);

// Надпись если карточек нет на странице----------------------------------------
const updateEmptyMessage = () => {
  const cards = document.querySelectorAll(".users-card__block");
  const emptyMessageElement = document.querySelector("#empty-message");

  if (cards.length === 0) {
    if (!emptyMessageElement) {
      const message = document.createElement("p");
      message.id = "empty-message";
      message.textContent = "No items have been added";
      document.querySelector(".main__users-card").appendChild(message);
    }
  } else {
    if (emptyMessageElement) {
      emptyMessageElement.remove();
    }
  }
};

// Drag&Drop + нужно фиксить----------------------------------------------
const dragStart = (event) => {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.target.classList.add("dragged");
  setTimeout(() => {
    event.target.style.opacity = "0.0";
  }, 0);
};

const dragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

const drop = (event, target) => {
  event.preventDefault();

  const draggedElementId = event.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedElementId);

  const cards = Array.from(target.querySelectorAll("form.users-card__block"));
  let targetElement;

  draggedElement.style.display = "none";
  const elementUnderCursor = document.elementFromPoint(
    event.clientX,
    event.clientY
  );
  draggedElement.style.display = "";

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (card.contains(elementUnderCursor)) {
      targetElement = card;
      break;
    }
  }

  if (targetElement) {
    if (
      targetElement !== draggedElement &&
      targetElement.nextElementSibling !== draggedElement
    ) {
      target.insertBefore(draggedElement, targetElement);
    }
  } else {
    target.appendChild(draggedElement);
  }
  draggedElement.style.opacity = "1";
  draggedElement.classList.remove("dragged");
};
