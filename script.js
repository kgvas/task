const children = ["Глеб", "Серафима", "Коля"];
const numTasks = 18;
const password = "parent123"; // замените на свой

function authorize() {
  const input = prompt("Введите пароль родителя:");
  if (input === password) {
    document.body.dataset.auth = "true";
    alert("Доступ разрешён.");
    renderTable();
  } else {
    alert("Неверный пароль.");
  }
}

function getKey(dateStr, name) {
  return `tasks-${dateStr}-${name}`;
}

function getCurrentDate() {
  return document.getElementById("datePicker").value || new Date().toISOString().slice(0, 10);
}

function loadTasks(dateStr, name) {
  const key = getKey(dateStr, name);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : Array(numTasks).fill(false);
}

function saveTasks(dateStr, name, tasks) {
  const key = getKey(dateStr, name);
  localStorage.setItem(key, JSON.stringify(tasks));
}

function renderTable() {
  const body = document.getElementById("taskBody");
  body.innerHTML = "";
  const date = getCurrentDate();

  children.forEach(name => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    row.appendChild(nameCell);

    const tasks = loadTasks(date, name);

    for (let i = 0; i < numTasks; i++) {
      const cell = document.createElement("td");
      if (document.body.dataset.auth === "true") {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tasks[i];
        checkbox.onchange = () => {
          tasks[i] = checkbox.checked;
          saveTasks(date, name, tasks);
          updateChart();
        };
        cell.appendChild(checkbox);
      } else {
        cell.textContent = tasks[i] ? "✔" : "";
      }
      row.appendChild(cell);
    }

    body.appendChild(row);
  });

  updateChart();
}

function updateChart() {
  const chart = document.getElementById("ratingChart");
  chart.innerHTML = "";
  const month = getCurrentDate().slice(0, 7);

  children.forEach(name => {
    let total = 0;
    for (let day = 1; day <= 31; day++) {
      const dayStr = `${month}-${String(day).padStart(2, "0")}`;
      const tasks = loadTasks(dayStr, name);
      total += tasks.filter(Boolean).length;
    }

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = (total * 5) + "px"; // масштаб
    bar.innerHTML = `<div>${total}</div><div>${name}</div>`;
    chart.appendChild(bar);
  });
}

document.getElementById("datePicker").addEventListener("change", renderTable);

// Установка текущей даты при загрузке
document.getElementById("datePicker").value = new Date().toISOString().slice(0, 10);
renderTable();
