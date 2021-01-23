function retrieveWindowVariables(...variables) {
  const promises = variables.map((variable) => {
    return new Promise((resolve) => {
      const eventId = `variableRetrieved__${variable}`;
      const container =
        document.body || document.head || document.documentElement;
      const content = `
        const event = new CustomEvent('${eventId}', { detail: ${variable} });
        window.dispatchEvent(event);
      `;

      const script = document.createElement("script");
      script.id = `${variable}-retriever`;
      script.appendChild(document.createTextNode(content));

      const onRetrieved = ({ detail }) => {
        resolve([variable, detail]);
        window.removeEventListener(eventId, onRetrieved);
        container.removeChild(script);
      };

      window.addEventListener(eventId, onRetrieved);

      container.appendChild(script);
    });
  });

  return Promise.all(promises).then((res) =>
    res.reduce((acc, [name, data]) => ({ ...acc, [name]: data }), {})
  );
}

const getDateString = (today = new Date()) => {
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${
    MONTHS[today.getMonth()]
  } ${today.getDate()}, ${today.getFullYear()}`;
};

const createModal = (grid) => {
  const modalWrapper = document.querySelector(".sb-modal-wrapper");
  const modalSystem = document.querySelector(".sb-modal-system");

  const modalFrame = document.createElement("div");
  modalFrame.setAttribute("role", "button");
  modalFrame.setAttribute("class", "sb-modal-frame left-aligned yesterday");

  const hide = () => {
    try {
      modalWrapper.removeChild(modalFrame);
      modalSystem.classList.remove("sb-modal-open");
    } catch (ex) {
      // Just ignore this.
    }
  };

  const show = () => {
    modalWrapper.appendChild(modalFrame);
    modalWrapper.addEventListener("click", function () {
      hide();
      modalWrapper.removeEventListener("click", this);
    });
    modalSystem.classList.add("sb-modal-open");
  };

  const closeButton = document.createElement("div");
  closeButton.setAttribute("role", "button");
  closeButton.setAttribute("class", "sb-modal-close");
  closeButton.innerText = "×";
  closeButton.addEventListener("click", hide);
  modalFrame.appendChild(closeButton);

  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "sb-modal-content");

  const title = document.createElement("h3");
  title.className = "sb-modal-title";
  title.innerText = "Today's grid";
  modalContent.appendChild(title);

  const dateLine = document.createElement("div");
  dateLine.className = "sb-modal-date__yesterday";
  dateLine.innerText = getDateString();
  modalContent.appendChild(dateLine);

  modalContent.appendChild(grid);

  modalFrame.appendChild(modalContent);
  return { show, hide };
};

const addButton = (onShowModal) => {
  const toolbar = document.querySelector("#portal-game-toolbar");
  const yesterday = toolbar.lastChild;
  toolbar.removeChild(yesterday);

  const button = document.createElement("span");
  button.innerHTML = "Today’s Grid";
  button.className = yesterday.className;
  button.addEventListener("click", onShowModal);

  const container = document.createElement("div");
  container.appendChild(button);
  container.appendChild(yesterday);

  toolbar.appendChild(container);
};

const processIntoGrid = ({ answers }) => {
  const [minLength, maxLength] = answers.reduce(
    ([min, max], { length }) => {
      return [Math.min(length, min), Math.max(length, max)];
    },
    [100, 3]
  );

  const firstLetters = [...new Set(answers.map((word) => word[0]))].sort();

  const columns = [
    " ", // This will be the letter column
  ];
  const counts = [];
  for (let i = minLength; i <= maxLength; i += 1) {
    columns.push(i);
    counts.push(i);
  }
  columns.push("Σ"); // The per-letter totals

  // Build out the whole grid. This will be a lot of redundant processing but
  // given the size of our data sets, that shouldn't be an issue. If it's ever
  // a problem (or if I'm bored) then I'll revisit this.
  const rows = [];
  rows.push(columns);

  firstLetters.forEach((letter) => {
    const relevantWords = answers.filter((word) => word.startsWith(letter));
    const row = [
      letter.toUpperCase(),
      ...counts.map(
        (len) => relevantWords.filter((word) => word.length === len).length
      ),
      relevantWords.length,
    ];
    rows.push(row);
  });

  rows.push([
    "Σ", // The letter column
    ...counts.map(
      (len) => answers.filter((word) => word.length === len).length
    ),
    answers.length,
  ]);

  return rows;
};

const createGrid = (info) => {
  const grid = document.createElement("div");
  grid.className = "ext-grid";
  grid.setAttribute(
    "style",
    `grid-template-columns: repeat(${info[0].length}, 1fr)`
  );
  info.forEach((row, y) => {
    row.forEach((cell, x) => {
      let className = "ext-grid-cell";
      if (y === 0) {
        className = "ext-grid-count";
      }

      if (x === 0) {
        className = "ext-grid-letter";
      }

      if (y === info.length - 1) {
        className = "ext-grid-count-total";
      }

      if (x === row.length - 1) {
        className = "ext-grid-letter-total";
      }

      if (x === row.length - 1 && y === info.length - 1) {
        className = "ext-grid-total";
      }

      const node = document.createElement("div");
      node.className = className;
      node.innerText = cell || "-";
      grid.appendChild(node);
    });
  });
  return grid;
};

const onGameData = ({ gameData }) => {
  const grid = processIntoGrid(gameData.today);

  const { show } = createModal(createGrid(grid));
  addButton(show);
};

const onDocumentLoaded = () => {
  retrieveWindowVariables("gameData").then(onGameData);
  window.removeEventListener("load", onDocumentLoaded);
};

window.addEventListener("load", onDocumentLoaded);
