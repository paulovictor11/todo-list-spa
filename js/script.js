const tbody = document.querySelector("tbody");
const form = document.querySelector(".add-form");
const input = document.querySelector(".input-task");

const fetchTasks = async () => {
    const response = await fetch("http://localhost:3333/tasks");
    const tasks = await response.json();

    return tasks;
};

const addTask = async (event) => {
    event.preventDefault();

    const task = {
        title: input.value,
    };

    await fetch("http://localhost:3333/tasks", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    loadTasks();
    input.value = "";
};

const updateTask = async (task) => {
    const { id, title, status } = task;

    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, status }),
    });

    loadTasks();
};

const deleteTask = async (id) => {
    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: "delete",
    });

    loadTasks();
};

const formatDate = (dateUTC) => {
    const date = new Date(dateUTC).toLocaleString("pt-br", {
        dateStyle: "long",
        timeStyle: "short",
    });

    return date;
};

const createElement = (tag, innerText = "", innerHTML = "") => {
    const element = document.createElement(tag);

    if (innerText) {
        element.innerText = innerText;
    }

    if (innerHTML) {
        element.innerHTML = innerHTML;
    }

    return element;
};

const createSelect = (value) => {
    const options = `
        <option value="pendente">Pendente</option>
        <option value="em andamento">Em Andamento</option>
        <option value="concluido">Concluído</option>
    `;

    const select = createElement("select", "", options);
    select.value = value;

    return select;
};

const createRow = (task) => {
    const { id, title, created_at, status } = task;

    const tr = createElement("tr");
    const tdTitle = createElement("td", title);
    const tdCreatedAt = createElement("td", formatDate(created_at));
    const tdStatus = createElement("td");
    const tdActions = createElement("td");

    const select = createSelect(status);

    const editForm = createElement("form");
    const editInput = createElement("input");

    editInput.value = title;
    editForm.appendChild(editInput);

    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        updateTask({ ...task, title: editInput.value });
    });

    const editButton = createElement(
        "button",
        "",
        '<span class="material-symbols-outlined">edit</span>'
    );

    const deleteButton = createElement(
        "button",
        "",
        '<span class="material-symbols-outlined">delete</span>'
    );

    editButton.classList.add("btn-action");
    deleteButton.classList.add("btn-action");

    select.addEventListener("change", ({ target }) =>
        updateTask({ ...task, status: target.value })
    );
    editButton.addEventListener("click", () => {
        tdTitle.innerText = "";
        tdTitle.appendChild(editForm);
    });
    deleteButton.addEventListener("click", () => deleteTask(id));

    tdStatus.appendChild(select);

    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCreatedAt);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    return tr;
};

const loadTasks = async () => {
    const tasks = await fetchTasks();

    tbody.innerHTML = "";

    tasks.forEach((task) => {
        const tr = createRow(task);
        tbody.appendChild(tr);
    });
};

form.addEventListener("submit", addTask);

loadTasks();
