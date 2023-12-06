// import "boxicons";
const chatArea = document.getElementById("chatArea");
const form = document.querySelector("form");
const textarea = Array.from(document.getElementsByTagName("textarea"));
const humanRequest = document.querySelector(".humanRequest");
const botAnswer = document.querySelector(".botAnswer");
const botImageLoader = document.querySelector(".botImageLoader");
const humanImageRequest = document.querySelector(".humanImageRequest");
const botImageAnswer = document.querySelector(".botImageAnswer");
const selectedItems = document.querySelectorAll(".item");
const createImagePage = document.getElementById("createImage");
const createCompletionPage = document.getElementById("createCompletion");
const createImageText = document.querySelector("#createImage #textArea");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modalClose").addEventListener("click", () => {
  modal.classList.remove("open");
});

let loadInterval;

function botLoader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === ".....") {
      element.textContent = "";
    }
  }, 300);
}

function botTyping(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

async function handleCreateCompletion(e) {
  e.preventDefault();
  textarea.forEach(textarea => {
    textarea.style.height = "48px"
  })

  const formData = new FormData(form);
  console.log(textarea);
  form.reset();
  if (!formData.get("prompt")) {
    modal.classList.add("open");
    return;
  }

  botLoader(botAnswer);
  document.querySelector("#copyIcon").style.color = "#6E7681";

  humanRequest.textContent = "";
  humanRequest.textContent = formData.get("prompt");

  chatArea.scrollTop = chatArea.scrollHeight;
  const response = await fetch("https://frankai.onrender.com/openai/chatGptClone", {
    method: "POST",
    body: JSON.stringify({
      prompt: formData.get("prompt"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data } = await response.json();
  if (response.ok) {
    clearInterval(loadInterval);
    botTyping(botAnswer, data.trim());
    console.log(data.trim());
  } else {
    clearInterval(loadInterval);
    botTyping(botAnswer, "Oops!! something went wrong. Please try again later");
  }
}

async function handleImageGeneration() {
  if (!createImageText.value) {
    modal.classList.add("open");
    return;
  }

  botImageAnswer.src = "";
  botLoader(botImageLoader);

  humanImageRequest.textContent = "";
  humanImageRequest.textContent = createImageText.value;

  console.log(createImageText.value);
  chatArea.scrollTop = chatArea.scrollHeight;
  const response = await fetch("https://frankai.onrender.com/openai/imageGeneration", {
    method: "POST",
    body: JSON.stringify({
      prompt: createImageText.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  createImageText.value = "";

  const { data } = await response.json();
  console.log(response);
  if (response.ok) {
    clearInterval(loadInterval);
    botImageAnswer.src = data;
    console.log(data);
  } else {
    clearInterval(loadInterval);
    botTyping(botImageLoader, "Oops!! something went wrong. Please try again later");
  }
}

document.querySelector(".createCompletionBtn").addEventListener("click", handleCreateCompletion);

document.querySelector(".handleImageGenerationBtn").addEventListener("click", (e) => {
  e.preventDefault();
  handleImageGeneration();
});

document.querySelector("textarea").addEventListener("keypress", function (event) {
  if (event.ctrlKey === true) {
    console.log("first");
    handleCreateCompletion(event);
  }
});

selectedItems.forEach((selectedItem, index) => {
  selectedItem.addEventListener("click", () => {
    selectedItems.forEach((unselectedBtn) => {
      unselectedBtn.classList.remove("activeItem");
    });
    selectedItems[index].classList.add("activeItem");

    if (selectedItem.innerText === "Generate Images") {
      createImagePage.style.display = "block";
      createCompletionPage.style.display = "none";
    }

    if (selectedItem.innerText === "Ask Me") {
      createImagePage.style.display = "none";
      createCompletionPage.style.display = "block";
    }
  });
});

document.querySelectorAll(".menuBar").forEach((toggler) => {
  toggler.addEventListener("click", () => {
    document.querySelector("nav").style.left = "0";
    document.querySelector(".navOverlay").style.display = "block";
  });
});

document.querySelector(".navClose").addEventListener("click", function () {
  document.querySelector("nav").style.left = "-200px";
  document.querySelector(".navOverlay").style.display = "none";
});

document.querySelector(".copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(document.querySelector(".botAnswer").textContent);
  document.querySelector("#copyIcon").style.color = "#10A37F";
});


// Automatically grow a text area on typing
for (let i = 0; i < textarea.length; i++) {
  textarea[i].setAttribute("style", "height:" + (textarea[i].scrollHeight) + "px; overflow-y:auto;");
  textarea[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 0;
  if(this.scrollHeight >= 192) {
    this.style.height = "192px"
    return
  }
  this.style.height = (this.scrollHeight) + "px";
}